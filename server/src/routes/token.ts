import express from "express"; 
import token from '../controllers/token' ;

const router = express.Router();

router.post('/refresh', token.postTokenRefresh);

export default router;