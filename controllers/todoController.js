const todoService = require("../services/todoService");
const { NotFoundError, BadRequestError } = require("../utils/customErrors");

class TodoController {
  async getAllTodos(req, res, next) {
    try {
      const todos = await todoService.getAllTodos(req.user.id);
      res.render("todos", {
        todos,
        username: req.user.username,
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTodo(req, res, next) {
    try {
      const { todo } = req.body;
      if (!todo) {
        throw new BadRequestError("Todo text is required");
      }
      await todoService.createTodo(todo, req.user.id);
      res.redirect("/todos");
    } catch (error) {
      next(error);
    }
  }

  async toggleTodo(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const updatedTodo = await todoService.toggleTodoCompletion(
        id,
        req.user.id
      );
      if (!updatedTodo) {
        throw new NotFoundError("Todo not found");
      }
      res.redirect("/todos");
    } catch (error) {
      next(error);
    }
  }

  async deleteTodo(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const deletedTodo = await todoService.deleteTodo(id, req.user.id);
      if (!deletedTodo) {
        throw new NotFoundError("Todo not found");
      }
      res.redirect("/todos");
    } catch (error) {
      next(error);
    }
  }

  async getEditTodoPage(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const todo = await todoService.getTodoById(id, req.user.id);
      if (!todo) {
        throw new NotFoundError("Todo not found");
      }
      res.render("editTodo", { todo });
    } catch (error) {
      next(error);
    }
  }

  async updateTodo(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const { text } = req.body;
      if (!text) {
        throw new BadRequestError("Todo text is required");
      }
      const updatedTodo = await todoService.updateTodoText(
        id,
        text,
        req.user.id
      );
      if (!updatedTodo) {
        throw new NotFoundError("Todo not found");
      }
      res.redirect("/todos");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TodoController();
