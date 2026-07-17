import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import settingsRoutes from './routes/settingsRoutes';
import professionRoutes from './routes/professionRoutes';
import professionalRoutes from './routes/professionalRoutes';
import companyRoutes from './routes/companyRoutes';
import processRoutes from './routes/processRoutes';
import { initDB } from './config/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/professions', professionRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/processes', processRoutes);

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
