import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express, { Request, Response } from "express";
import { db } from '../../database';

const router = express.Router();

router.get("/ratings", async (req: Request, res: Response) => {
    return db
        .select("author", "description", "r.created_at", "u.language")
        .from("ratings as r")
        .join("users as u", "r.user_id", "u.id")
        .orderBy("created_at", "desc")
            .then(ratings => res.json(ratings))
            .catch(err => res.status(500).send(err));
});

router.post("/ratings", async (req: Request, res: Response) => {
    const token = (req?.headers["authorization"] as string || "").split(" ")[1];

    const user_logged: any = jwt.verify(token, process.env.PRIVATE_KEY || "");

    if (!user_logged) return res.status(401);

    const { id } = await db("users")
        .first("id")
        .where({ email: user_logged.email });

    if (!id) return res.status(500);

    const rating: any = {
        author: user_logged.name,
        description: req.body.description,
        user_id: id
    }

    return db("ratings")
        .insert(rating)
            .then(ratings => res.json(ratings))
            .catch(err => res.status(500).send(err));
});

router.post("/signup", async (req: Request, res: Response) => {
    const { name, email, password, language } = req.body;

    const existsEmail: any = await db("users")
        .first()
        .where({ email });

    if (existsEmail) return res.status(404).json({ message: "Email já existe!" });

    const user: any = { name, email, language }
    
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(password, salt);

    const result: any = await db("users")
        .insert(user);
        
    return db("users")
        .first()
        .where({ id: result[0] })
            .then(user => {
                delete user.password_hash;
                delete user.id;

                const token = jwt.sign(user, process.env.PRIVATE_KEY || "");
                
                return res.status(200).json({ token });
            })
            .catch(err => res.status(500).json({ err }));
});

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user: any = await db("users")
        .first()
        .where({ email });

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (validPassword) {
        delete user.password_hash;
        delete user.id;

        const token = jwt.sign(user, process.env.PRIVATE_KEY || "");

        return res.status(200).json({ token });
    }
    else return res.status(401).json({ error: "Senha inválida!" });
});

export default router;