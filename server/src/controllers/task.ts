import express from 'express';
import { PrismaClient } from '@prisma/client';
import ValidationService from '../services/validationService ';

const getFinishedTask = async (req: express.Request, res: express.Response) :Promise<void> => {
    try{
        const prisma = new PrismaClient();
        const tasks = await prisma.task.findMany({
            where: {
                userId: res.locals.userId,
                finished: true
            }
        });
        res.status(200).json(tasks);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
}

const getUnfinishedTask = async (req: express.Request, res: express.Response) :Promise<void> =>  {
    try{
        const prisma = new PrismaClient();
        const tasks = await prisma.task.findMany({
            where: {
                userId: res.locals.userId,
                finished: false
            }
        });
        res.status(200).json(tasks);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
}

const getTask = async (req: express.Request, res: express.Response) :Promise<void> =>  {
    try{
        const prisma = new PrismaClient();
        const tasks = await prisma.task.findMany({
            where: {
                userId: res.locals.userId
            }
        });
        res.status(200).json(tasks);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
}

const postTask = async (req: express.Request, res: express.Response) :Promise<void> =>  {
    try{
        if (await ValidationService.validatePostTaskSchema(req.body)){
            const prisma = new PrismaClient();
            const task = await prisma.task.create({
                data: {
                    title: req.body.title,
                    description: req.body.description,
                    priority: req.body.priority,
                    deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
                    finished: req.body.finished,
                    userId: res.locals.userId,
                }
            });
            res.status(201).json(task);
            return;
        }
        res.status(400).json({error: 'Invalid task'});
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
}

const deleteTask = async (req: express.Request, res: express.Response) :Promise<void> =>  {
    try{
        const prisma = new PrismaClient();
        const {id} = req.params;
        const task = await prisma.task.findUnique({
            where: {
                id: id
            }
        });
        if (task && task.userId === res.locals.userId){
            await prisma.task.delete({
                where: {
                    id: id
                }
            });
            res.status(200).json(task);
            return;
        }else if(!task){
            res.status(404).json({error: 'Task not found'});
        }else{
        res.status(403).json({error: 'Unauthorized Access'});
    }
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
}

const patchTask = async (req: express.Request, res: express.Response) :Promise<void> =>  {
    try{
        if (!await ValidationService.validatePatchTaskSchema(req.body)){
            res.status(400).json({error: 'Invalid task'});
            return;
        }
        const prisma = new PrismaClient();
        const {id} = req.params;
        const task = await prisma.task.findUnique({
            where: {
                id: id
            }
        });
        if (task && task.userId === res.locals.userId){
            const updatedTask = await prisma.task.update({
                where: {
                    id: id
                },
                data: {
                    title: req.body.title,
                    description: req.body.description,
                    priority: req.body.priority,
                    deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
                    finished: req.body.finished,
                }
            });
            res.status(200).json(updatedTask);
            return;
        }else if(!task){
            res.status(404).json({error: 'Task not found'});
        }else{
        res.status(403).json({error: 'Unauthorized Access'});
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
}

export default {getUnfinishedTask,getFinishedTask,getTask,postTask,deleteTask,patchTask};