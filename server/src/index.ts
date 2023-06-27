import { getPrismaClient } from './prismaClient';
import cors from 'cors' ;
import express from 'express';
import userRoutes from  './routes/user';
import dotenv from 'dotenv' ;

dotenv.config();
const PORT: number = parseInt(process.env.PORT || '3000', 10)
const prisma = getPrismaClient();
const app = express();
app.use(express.json());
app.use(cors({origin: '*',}));
app.use('/user', userRoutes);
app.listen(PORT, (): void => {
  console.log(`Server listening on port ${process.env.PORT}`);
});