const todoService = require("../services/todoService");

class TodoController {
  async getAllTodos(req, res) {
    const todos = await todoService.getAllTodos(req.user.id);
    res.render("todos", { todos, username: req.user.username, user: req.user });
  }

  async createTodo(req, res) {
    const { todo } = req.body;
    await todoService.createTodo(todo, req.user.id);
    res.redirect("/todos");
  }

  async toggleTodo(req, res) {
    const id = parseInt(req.params.id);
    await todoService.toggleTodoCompletion(id, req.user.id);
    res.redirect("/todos");
  }

  async deleteTodo(req, res) {
    const id = parseInt(req.params.id);
    await todoService.deleteTodo(id, req.user.id);
    res.redirect("/todos");
  }

  async getEditTodoPage(req, res) {
    const id = parseInt(req.params.id);
    const todo = await todoService.getTodoById(id, req.user.id);
    if (todo) {
      res.render("editTodo", { todo });
    } else {
      res.redirect("/todos");
    }
  }

  async updateTodo(req, res) {
    const id = parseInt(req.params.id);
    const { text } = req.body;
    await todoService.updateTodoText(id, text, req.user.id);
    res.redirect("/todos");
  }
}

module.exports = new TodoController();
