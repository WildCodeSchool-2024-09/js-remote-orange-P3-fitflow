import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type PlanSubscription = {
    id: number;
    coach_id: number;
    plan_id: number;
    subscription_start_date: Date;
    subscription_end_date: Date;
    subscription_status: string;
    type_of_subscription: string;
}

class PlanSubscriptionRepository {
    async read(coach_id: number) {
        const [result] = await databaseClient.query<Rows>(
            "SELECT * FROM plan_subscriptions WHERE coach_id = ?",
            [coach_id],
        );
        return result[0];
    }

    async create(planSubscription: Omit<PlanSubscription, "id">) {
        const [result] = await databaseClient.query<Result>(
            "INSERT INTO plan_subscriptions (plan_id, coach_id, subscription_start_date, subscription_end_date, subscription_status, type_of_subscription) VALUES (?, ?, ?, ?, ?, ?)",
            [planSubscription.plan_id, planSubscription.coach_id, planSubscription.subscription_start_date, planSubscription.subscription_end_date, planSubscription.subscription_status, planSubscription.type_of_subscription],
        );
        return result.insertId;
    }

    async update(planSubscription: PlanSubscription) {
        const [result] = await databaseClient.query<Result>(
            "UPDATE plan_subscriptions SET coach_id = ?, plan_id = ?, subscription_start_date = ?, subscription_end_date = ?, subscription_status = ?, type_of_subscription = ? WHERE id = ?",
            [planSubscription.coach_id, planSubscription.plan_id, planSubscription.subscription_start_date, planSubscription.subscription_end_date, planSubscription.subscription_status, planSubscription.type_of_subscription, planSubscription.id],
        );
        return result.affectedRows;
    }

}

export default new PlanSubscriptionRepository();
