import express from 'express';
import roleRoutes from './role.routes.js';
import userRoutes from './user.routes.js';  


const router = express.Router();

// router.get('/', (req, res) => {
//   res.send("User Route is Working!!").status(404);
// });

router.use('/user', roleRoutes);
router.use('/user', userRoutes);



// function registerroutes(app){
//     app.use('/api/v1/hms', router);
// }

export default router;