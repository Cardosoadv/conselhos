import { Router } from 'express';
import { getAll, getById, create, update, deleteProf, getNextRegNumber } from '../controllers/professionalController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Secure all routes with authentication middleware
router.use(authMiddleware);

router.get('/', getAll);
router.get('/next-registration', getNextRegNumber);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteProf);

export default router;
