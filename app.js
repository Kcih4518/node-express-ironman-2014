import express from "express";
import { join } from "path";
import { create } from "express-handlebars";

const app = express();
const port = 3000;

// Set Express handlebars as the view engine
const exphdbs = create({
  extname: ".handlebars",
  defaultLayout: "main",
  layoutsDir: join(process.cwd(), "views", "layouts"),
  partialsDir: join(process.cwd(), "views", "partials"),
});

// Register the handlebars engine with Express
app.engine("handlebars", exphdbs.engine);
// Set the view engine to handlebars
app.set("view engine", "handlebars");
// Set the views directory
app.set("views", join(process.cwd(), "views"));

// Define a route for the root URL
app.get("/", (req, res) => {
  res.render("home", {
    title: "Hello, Handlebars with .handlebars extension!",
  });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
