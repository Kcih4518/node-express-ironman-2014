const express = require("express");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const todoController = require("../controllers/todoController");

const router = express.Router();

router.get("/", authenticateJWT, todoController.getAllTodos);
router.post("/", authenticateJWT, todoController.createTodo);
router.post("/:id/toggle", authenticateJWT, todoController.toggleTodo);
router.post("/:id/delete", authenticateJWT, todoController.deleteTodo);
router.get("/:id/edit", authenticateJWT, todoController.getEditTodoPage);
router.post("/:id/update", authenticateJWT, todoController.updateTodo);

module.exports = router;
