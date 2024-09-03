const express = require("express");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { Todo } = require("../models");

const router = express.Router();

router.get("/", authenticateJWT, async (req, res) => {
  const todos = await Todo.findAll({ where: { userId: req.user.id } });
  res.render("todos", { todos, username: req.user.username });
});

router.post("/", authenticateJWT, async (req, res) => {
  const { todo } = req.body;
  await Todo.create({ text: todo, userId: req.user.id });
  res.redirect("/todos");
});

router.post("/:id/toggle", authenticateJWT, async (req, res) => {
  const id = parseInt(req.params.id);
  const todo = await Todo.findOne({ where: { id, userId: req.user.id } });
  if (todo) {
    todo.completed = !todo.completed;
    await todo.save();
  }
  res.redirect("/todos");
});

router.post("/:id/delete", authenticateJWT, async (req, res) => {
  const id = parseInt(req.params.id);
  await Todo.destroy({ where: { id, userId: req.user.id } });
  res.redirect("/todos");
});

router.get("/:id/edit", authenticateJWT, async (req, res) => {
  const id = parseInt(req.params.id);
  const todo = await Todo.findOne({ where: { id, userId: req.user.id } });
  if (todo) {
    res.render("editTodo", { todo });
  } else {
    res.redirect("/todos");
  }
});

router.post("/:id/update", authenticateJWT, async (req, res) => {
  const id = parseInt(req.params.id);
  const { text } = req.body;
  const todo = await Todo.findOne({ where: { id, userId: req.user.id } });
  if (todo) {
    todo.text = text;
    await todo.save();
  }
  res.redirect("/todos");
});

module.exports = router;
