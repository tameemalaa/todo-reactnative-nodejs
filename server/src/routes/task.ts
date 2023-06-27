import express from "express"; 
import task from '../controllers/task' ;
import authorizationMiddleware from '../middlewares/authorization';

const router = express.Router();

router.get('/finished', authorizationMiddleware,task.getFinishedTask);
router.get('/unfinished', authorizationMiddleware,task.getUnfinishedTask);
router.get('/', authorizationMiddleware,task.getTask);
router.post('/', authorizationMiddleware,task.postTask);
router.delete('/:id', authorizationMiddleware,task.deleteTask);
router.patch('/:id', authorizationMiddleware,task.patchTask);


export default router;