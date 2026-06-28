import { Router } from 'express';
import { getAll, getById, create, update, deleteProfession } from '../controllers/professionController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Protegendo as rotas (assumindo que todas requerem auth)
router.use(authMiddleware);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteProfession);

export default router;
