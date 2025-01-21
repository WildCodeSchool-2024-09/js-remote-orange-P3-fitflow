import planRepository from "./planRepository";
import type { RequestHandler } from "express";
import coachRepository from "../coach/coachRepository";
import planSubscriptionRepository from "../plan_subscription/planSubscriptionRepository";
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
        console.log("userData:", userData);

        const coachData = await coachRepository.read(userData.user.id);
        /* console.log("coachData:", coachData);
        console.log("coachData.id:", coachData.id); */

        if (!coachData) {
            res.status(404).json({ error: "Coach non trouvé" });
        }
        const plans = await planRepository.readAll();
        /* console.log("plans:", plans); */

        const features = await planRepository.getFeatures();
        /* console.log("features:", features); */

        const coachId = await coachRepository.getCoachId(userData.user.id);
        console.log("coachId:", coachId);

        const planSubscription = await planSubscriptionRepository.read(coachId.id);
        console.log("planSubscription:", planSubscription);

        res.json({ plans, features, coachData, userData, planSubscription });
        
    } catch (error) {
        next(error);
    }
}

export default { browse };