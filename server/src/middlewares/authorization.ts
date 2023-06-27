import express from "express"; 
import TokenizationService from "../services/tokenizationService";

const authorizationMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) :Promise<void> => {
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
        if (await TokenizationService.validateAccessToken(token)){
            res.locals.userId = await TokenizationService.getUserIdFromToken(token);
            next();
            return;
        }else{
            res.status(403).json({error: 'Invalid token'});
            return;
        }
    }
    res.status(401).json({ message: 'No token provided' });
}catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
}

    export default authorizationMiddleware;