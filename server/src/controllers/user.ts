import express from "express"; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getPrismaClient } from "../prismaClient";
import ValidationService from "../services/validationService ";

const postUserSignUp = async (req: express.Request, res: express.Response) :Promise<void> => {
    console.log(req.body);
    if (await ValidationService.validateUserSchema(req.body)){
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
        const user = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword
            }
        });
        const token = jwt.sign({id: user.id}, process.env.SECRET_KEY as string);
        res.status(200).json(token);
    }else{
        res.status(400).json({error: 'Invalid user data'});
    }
}

const postUserSignIn= async (req: express.Request, res: express.Response) :Promise<void> => {}

export default {
    postUserSignUp,
    postUserSignIn
}