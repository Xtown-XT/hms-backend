import { Router } from 'express';
import GuestFeedbackController from '../guest_feedback/guest_feedback.controller.js';
import { verifyToken, authorizeRole } from '../middleware/index.js';

const router = Router();

router.get('/guest-feedbacks', verifyToken, authorizeRole(['admin']), GuestFeedbackController.getAllFeedbacks);
router.get('/guest-feedback/:id', verifyToken, authorizeRole(['admin', 'user']), GuestFeedbackController.getFeedbackById);
router.post('/guest-feedback', verifyToken, authorizeRole(['admin', 'user']), GuestFeedbackController.createFeedback);
router.put('/guest-feedback/:id', verifyToken, authorizeRole(['admin', 'user']), GuestFeedbackController.updateFeedback);
router.delete('/guest-feedback/:id', verifyToken, authorizeRole(['admin']), GuestFeedbackController.deleteFeedback);
router.patch('/guest-feedback/restore/:id', verifyToken, authorizeRole(['admin']), GuestFeedbackController.restoreFeedback);

export default router;
