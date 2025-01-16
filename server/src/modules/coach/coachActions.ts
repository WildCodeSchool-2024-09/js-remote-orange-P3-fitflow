import coachRepository from "./coachRepository";
import { RequestHandler } from "express";

type User = {
    user: any;
    id: number;
    user_role: string;
}

const getCoach: RequestHandler = async (req, res, next) => {
    try {
        const userData: User = req.user as unknown as User;
        if (!userData) {
            res.status(401).json({ error: "Utilisateur non authentifié" });
            return;
        }
        const coachData = await coachRepository.read(userData.user.id);
        res.json({ coach: coachData });
        
    } catch (error) {
        next(error);
    }
};

export default { getCoach };