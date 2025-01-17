import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

class PlanRepository {

async readAll() {
    const [rows] = await databaseClient.query<Rows>(
        `SELECT * FROM coach_plans`
    );
    return rows;
    }

async getFeatures() {
    const [rows] = await databaseClient.query<Rows>(
        `SELECT * FROM plan_features`,
        []
    );
    return rows;
}
}
export default new PlanRepository();
