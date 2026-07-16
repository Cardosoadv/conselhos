import { Router } from 'express';
import { getAll, getById, create, update, deleteComp } from '../controllers/companyController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Secure all routes with authentication middleware
router.use(authMiddleware);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteComp);

export default router;
