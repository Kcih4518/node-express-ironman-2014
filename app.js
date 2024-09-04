require('dotenv').config();

const express = require('express');
const { create } = require('express-handlebars');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const { createServer } = require('http');
const { join } = require('path');
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes.js');
const todoRoutes = require('./routes/todoRoutes.js');
const errorHandler = require('./middlewares/errorHandleMiddleware.js');
const { NotFoundError } = require('./utils/customErrors');

const app = express();
const server = createServer(app);

// Set up Express-Handlebars
const hbs = create({
  defaultLayout: 'main',
  extname: '.handlebars',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

// Set up static files folder
app.use(express.static(join(__dirname, 'public')));

// Set up body-parser
app.use(express.urlencoded({ extended: true }));

// Setting middleware : method-override
app.use(methodOverride('_method'));

app.use(express.json());

// Set up cookie-parser
app.use(cookieParser());

// User list
let users = [];

// Routes
app.get('/', (req, res) => {
  res.render('home');
});

app.use('/', authRoutes);
app.use('/todos', todoRoutes);

// Error handling middleware

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('404', {
    message:
      'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
    layout: 'main',
  });
});

// Other error handler
app.use(errorHandler);

// Start server with Sequelize
const PORT = process.env.PORT;

sequelize.sync().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');

  server.close(() => {
    console.log('HTTP server closed');

    sequelize
      .close()
      .then(() => {
        console.log('Database connection closed');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Error while closing database connection:', err);
        process.exit(1);
      });
  });
});
