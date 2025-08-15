import epxress from 'express';
import {protect} from '../middleware/authMiddleware.js';
import { createTask,deleteTask,getTasks, updateTask } from '../controllers/taskController.js';

const router=epxress.Router();
router.use(protect);

router.get('/',getTasks);
router.post('/',createTask);
router.put('/:id',updateTask);
router.delete('/:id',deleteTask);


export default router;