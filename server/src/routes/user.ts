import express from "express"; 
import user from '../controllers/user' ;

const router = express.Router();

router.post('/signup', user.postUserSignUp);
router.post('/signin', user.postUserSignIn);

export default router;