import type { RequestHandler } from "express";
import workoutsRepository from "./workoutsRepository";
import coachRepository from "../coach/coachRepository";

type User = {
    user: any;
    id: number;
    user_role: string;
}

const browse: RequestHandler = async (req, res, next) => {
   try {
    const userData: User = req.user as unknown as User;
    if (!userData) {
        res.status(401).json({ error: "Utilisateur non authentifié" });
    }
    const coachId = await coachRepository.getCoachId(userData.user.id);
    const workouts = await workoutsRepository.readAll(coachId.id);
    res.json(workouts);
   } catch (err) {
    next(err);
   }
};

const read: RequestHandler = async (req, res, next) => {
    try {
        const workoutId = Number(req.params.id);
        const workout = await workoutsRepository.read(workoutId);
        res.json(workout);
    } catch (err) {
        next(err);
    }
}

const add: RequestHandler = async (req, res, next) => {
    try {
        const newWorkout = {
            coach_id: req.body.coach_id,
            title: req.body.title,
            workout_description: req.body.workout_description,
            duration_minutes: req.body.duration_minutes,
            level_of_difficulty: req.body.level_of_difficulty,
        }
        const insertId = await workoutsRepository.create(newWorkout);
        res.status(201).json({ insertId });
    } catch (err) {
        next(err);
    }
}

const edit: RequestHandler = async (req, res, next) => {
    try {
        const workoutId = Number(req.params.id);
        const workoutData = {
            id: Number(workoutId),
            coach_id: Number(req.body.coach_id),
            title: req.body.title,
            workout_description: req.body.workout_description,
            duration_minutes: Number(req.body.duration_minutes),
            level_of_difficulty: req.body.level_of_difficulty,
        }
        const result = await workoutsRepository.update(workoutData);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

const destroy: RequestHandler = async (req, res, next) => {
    try {
        const workoutId = Number(req.params.id);
        const result = await workoutsRepository.delete(workoutId);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export default { browse, read, add, edit, destroy };