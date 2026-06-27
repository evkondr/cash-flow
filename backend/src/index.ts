import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { prisma } from './utils/prisma-client';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: '50mb'}));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));


app.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    console.log(users);
    res.send('chat api');
  } catch (error) {
    console.log(error)
    res.send('bad request');
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

