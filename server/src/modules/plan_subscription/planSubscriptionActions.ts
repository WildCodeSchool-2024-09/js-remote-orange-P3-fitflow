import planSubscriptionRepository from "./planSubscriptionRepository";
import coachRepository from "../coach/coachRepository";
import type { RequestHandler } from "express";

const edit: RequestHandler = async (req, res, next) => {
    try {
        console.log('Données reçues:', req.body);
        
        const planSubscription = {
            id: req.body.id,
            plan_id: req.body.plan_id,
            coach_id: req.body.coach_id,
            subscription_start_date: req.body.subscription_start_date,
            subscription_end_date: req.body.subscription_end_date,
            subscription_status: req.body.subscription_status,
            type_of_subscription: req.body.type_of_subscription,
        }

        const coach = {
            id: planSubscription.coach_id,
            plan_id: planSubscription.plan_id,
        }

        console.log('Objet coach créé:', coach);
        
        console.log('Objet planSubscription créé:', planSubscription);
        
        const affectedRows = await planSubscriptionRepository.update(planSubscription);
        console.log('Résultat de la mise à jour:', affectedRows);

       /*  const affectedRowsCoach = await coachRepository.updatePlan(coach.id, coach);
        console.log('Résultat de la mise à jour:', affectedRowsCoach); */

        res.status(200).json({ 
            success: true, 
            planSubscription });
            
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        next(error);
    }
}

export default { edit };