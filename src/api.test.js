import { api } from './api';

const BASE_URL = 'http://localhost:5000';

// mock fetch globally
global.fetch = jest.fn();

// mock localStorage
const mockLocalStorage = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] ?? null),
        setItem: jest.fn((key, value) => { store[key] = value; }),
        clear: jest.fn(() => { store = {}; }),
    };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const mockJsonResponse = (data) => ({
    json: jest.fn().mockResolvedValue(data),
});

beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('mock_token');
});

// ─── register ─────────────────────────────────────────────────

describe('api.register', () => {
    test('calls correct endpoint with correct body', async () => {
        fetch.mockResolvedValue(mockJsonResponse({ token: 'mock_token', username: 'testuser' }));

        const result = await api.register('testuser', 'test@test.com', 'password123');

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'testuser', email: 'test@test.com', password: 'password123' }),
        });
        expect(result).toEqual({ token: 'mock_token', username: 'testuser' });
    });
});

// ─── login ────────────────────────────────────────────────────

describe('api.login', () => {
    test('calls correct endpoint with correct body', async () => {
        fetch.mockResolvedValue(mockJsonResponse({ token: 'mock_token', username: 'testuser', flowers: [] }));

        const result = await api.login('test@test.com', 'password123');

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@test.com', password: 'password123' }),
        });
        expect(result).toEqual({ token: 'mock_token', username: 'testuser', flowers: [] });
    });
});

// ─── saveFlower ───────────────────────────────────────────────

describe('api.saveFlower', () => {
    test('calls correct endpoint with token and flower data', async () => {
        const flower = { name: 'Rose', image: '/flower1.png' };
        fetch.mockResolvedValue(mockJsonResponse({ flowers: [flower] }));

        const result = await api.saveFlower(flower);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/flowers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer mock_token',
            },
            body: JSON.stringify({ flower }),
        });
        expect(result).toEqual({ flowers: [flower] });
    });

    test('sends null token if not logged in', async () => {
        mockLocalStorage.getItem.mockReturnValue(null);
        fetch.mockResolvedValue(mockJsonResponse({ error: 'No token' }));

        await api.saveFlower({ name: 'Rose' });

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/flowers`, expect.objectContaining({
            headers: expect.objectContaining({
                'Authorization': 'Bearer null',
            }),
        }));
    });
});

// ─── deleteFlower ─────────────────────────────────────────────

describe('api.deleteFlower', () => {
    test('calls correct endpoint with index and token', async () => {
        fetch.mockResolvedValue(mockJsonResponse({ flowers: [] }));

        const result = await api.deleteFlower(1);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/flowers/1`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer mock_token' },
        });
        expect(result).toEqual({ flowers: [] });
    });
});

// ─── getFlowers ───────────────────────────────────────────────

describe('api.getFlowers', () => {
    test('calls correct endpoint with token', async () => {
        fetch.mockResolvedValue(mockJsonResponse({ flowers: ['f1', 'f2'] }));

        const result = await api.getFlowers();

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/flowers`, {
            headers: { 'Authorization': 'Bearer mock_token' },
        });
        expect(result).toEqual({ flowers: ['f1', 'f2'] });
    });
});