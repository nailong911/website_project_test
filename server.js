const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));
const upload = multer({ dest: path.join(uploadDir, 'tmp') });

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Simple logger
app.use((req,res,next)=>{ console.log(new Date().toISOString(), req.method, req.url); next(); });

// Auth: register
app.post('/api/auth/register', async (req,res) => {
  try {
    const { username, email, password, nickname } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const exists = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
    if (exists) return res.status(400).json({ error: 'User exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hash, nickname }
    });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Auth: login
app.post('/api/auth/login', async (req,res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await prisma.user.findFirst({ where: { OR: [{ username }, { email: username }] } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// auth middleware
function auth(req,res,next){
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'No token' });
  const token = h.split(' ')[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (e){
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// me endpoint
app.get('/api/auth/me', auth, async (req,res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, username: true, email: true, nickname: true, avatar: true, bio: true, createdAt: true } });
  res.json(user);
});

// Projects
app.get('/api/projects', async (req,res) => {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(projects);
});
app.post('/api/projects', auth, async (req,res) => {
  const { title, description, image } = req.body;
  const p = await prisma.project.create({ data: { userId: req.user.id, title, description, image } });
  res.json(p);
});

// Notes (user-specific)
app.get('/api/notes', auth, async (req,res) => {
  const notes = await prisma.note.findMany({ where: { userId: req.user.id }, orderBy: { updatedAt: 'desc' } });
  res.json(notes);
});
app.post('/api/notes', auth, async (req,res) => {
  const { title, content, tags } = req.body;
  const n = await prisma.note.create({ data: { userId: req.user.id, title, content, tags } });
  res.json(n);
});

// Scores
app.get('/api/scores', auth, async (req,res) => {
  const s = await prisma.score.findMany({ where: { userId: req.user.id }, orderBy: { date: 'desc' } });
  res.json(s);
});
app.post('/api/scores', auth, async (req,res) => {
  const { course, score, date } = req.body;
  const item = await prisma.score.create({ data: { userId: req.user.id, course, score: Number(score), date: date ? new Date(date) : null } });
  res.json(item);
});

// Hobbies
app.get('/api/hobbies', auth, async (req,res) => {
  const h = await prisma.hobby.findMany({ where: { userId: req.user.id } });
  res.json(h);
});
app.post('/api/hobbies', auth, async (req,res) => {
  const { name } = req.body;
  const item = await prisma.hobby.create({ data: { userId: req.user.id, name } });
  res.json(item);
});

// Expenses
app.get('/api/expenses', auth, async (req,res) => {
  const e = await prisma.expense.findMany({ where: { userId: req.user.id }, orderBy: { date: 'desc' } });
  res.json(e);
});
app.post('/api/expenses', auth, async (req,res) => {
  const { title, amount, type, date } = req.body;
  const item = await prisma.expense.create({ data: { userId: req.user.id, title, amount: Number(amount), type, date: date ? new Date(date) : null } });
  res.json(item);
});

// file upload (avatar, works)
app.post('/api/upload', upload.single('file'), (req,res)=>{
  if (!req.file) return res.status(400).json({ error: 'No file' });
  // move file to uploads/ with original name preserved
  const dest = path.join(uploadDir, Date.now() + '_' + req.file.originalname);
  fs.renameSync(req.file.path, dest);
  res.json({ url: '/uploads/' + path.basename(dest) });
});

// test
app.get('/api/test', async (req,res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server listening on http://0.0.0.0:' + PORT);
});
