import coursSubscriptionsRepository from "./coursSubscriptionsRepository";
import { RequestHandler } from "express";

const browseCourses: RequestHandler = async (req, res, next) => {
    try {
        const coursParticipants = await coursSubscriptionsRepository.readAllCourses(Number(req.params.id));
        res.json(coursParticipants);
    } catch (err) {
        next(err);
    }
}

const readCours: RequestHandler = async (req, res, next) => {
    try {
        const clientId = req.body.client_id;
        const cours = await coursSubscriptionsRepository.readAllCourses(Number(clientId));
        res.json(cours);
    } catch (err) {
        next(err);
    }
}

const addParticipant: RequestHandler = async (req, res, next) => {
    try {
        const coursParticipants = await coursSubscriptionsRepository.addParticipant(Number(req.params.id), Number(req.body.client_id));
        res.status(201).json({ insertId: coursParticipants.insertId });
    } catch (err) {
        next(err);
    }
}

export default {
    browseCourses,
    addParticipant,
    readCours
}