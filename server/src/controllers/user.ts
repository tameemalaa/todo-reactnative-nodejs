import express from "express"; 
import bcrypt from 'bcrypt';
import { getPrismaClient } from "../prismaClient";
import ValidationService from "../services/validationService ";
import TokenizationService from "../services/tokenizationService";

const postUserSignUp = async (req: express.Request, res: express.Response) :Promise<void> => {
    try{
    if (await ValidationService.validateUserSignUpSchema(req.body)){
        const {username, email, password} = req.body;
        const prisma = getPrismaClient();
        const emailExists = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });
        const userExists = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        if (emailExists || userExists){
            res.status(400).json({error: 'User already exists'});
            return;
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = bcrypt.hashSync(password, salt);
        await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword
            }
        });
        res.status(201).send();
    }else{
        res.status(400).json({error: 'Invalid user data'});
    }}catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
}

const postUserSignIn= async (req: express.Request, res: express.Response) :Promise<void> => {
    try {
    if (await ValidationService.validateUserSignInSchema(req.body)){
        const {usernameOrEmail, password} = req.body;
        const prisma = getPrismaClient();
        const user = await prisma.user.findFirst({
            where: {
              OR: [
                { username: usernameOrEmail },
                { email: usernameOrEmail },
              ],
            },
          });
        if (!user){
            res.status(403).json({error: 'Invalid credentials'});
            return;
        }
        if (!bcrypt.compareSync(password, user.password)){
            res.status(403).json({error: 'Invalid credentials'});
            return;
        }
        const tokenPair = await TokenizationService.generateTokenPair(user.id);
        res.status(200).json(tokenPair);
    }else{
        res.status(400).json({error: 'Invalid credentials'});
    }}catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
}

export default {
    postUserSignUp,
    postUserSignIn
}