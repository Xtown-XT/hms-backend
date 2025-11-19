import express from 'express';
import GuestFeedbackRoutes from '../guest_feedback/guest_feedback.routes.js'; 

const router = express.Router();

router.use('/guest-feedback', GuestFeedbackRoutes);
export default router;
