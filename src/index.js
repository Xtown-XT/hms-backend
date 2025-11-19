import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import {responseHelper } from './middleware/index.js';
import userRoutes from './user/routes/index.js';
import categoryRoutes from './category/routes/index.js';
import orderRoutes from './order/routes/index.js';
import qrRoutes from './qr/routes/qr.routes.js';
import profileRoutes from './profile/routes/profile.routes.js';
import otpRoutes from "./otp/otp.routes.js";
import diningRoutes from './dining/routes/dining.routes.js';
import digitalmenuRoutes from './digital_menu/routes/index.js';
import frontofficeRoutes from './frontoffice/routes/index.js';
import GuestFeedbackRoutes from './guest_feedback/index.js'; 
import RoomserviceRoutes from './room_service/index.js';
import RoomdeliveryRoutes from './room_delivery/index.js';
import NotificationRoutes from './notification/index.js';
import InventoryRoutes from './inventory/routes/index.js';



const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(responseHelper);

app.get('/', (req, res) => {
  res.send("Hello World!!").status(404);
}
);

app.get('/api/data', (req, res) => {
  res.sendSuccess({ value: 42 }, 'Data fetched successfully');
});

app.get('/api/error', (req, res) => {
  res.sendError('Something went wrong', 422, [{ field: 'email', message: 'Invalid' }]);
});

//routes
app.use('/api/v1', userRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', qrRoutes);
app.use('/api/v1', profileRoutes);
app.use("/api/v1", otpRoutes);
app.use('/api/v1', diningRoutes);
app.use('/api/v1', digitalmenuRoutes);
app.use('/api/v1', frontofficeRoutes);
app.use('/api/v1',GuestFeedbackRoutes);
app.use('/api/v1',RoomserviceRoutes);
app.use('/api/v1',RoomdeliveryRoutes);
app.use('/api/v1',NotificationRoutes);
app.use('/api/v1',InventoryRoutes);

app.use((req, res) => {
  return res.sendError('Route not found', 404);
});

export default app; 