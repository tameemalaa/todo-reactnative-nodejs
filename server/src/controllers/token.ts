import express from "express"; 
import ValidationService from "../services/validationService ";
import TokenizationService from "../services/tokenizationService";

const postTokenRefresh = async (req: express.Request, res: express.Response) :Promise<void> => {
    try{
        console.log('here')
        if (await ValidationService.validateRefreshTokenSchema(req.body)){
            const {refreshToken} = req.body;
            if (await TokenizationService.validateRefreshToken(refreshToken)){
                const accessToken = await TokenizationService.refreshAccessToken(refreshToken);
                res.status(200).json({accessToken: accessToken});
                return;
            }
            res.status(403).json({error: 'Invalid token'});
            return;
        }
        res.status(400).json({error: 'Invalid token'});
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }

}

    export default {postTokenRefresh};