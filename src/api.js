const BASE_URL = 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

export const api = {
    register: async (username, email, password) => {
        const res = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        return res.json();
    },

    login: async (email, password) => {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },

    saveFlower: async (flower) => {
        const res = await fetch(`${BASE_URL}/flowers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ flower })
        });
        return res.json();
    },

    deleteFlower: async (index) => {
        const res = await fetch(`${BASE_URL}/flowers/${index}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        return res.json();
    },

    getFlowers: async () => {
        const res = await fetch(`${BASE_URL}/flowers`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        return res.json();
    }
};