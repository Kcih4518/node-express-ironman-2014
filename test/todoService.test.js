const { expect } = require('chai');
const sinon = require('sinon');
const { Todo } = require('../models');
const TodoService = require('../services/todoService');
const { NotFoundError, BadRequestError } = require('../utils/customErrors');

describe('TodoService', () => {
  let findAllStub, findOneStub, createStub, saveStub, destroyStub;

  beforeEach(() => {
    findAllStub = sinon.stub(Todo, 'findAll');
    findOneStub = sinon.stub(Todo, 'findOne');
    createStub = sinon.stub(Todo, 'create');
    saveStub = sinon.stub().resolves();
    destroyStub = sinon.stub().resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getAllTodos', () => {
    it('should return all todos for a user', async () => {
      const mockTodos = [
        { id: 1, text: 'Todo 1', completed: false, userId: 1 },
        { id: 2, text: 'Todo 2', completed: true, userId: 1 },
      ];
      findAllStub.resolves(mockTodos);

      const result = await TodoService.getAllTodos(1);

      expect(result).to.deep.equal(mockTodos);
      expect(findAllStub).to.have.been.calledOnceWith({ where: { userId: 1 } });
    });
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const newTodo = { id: 1, text: 'New Todo', completed: false, userId: 1 };
      createStub.resolves(newTodo);

      const result = await TodoService.createTodo('New Todo', 1);

      expect(result).to.deep.equal(newTodo);
      expect(createStub).to.have.been.calledOnceWith({
        text: 'New Todo',
        userId: 1,
      });
    });

    it('should throw BadRequestError if text is empty', async () => {
      try {
        await TodoService.createTodo('', 1);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).to.be.instanceOf(BadRequestError);
        expect(error.message).to.equal('Todo text is required');
      }
    });
  });

  describe('getTodoById', () => {
    it('should return a todo by id', async () => {
      const mockTodo = { id: 1, text: 'Todo 1', completed: false, userId: 1 };
      findOneStub.resolves(mockTodo);

      const result = await TodoService.getTodoById(1, 1);

      expect(result).to.deep.equal(mockTodo);
      expect(findOneStub).to.have.been.calledOnceWith({
        where: { id: 1, userId: 1 },
      });
    });

    it('should throw NotFoundError if todo is not found', async () => {
      findOneStub.resolves(null);

      try {
        await TodoService.getTodoById(1, 1);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal('Todo not found');
      }
    });
  });

  describe('toggleTodoCompletion', () => {
    it('should toggle the completion status of a todo', async () => {
      const mockTodo = {
        id: 1,
        text: 'Todo 1',
        completed: false,
        userId: 1,
        save: saveStub,
      };
      findOneStub.resolves(mockTodo);

      const result = await TodoService.toggleTodoCompletion(1, 1);

      expect(result.completed).to.be.true;
      expect(saveStub).to.have.been.calledOnce;
    });

    it('should throw NotFoundError if todo is not found', async () => {
      findOneStub.resolves(null);

      try {
        await TodoService.toggleTodoCompletion(1, 1);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal('Todo not found');
      }
    });
  });

  describe('updateTodoText', () => {
    it('should update the text of a todo', async () => {
      const mockTodo = {
        id: 1,
        text: 'Old Todo',
        completed: false,
        userId: 1,
        save: saveStub,
      };
      findOneStub.resolves(mockTodo);

      const result = await TodoService.updateTodoText(1, 'Updated Todo', 1);

      expect(result.text).to.equal('Updated Todo');
      expect(saveStub).to.have.been.calledOnce;
    });

    it('should throw BadRequestError if new text is empty', async () => {
      try {
        await TodoService.updateTodoText(1, '', 1);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).to.be.instanceOf(BadRequestError);
        expect(error.message).to.equal('Todo text is required');
      }
    });

    it('should throw NotFoundError if todo is not found', async () => {
      findOneStub.resolves(null);

      try {
        await TodoService.updateTodoText(1, 'Updated Todo', 1);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal('Todo not found');
      }
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      const mockTodo = {
        id: 1,
        text: 'Todo to Delete',
        completed: false,
        userId: 1,
        destroy: destroyStub,
      };
      findOneStub.resolves(mockTodo);

      const result = await TodoService.deleteTodo(1, 1);

      expect(result).to.deep.equal({ message: 'Todo deleted successfully' });
      expect(destroyStub).to.have.been.calledOnce;
    });

    it('should throw NotFoundError if todo is not found', async () => {
      findOneStub.resolves(null);

      try {
        await TodoService.deleteTodo(1, 1);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal('Todo not found');
      }
    });
  });
});
