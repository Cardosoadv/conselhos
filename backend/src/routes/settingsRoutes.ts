import { Router } from 'express';
import { getConfig, updateConfig } from '../controllers/settingsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Protege as rotas com o middleware de autenticação
router.use(authMiddleware);

router.get('/', getConfig);
router.put('/', updateConfig);

export default router;
