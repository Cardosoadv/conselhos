import { Router } from 'express';
import * as processController from '../controllers/processController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', processController.getAll);
router.get('/:id', processController.getById);
router.get('/by-professional/:professionalId', processController.getByProfessional);
router.get('/by-company/:companyId', processController.getByCompany);
router.post('/:id/documents', processController.addDocument);
router.post('/documents/:docId/sign', processController.signDoc);

export default router;
