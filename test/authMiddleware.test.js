const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('../middlewares/authMiddleware');

describe('authMiddleware', () => {
  let req, res, next, jwtVerifyStub;

  beforeEach(() => {
    req = {
      cookies: {},
    };
    res = {
      redirect: sinon.spy(),
    };
    next = sinon.spy();
    jwtVerifyStub = sinon.stub(jwt, 'verify');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call next() if valid token is provided', () => {
    req.cookies.token = 'validtoken';
    jwtVerifyStub.yields(null, { id: 1, username: 'testuser' });

    authenticateJWT(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(req.user).to.deep.equal({ id: 1, username: 'testuser' });
    expect(res.redirect.notCalled).to.be.true;
  });

  it('should redirect to /register if no token is provided', () => {
    authenticateJWT(req, res, next);

    expect(res.redirect.calledOnceWith('/register')).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should redirect to /register if token verification fails', () => {
    req.cookies.token = 'invalidtoken';
    jwtVerifyStub.yields(new Error('Token verification failed'));

    authenticateJWT(req, res, next);

    expect(res.redirect.calledOnceWith('/register')).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should use config.JWT_SECRET if available', () => {
    const originalJwtSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'testsecret';

    req.cookies.token = 'validtoken';
    jwtVerifyStub.yields(null, { id: 1, username: 'testuser' });

    authenticateJWT(req, res, next);

    expect(jwtVerifyStub.calledWith('validtoken', 'testsecret')).to.be.true;

    process.env.JWT_SECRET = originalJwtSecret;
  });

  it('should handle errors during token verification', () => {
    req.cookies.token = 'validtoken';
    const verificationError = new Error('Token expired');
    jwtVerifyStub.yields(verificationError);

    const consoleErrorStub = sinon.stub(console, 'error');

    authenticateJWT(req, res, next);

    expect(
      consoleErrorStub.calledWith('JWT verification failed:', verificationError)
    ).to.be.true;
    expect(res.redirect.calledOnceWith('/register')).to.be.true;
    expect(next.notCalled).to.be.true;

    consoleErrorStub.restore();
  });
});
