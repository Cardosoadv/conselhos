import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import settingsRoutes from './routes/settingsRoutes';
import professionRoutes from './routes/professionRoutes';
import professionalRoutes from './routes/professionalRoutes';
import { initDB } from './config/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/professions', professionRoutes);
app.use('/api/professionals', professionalRoutes);

// Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Backend rodando perfeitamente!' });
});

// Iniciar DB e Servidor
initDB().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
});
