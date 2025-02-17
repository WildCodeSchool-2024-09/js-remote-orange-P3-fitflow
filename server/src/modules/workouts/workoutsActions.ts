import type { RequestHandler } from "express";
import workoutsRepository from "./workoutsRepository";
import coachRepository from "../coach/coachRepository";

type User = {
    user: any;
    id: number;
    user_role: string;
}

const validateWorkoutData: RequestHandler = async (req, res, next) => {
    type ValidatorError = {
        field: string;
        message: string;
    }
    const errors: ValidatorError[] = [];

    const { title, workout_description, duration_minutes, level_of_difficulty } = req.body;

    if (typeof title !== "string" || title.length < 2 || title.length > 255) {
        errors.push({ field: "title", message: "Le titre du workout doit être une chaîne de caractères contenant au moins 2 caractères et maximum 255 caractères" });
    }

    if (typeof workout_description !== "string" || workout_description.length < 1) {
        errors.push({ field: "workout_description", message: "Veuillez entrer une description du workout" });
    }

    if (typeof duration_minutes !== "number") {
        errors.push({ field: "duration_minutes", message: "La durée du workout doit être un nombre" });
    } else if (duration_minutes < 0) {
        errors.push({ field: "duration_minutes", message: "La durée du workout ne peut pas être négative" });
    }

    if (typeof level_of_difficulty !== "string" || !["beginner", "intermediate", "advanced"].includes(level_of_difficulty)) {
        errors.push({ field: "level_of_difficulty", message: "Le niveau de difficulté du workout n'est pas valide" });
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
            coach_id: Number(req.body.coach_id),
            title: req.body.title,
            workout_description: req.body.workout_description,
            duration_minutes: Number(req.body.duration_minutes),
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

export default { browse, read, add, edit, destroy, validateWorkoutData };