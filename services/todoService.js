const { Todo } = require("../models");

class TodoService {
  async getAllTodos(userId) {
    return await Todo.findAll({ where: { userId } });
  }

  async createTodo(text, userId) {
    return await Todo.create({ text, userId });
  }

  async getTodoById(id, userId) {
    return await Todo.findOne({ where: { id, userId } });
  }

  async toggleTodoCompletion(id, userId) {
    const todo = await this.getTodoById(id, userId);
    if (todo) {
      todo.completed = !todo.completed;
      await todo.save();
    }
    return todo;
  }

  async updateTodoText(id, text, userId) {
    const todo = await this.getTodoById(id, userId);
    if (todo) {
      todo.text = text;
      await todo.save();
    }
    return todo;
  }

  async deleteTodo(id, userId) {
    return await Todo.destroy({ where: { id, userId } });
  }
}

module.exports = new TodoService();
