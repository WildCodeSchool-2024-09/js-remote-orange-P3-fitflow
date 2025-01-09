import type { RequestHandler } from "express";
import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";
import type { RowDataPacket } from 'mysql2';
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET;

interface User extends RowDataPacket {
    id: number;
    email: string;
    password: string;
    user_role: string;
}

type ValidatorError = {
    field: string;
    message: string;
}

const checkUser: RequestHandler = async (req, res, next) => {
    const errors: ValidatorError[] = [];
    const email = req.body.email;
    const password = req.body.password;

    const [rows] = await databaseClient.query<User[]>(
        "SELECT * FROM user WHERE email = ?",
        [email],
    );
    if (rows.length === 0) {
        errors.push({ field: "email", message: "Ce compte n'existe pas. Veuillez créer un compte" });
    } else {
        const user = rows[0];
        try {
            const passwordIsValid = await bcrypt.compare(password, user.password);
            if (!passwordIsValid) {
                errors.push({ field: "password", message: "Mot de passe incorrect" });
            } else {
                req.user = user;
            }
        } catch (error) {
            console.error("Erreur lors de la comparaison des mots de passe:", error);
            errors.push({ field: "password", message: "Erreur lors de la vérification du mot de passe" });
        }
    }

    if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
    }
    next();
}

const login: RequestHandler = async (req, res, next) => {
    try {
        await checkUser(req, res, next);
        if (req.user) {
            const token = jwt.sign({ user: req.user }, JWT_SECRET, { expiresIn: "12h" });
            res.status(200)
            .cookie("token", token, { httpOnly: true })
            .json({ 
                success: true,
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    user_role: req.user.user_role,
                },
                redirectUrl: "/dashboard"
            });
        } else {
            res.status(401).json({ message: "Authentification échouée" });
        }
    } catch (error) {
        console.error("Erreur lors de la vérification du compte:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}

export default { login, checkUser };