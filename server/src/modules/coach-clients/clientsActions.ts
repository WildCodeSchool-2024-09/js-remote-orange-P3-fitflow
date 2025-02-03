import clientsRepository from "./clientsRepository";
import type { RequestHandler } from "express";
import coachRepository from "../coach/coachRepository";
import { isValidPhoneNumber } from "libphonenumber-js";

type User = {
    user: any;
    id: number;
    user_role: string;
}

const validate: RequestHandler = async (req, res, next) => {

    type ValidatorError = {
        field: string;
        message: string;
    }
    const errors: ValidatorError[] = [];

    const userData: User = req.user as unknown as User;
    const coachId = await coachRepository.getCoachId(userData.user.id);

    const { email, first_name, last_name, phone, gender, birth_date, weight_kg, height_cm, notes } = req.body;

    // Check if the email is valid
    const emailRegex = /[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/;
    if (email === "") {
        errors.push({ field: "email", message: "L'email ne peut pas être vide" });
    } else if (!emailRegex.test(email)) {
        errors.push({ field: "email", message: "L'email n'est pas valide" });
    } else {
        const exists = await clientsRepository.checkEmailExistence(email, coachId.id);
        if (exists) {
            errors.push({ field: "email", message: "Cet email existe déjà dans votre liste de clients." });
        }
    }

    // Check if the first name is not empty
    if (typeof first_name !== "string" || first_name.length < 2 || first_name.length > 255) {
        errors.push({ field: "first_name", message: "Le prénom de votre client doit être une chaîne de caractères contenant au moins 2 caractères et maximum 255 caractères" });
    }

    // Check if the last name is not empty
    if (typeof last_name !== "string" || last_name.length < 2 || last_name.length > 255) {
        errors.push({ field: "last_name", message: "Le nom de votre clientdoit être une chaîne de caractères contenant au moins 2 caractères et maximum 255 caractères" });
    }

    // Check if the phone number is not empty
    const formattedPhoneNumber = `+${phone}`;
    if (!isValidPhoneNumber(formattedPhoneNumber)) {
        errors.push({ field: "phone", message: "Le numéro de téléphone n'est pas valide" });
    }

    // Check if the gender is valid
    if (gender === "" || gender !== "male" && gender !== "female") {
        errors.push({ field: "gender", message: "Le genre de votre client doit être soit 'Homme' ou 'Femme'" });
    }

    // Check if the birth date is not empty
    if (birth_date === "" || !birth_date) {
        errors.push({ field: "birth_date", message: "La date de naissance de votre client est requise" });
    }

    // Check if the weight is not empty & is a number
    if (weight_kg === "") {
        errors.push({ field: "weight_kg", message: "Le poids de votre client est requis" });
    } else {
        const weightNum = Number(weight_kg);
        if (isNaN(weightNum)) {
            errors.push({ field: "weight_kg", message: "Le poids de votre client doit être un nombre" });
        }
    }

    // Check if the height is not empty & is a number
    if (height_cm === "") {
        errors.push({ field: "height_cm", message: "La taille de votre client est requise" });
    } else {
        const heightNum = Number(height_cm);
        if (isNaN(heightNum)) {
            errors.push({ field: "height_cm", message: "La taille de votre client doit être un nombre" });
        }
    }

    // If there are errors, return a 400 status with the errors
    if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
    }

    // If there are no errors, proceed to the next middleware
    next();
}

const browse: RequestHandler = async (req, res, next) => {
    try {
        const userData: User = req.user as unknown as User;
        if (!userData) {
            res.status(401).json({ error: "Utilisateur non authentifié" });
        }
        const coachId = await coachRepository.getCoachId(userData.user.id);
        const clients = await clientsRepository.readAll(coachId.id);
        res.json(clients);
    } catch (err) {
        next(err);
    }
}

const read: RequestHandler = async (req, res, next) => {
    try {
        const clientId = Number(req.params.id);
        const client = await clientsRepository.read(clientId);

        if (client === null) {
            res.sendStatus(404);
        } else {
            res.json(client);
        }
    } catch (err) {
        next(err);
    }
}

const add: RequestHandler = async (req, res, next) => {
    try {
        const newClient = {
            coach_id: req.body.coach_id,
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            gender: req.body.gender,
            birth_date: req.body.birth_date,
            weight_kg: req.body.weight_kg,
            height_cm: req.body.height_cm,
            notes: req.body.notes,
        }
        const insertId = await clientsRepository.create(newClient);
        res.status(201).json({ insertId });
    } catch (err) {
        next(err);
    }
}

const edit: RequestHandler = async (req, res, next) => {
    try {
        const client = {
            id: Number(req.params.id),
            coach_id: req.body.coach_id,
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            gender: req.body.gender,
            birth_date: req.body.birth_date,
            weight_kg: req.body.weight_kg,
            height_cm: req.body.height_cm,
            notes: req.body.notes,
        }
        const affectedRows = await clientsRepository.update(client);
        if (affectedRows === 0) {
            res.sendStatus(404);
        } else {
            res.sendStatus(204);
        }
    } catch (err) {
        next(err);
    }
}

const destroy: RequestHandler = async (req, res, next) => {
    try {
        const clientId = Number(req.body.id);
        const clientIds = req.body.ids;
        if (clientId) {
            await clientsRepository.delete(clientId);
        } else if (clientIds) {
            await clientsRepository.deleteList(clientIds);
        }
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

const destroyWithParams: RequestHandler = async (req, res, next) => {
    try {
        const clientId = Number(req.params.id);
        await clientsRepository.delete(clientId);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

const destroyList: RequestHandler = async (req, res, next) => {
    try {
        const clientIds = req.body.ids;
        await clientsRepository.deleteList(clientIds);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

export default { validate, browse, read, add, edit, destroy, destroyWithParams, destroyList };
