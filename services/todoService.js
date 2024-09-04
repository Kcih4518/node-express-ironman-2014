const { Todo } = require('../models');
const { NotFoundError, BadRequestError } = require('../utils/customErrors');

class TodoService {
  async getAllTodos(userId) {
    return await Todo.findAll({ where: { userId } });
  }

  async createTodo(text, userId) {
    if (!text) {
      throw new BadRequestError('Todo text is required');
    }
    return await Todo.create({ text, userId });
  }

  async getTodoById(id, userId) {
    const todo = await Todo.findOne({ where: { id, userId } });
    if (!todo) {
      throw new NotFoundError('Todo not found');
    }
    return todo;
  }

  async toggleTodoCompletion(id, userId) {
    const todo = await this.getTodoById(id, userId);
    todo.completed = !todo.completed;
    await todo.save();
    return todo;
  }

  async updateTodoText(id, text, userId) {
    if (!text) {
      throw new BadRequestError('Todo text is required');
    }
    const todo = await this.getTodoById(id, userId);
    todo.text = text;
    await todo.save();
    return todo;
  }

  async deleteTodo(id, userId) {
    const todo = await this.getTodoById(id, userId);
    await todo.destroy();
    return { message: 'Todo deleted successfully' };
  }
}

module.exports = new TodoService();
