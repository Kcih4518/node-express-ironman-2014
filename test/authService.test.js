const { expect } = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
chai.use(sinonChai);

const AuthService = require('../services/authService');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { BadRequestError, UnauthorizedError } = require('../utils/customErrors');

describe('AuthService', () => {
  let findOneStub, createStub, bcryptHashStub, bcryptCompareStub, jwtSignStub;

  beforeEach(() => {
    findOneStub = sinon.stub(User, 'findOne');
    createStub = sinon.stub(User, 'create');
    bcryptHashStub = sinon.stub(bcrypt, 'hash');
    bcryptCompareStub = sinon.stub(bcrypt, 'compare');
    jwtSignStub = sinon.stub(jwt, 'sign');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('registerUser', () => {
    it('should create a new user and return a token', async () => {
      findOneStub.resolves(null);
      createStub.resolves({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
      bcryptHashStub.resolves('hashedpassword');
      jwtSignStub.returns('faketoken');

      const result = await AuthService.registerUser(
        'testuser',
        'password',
        'test@example.com'
      );

      expect(result).to.have.property('user');
      expect(result.user).to.deep.equal({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
      expect(result).to.have.property('token', 'faketoken');
      expect(findOneStub).to.have.been.calledTwice;
      expect(createStub).to.have.been.calledOnce;
      expect(bcryptHashStub).to.have.been.calledOnce;
      expect(jwtSignStub).to.have.been.calledOnce;
    });

    it('should throw BadRequestError if username already exists', async () => {
      findOneStub.onFirstCall().resolves({ username: 'testuser' });

      try {
        await AuthService.registerUser(
          'testuser',
          'password',
          'test@example.com'
        );
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).to.be.instanceOf(BadRequestError);
        expect(error.message).to.equal('Username already exists');
      }
    });

    it('should throw BadRequestError if email already in use', async () => {
      findOneStub.onFirstCall().resolves(null);
      findOneStub.onSecondCall().resolves({ email: 'test@example.com' });

      try {
        await AuthService.registerUser(
          'testuser',
          'password',
          'test@example.com'
        );
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).to.be.instanceOf(BadRequestError);
        expect(error.message).to.equal('Email already in use');
      }
    });
  });

  describe('loginUser', () => {
    it('should return user and token for valid credentials', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        toJSON: () => ({
          id: 1,
          username: 'testuser',
          password: 'hashedpassword',
        }),
      };
      findOneStub.resolves(mockUser);
      bcryptCompareStub.resolves(true);
      jwtSignStub.returns('faketoken');

      const result = await AuthService.loginUser('testuser', 'password');

      expect(result).to.have.property('user');
      expect(result.user).to.deep.equal({ id: 1, username: 'testuser' });
      expect(result.user).to.not.have.property('password');
      expect(result).to.have.property('token', 'faketoken');
      expect(findOneStub).to.have.been.calledOnce;
      expect(bcryptCompareStub).to.have.been.calledOnce;
      expect(jwtSignStub).to.have.been.calledOnce;
    });

    it('should throw UnauthorizedError for non-existent user', async () => {
      findOneStub.resolves(null);

      try {
        await AuthService.loginUser('nonexistent', 'password');
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).to.be.instanceOf(UnauthorizedError);
        expect(error.message).to.equal('Invalid username or password');
      }
    });

    it('should throw UnauthorizedError for invalid password', async () => {
      findOneStub.resolves({
        username: 'testuser',
        password: 'hashedpassword',
      });
      bcryptCompareStub.resolves(false);

      try {
        await AuthService.loginUser('testuser', 'wrongpassword');
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).to.be.instanceOf(UnauthorizedError);
        expect(error.message).to.equal('Invalid username or password');
      }
    });
  });
});
