const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

jest.mock('fs');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockUser = {
    id: '123',
    username: 'testuser',
    email: 'test@test.com',
    password: 'hashedpassword',
    flowers: [],
};

const mockDB = { users: [mockUser] };

beforeEach(() => {
    jest.clearAllMocks();
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify(mockDB));
    fs.writeFileSync.mockImplementation(() => {});
});

    test('returns empty users array if db file does not exist', () => {
        fs.existsSync.mockReturnValue(false);
        const { readDB } = require('./server');
        expect(readDB()).toEqual({ users: [] });
    });

    test('returns parsed db if file exists', () => {
        const { readDB } = require('./server');
        expect(readDB()).toEqual(mockDB);
    });

    test('writes stringified data to db file', () => {
        const { writeDB } = require('./server');
        writeDB(mockDB);
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            expect.stringContaining('db.json'),
            JSON.stringify(mockDB, null, 2)
        );
    });

    test('calls next if token is valid', () => {
        jwt.verify.mockReturnValue({ id: '123' });
        const { authMiddleware } = require('./server');
        const req = { headers: { authorization: 'Bearer valid_token' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('valid_token', expect.any(String));
        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual({ id: '123' });
    });

    test('returns 401 if no token', () => {
        const { authMiddleware } = require('./server');
        const req = { headers: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'No token' });
        expect(next).not.toHaveBeenCalled();
    });

    test('returns 401 if token is invalid', () => {
        jwt.verify.mockImplementation(() => { throw new Error('Invalid'); });
        const { authMiddleware } = require('./server');
        const req = { headers: { authorization: 'Bearer bad_token' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    });

    test('registers a new user successfully', async () => {
        fs.readFileSync.mockReturnValue(JSON.stringify({ users: [] }));
        bcrypt.hash.mockResolvedValue('hashedpassword');
        jwt.sign.mockReturnValue('mock_token');

        const { registerHandler } = require('./server');
        const req = { body: { username: 'testuser', email: 'new@test.com', password: 'password123' } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await registerHandler(req, res);

        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(fs.writeFileSync).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            token: 'mock_token',
            username: 'testuser',
        }));
    });

    test('returns 400 if email already registered', async () => {
        const { registerHandler } = require('./server');
        const req = { body: { username: 'testuser', email: 'test@test.com', password: 'password123' } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await registerHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email already registered!' });
        expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    test('logs in successfully with correct credentials', async () => {
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('mock_token');

        const { loginHandler } = require('./server');
        const req = { body: { email: 'test@test.com', password: 'password123' } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await loginHandler(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            token: 'mock_token',
            username: 'testuser',
            flowers: [],
        }));
    });

    test('returns 400 if email not found', async () => {
        const { loginHandler } = require('./server');
        const req = { body: { email: 'wrong@test.com', password: 'password123' } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await loginHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Wrong email or password!' });
    });

    test('returns 400 if password does not match', async () => {
        bcrypt.compare.mockResolvedValue(false);

        const { loginHandler } = require('./server');
        const req = { body: { email: 'test@test.com', password: 'wrongpassword' } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await loginHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Wrong email or password!' });
    });

    test('saves a flower successfully', () => {
        const { saveFlowerHandler } = require('./server');
        const req = { user: { id: '123' }, body: { flower: { name: 'Rose' } } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        saveFlowerHandler(req, res);

        expect(fs.writeFileSync).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ flowers: [{ name: 'Rose' }] });
    });

    test('returns 400 if user already has 4 flowers', () => {
        fs.readFileSync.mockReturnValue(JSON.stringify({
            users: [{ ...mockUser, flowers: ['f1', 'f2', 'f3', 'f4'] }],
        }));

        const { saveFlowerHandler } = require('./server');
        const req = { user: { id: '123' }, body: { flower: { name: 'Rose' } } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        saveFlowerHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Max 4 flowers!' });
        expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    test('deletes a flower at given index', () => {
        fs.readFileSync.mockReturnValue(JSON.stringify({
            users: [{ ...mockUser, flowers: ['f1', 'f2', 'f3'] }],
        }));

        const { deleteFlowerHandler } = require('./server');
        const req = { user: { id: '123' }, params: { index: '1' } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        deleteFlowerHandler(req, res);

        expect(fs.writeFileSync).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ flowers: ['f1', 'f3'] });
    });

    test('returns flowers for authenticated user', () => {
        fs.readFileSync.mockReturnValue(JSON.stringify({
            users: [{ ...mockUser, flowers: ['f1', 'f2'] }],
        }));

        const { getFlowersHandler } = require('./server');
        const req = { user: { id: '123' } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        getFlowersHandler(req, res);

        expect(res.json).toHaveBeenCalledWith({ flowers: ['f1', 'f2'] });
    });
