import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: '50mb'}));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));


app.get('/', (req, res) => {
  res.send('chat api');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

