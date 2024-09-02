import express from "express";
import { create } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Sequelize, DataTypes } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

// Set up Express-Handlebars
const hbs = create({
  defaultLayout: "main",
  extname: ".handlebars",
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

// Set up static files folder
app.use(express.static(join(__dirname, "public")));

// Set up Sequelize
const sequelize = new Sequelize("postgres", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

try {
  await sequelize.authenticate();
  console.log("Connection to database has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// User list
let users = [];

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Join chat room
  socket.on("join", (username) => {
    if (username) {
      socket.username = username;
      users.push(username);
      io.emit("updateUsers", users);
      socket.broadcast.emit("message", {
        user: "System",
        text: `${username} joined the chat room`,
      });
    }
  });

  // Send message
  socket.on("sendMessage", (message) => {
    if (socket.username && message) {
      io.emit("message", { user: socket.username, text: message });
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    if (socket.username) {
      console.log("User disconnected:", socket.username);
      users = users.filter((user) => user !== socket.username);
      io.emit("updateUsers", users);
      socket.broadcast.emit("message", {
        user: "System",
        text: `${socket.username} left the chat room`,
      });
    } else {
      console.log("An unnamed user disconnected");
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
