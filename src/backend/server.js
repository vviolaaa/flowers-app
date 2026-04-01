const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const SECRET = process.env.SERVER_SECRET || 'wildflower_secret_key';
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

const readDB = () => {
    if (!fs.existsSync(DB_PATH)) return { users: [] };
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
};

const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const registerHandler = async (req, res) => {
    const { username, email, password } = req.body;
    const db = readDB();

    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Email already registered!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password: hashedPassword,
        flowers: []
    };

    db.users.push(newUser);
    writeDB(db);

    const token = jwt.sign({ id: newUser.id, username, email }, SECRET, { expiresIn: '7d' });
    res.json({ token, username, email });
};

const loginHandler = async (req, res) => {
    const { email, password } = req.body;
    const db = readDB();

    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: 'Wrong email or password!' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Wrong email or password!' });

    const token = jwt.sign({ id: user.id, username: user.username, email }, SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username, email, flowers: user.flowers });
};

const saveFlowerHandler = (req, res) => {
    const { flower } = req.body;
    const db = readDB();

    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.flowers.length >= 4) return res.status(400).json({ error: 'Max 4 flowers!' });

    user.flowers.push(flower);
    writeDB(db);
    res.json({ flowers: user.flowers });
};

const deleteFlowerHandler = (req, res) => {
    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.flowers.splice(req.params.index, 1);
    writeDB(db);
    res.json({ flowers: user.flowers });
};

const getFlowersHandler = (req, res) => {
    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ flowers: user.flowers });
};

// routes
app.post('/register', registerHandler);
app.post('/login', loginHandler);
app.post('/flowers', authMiddleware, saveFlowerHandler);
app.delete('/flowers/:index', authMiddleware, deleteFlowerHandler);
app.get('/flowers', authMiddleware, getFlowersHandler);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = {
    readDB,
    writeDB,
    authMiddleware,
    registerHandler,
    loginHandler,
    saveFlowerHandler,
    deleteFlowerHandler,
    getFlowersHandler,
};