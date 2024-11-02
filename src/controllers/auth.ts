import { Request, Response, NextFunction } from "express";
import { prismaClient } from "..";
import { hashSync,compareSync } from 'bcrypt';
import { error } from "console";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secret";
import { BadRequestsException } from "../exception/badRequest";
import { ErrorCode } from "../exception/root";
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

export const addFromXLSX = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name } = req.body;

    try {
        const user = await prisma.user.findFirst({ where: { email } });

        if (user) {
            next(new BadRequestsException("The user already exists", ErrorCode.USER_ALREADY_EXIST));
            return;
        }

        // If the request body contains 'data', treat it as Excel data and insert it into the database
        if (req.body.data) {
            const { data } = req.body;

            // Map the Excel data to match the User model
            const usersData = data.map((row: any) => ({
                name: row.name,
                email: row.email,
                password: hashSync(row.password, 10),
            }));

            // Insert the mapped data into the users table
            await prisma.user.createMany({
                data: usersData,
                skipDuplicates: true,
            });

            res.status(201).json({ message: 'Data inserted successfully' });
            return;
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10),
            },
        });

        res.json(newUser);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// export const login = async (req: Request, res: Response) => {
//     const { email, password } = req.body;
//     let user = await prismaClient.user.findFirst({ where: { email } });

//     if (!user) {
//         throw Error("User doesn't exist");
//     }

//     if (!compareSync(password, user.password)) {
//         throw Error("Incorrect password");
//     }

//     const token = jwt.sign({
//         userid: user.Id,
//     }, JWT_SECRET);

//     res.json({ user, token });
// };
