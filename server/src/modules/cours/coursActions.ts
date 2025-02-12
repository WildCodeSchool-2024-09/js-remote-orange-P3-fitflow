import coursRepository from "./coursRepository";
import coachRepository from "../coach/coachRepository";
import type { RequestHandler } from "express";
import coursSubscriptionsRepository from "../cours-subscriptions/coursSubscriptionsRepository";

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

    const { title, description_notes, price, is_free, start_date, start_time, end_time, location_link, max_participants, current_status } = req.body;

    if (typeof title !== "string" || title.length < 2 || title.length > 255) {
        errors.push({ field: "title", message: "Le titre du cours doit être une chaîne de caractères contenant au moins 2 caractères et maximum 255 caractères" });
    }

    if (typeof current_status !== "string" || !["draft", "published", "full", "finished", "cancelled"].includes(current_status)) {
        errors.push({ field: "current_status", message: "Le statut du cours n'est pas valide" });
    }

    if (typeof description_notes !== "string" || description_notes.length < 1) {
        errors.push({ field: "description_notes", message: "Veuillez entrer une description du cours" });
    }

    if (typeof price !== "number") {
        errors.push({ field: "price", message: "Le prix du cours doit être un nombre" });
    } else if (price < 0) {
        errors.push({ field: "price", message: "Le prix du cours ne peut pas être négatif" });
    } else if (is_free === false && price === 0) {
        errors.push({ field: "price", message: "Si le cours est gratuit, veuillez cocher la case" });
    }

    if (typeof is_free !== "boolean") {
        errors.push({ field: "is_free", message: "Vous devez cocher la case pour indiquer que le cours est gratuit" });
    }

    if (start_date === "" || !start_date) {
        errors.push({ field: "start_date", message: "La date de début du cours est requise" });
    }

    if (start_time === "" || !start_time) {
        errors.push({ field: "start_time", message: "L'heure de début du cours est requise" });
    }

    if (end_time === "" || !end_time) {
        errors.push({ field: "end_time", message: "L'heure de fin du cours est requise" });
    }

    if (location_link === "" || !location_link) {
        errors.push({ field: "location_link", message: "Veuillez entrer une URL Google Maps valide" });
    } else if (!location_link.toLowerCase().includes('google.com/maps') && 
               !location_link.toLowerCase().includes('maps.app.goo.gl')) {
        errors.push({ field: "location_link", message: "L'URL Google Maps n'est pas valide" });
    }

    if (max_participants === "" || !max_participants) {
        errors.push({ field: "max_participants", message: "Le nombre de participants maximum est requis" });
    } else if (typeof max_participants !== "number" || max_participants < 1) {
        errors.push({ field: "max_participants", message: "Le nombre de participants maximum doit être un nombre supérieur à 0" });
    }

    if (errors.length > 0) {
        res.status(400).json({ errors });
    } else {
        next();
    }
}

const browse: RequestHandler = async (req, res, next) => {
    try {
        const userData: User = req.user as unknown as User;
        if (!userData) {
            res.status(401).json({ error: "Utilisateur non authentifié" });
        }
        const coachId = await coachRepository.getCoachId(userData.user.id);
        const cours = await coursRepository.readAll(coachId.id);
        
        // Récupérer le nombre de participants pour chaque cours
        const coursWithParticipantsCount = await Promise.all(cours.map(async (course) => {
            const participants = await coursSubscriptionsRepository.readAllClients(course.id);
            return {
                ...course,
                participants_count: participants.length // Ajout du nombre de participants
            };
        }));
        res.json(coursWithParticipantsCount);
    } catch (err) {
        next(err);
    }
};

const read: RequestHandler = async (req, res, next) => {
    try {
        const coursId = Number(req.params.id);
        const cours = await coursRepository.read(coursId);
        
        if (cours === null) {
            res.sendStatus(404);
        } else {
            // Récupérer les participants
            const participants = await coursSubscriptionsRepository.readAllClients(coursId);
            
            // Combiner les données du cours et des participants
            res.json({
                ...cours,
                participants
            });
        }
    } catch (err) {
        next(err);
    }
}

const add: RequestHandler = async (req, res, next) => {
    try {
        const newCours = {
            coach_id: req.body.coach_id,
            current_status: req.body.current_status,
            title: req.body.title,
            description_notes: req.body.description_notes,
            price: req.body.price,
            is_free: req.body.is_free,
            start_date: req.body.start_date,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            location_link: req.body.location_link,
            max_participants: req.body.max_participants,
            participants: [],
        }
        const insertId = await coursRepository.create(newCours);
        res.status(201).json({ insertId });
    } catch (err) {
        next(err);
    }
}

const edit: RequestHandler = async (req, res, next) => {
    try {
        const cours = {
            id: Number(req.params.id),
            coach_id: req.body.coach_id,
            current_status: req.body.current_status,
            title: req.body.title,
            description_notes: req.body.description_notes,
            price: req.body.price,
            is_free: req.body.is_free,
            start_date: req.body.start_date,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            location_link: req.body.location_link,
            max_participants: req.body.max_participants,
            participants: [],
        }
        const affectedRows = await coursRepository.update(cours);
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
        const isDeleteParticipant = req.body.is_delete_participant;
        const isMultipleDelete = req.body.is_multiple_delete;
        const coursId = Number(req.params.id);
        
        if (isDeleteParticipant) {
            // Vérification que client_id est un nombre
            const clientId = Number(req.body.client_id);
            if (isNaN(clientId)) {
                res.status(400).json({ error: "client_id invalide" });
            }
            await coursSubscriptionsRepository.deleteParticipant(coursId, clientId);
        } else if (isMultipleDelete) {
            // Vérification que client_id est un tableau
            if (!Array.isArray(req.body.client_id)) {
                res.status(400).json({ error: "client_id doit être un tableau pour la suppression multiple" });
            }
            await coursSubscriptionsRepository.deleteMultipleParticipants(coursId, req.body.client_id);
        } else {
            await coursRepository.delete(coursId);
        }
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

export default { browse, read, add, edit, destroy, validate };