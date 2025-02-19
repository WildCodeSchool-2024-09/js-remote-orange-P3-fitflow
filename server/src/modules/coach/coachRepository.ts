import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

class CoachRepository {

    async read(id: number) {
        const [result] = await databaseClient.query<Rows>(
            `SELECT c.*, u.* 
            FROM coaches c
            INNER JOIN user u ON u.id = c.user_id
            WHERE c.user_id = ?`,
            [id],
        );
        return result[0];
    }

    async getCoachId(id: number) {
        const [result] = await databaseClient.query<Rows>(
            "SELECT id FROM coaches WHERE user_id = ?",
            [id],
        );
        return result[0];
    }

    async updatePlan(id: number, coach: any) {
        const [result] = await databaseClient.query<Rows>(
            "UPDATE coaches SET plan_id = ? WHERE id = ?",
            [
                coach.plan_id,
                id
            ],
        );
        return result[0];
    }

    async update(coach: any) {
        const [result] = await databaseClient.query<Result>(
            "UPDATE coaches SET user_id = ?, last_name = ?, first_name = ?, phone_number = ?, profile_picture = ?, speciality = ?, bio = ? WHERE id = ?",
            [
                coach.user_id,
                coach.last_name,
                coach.first_name,
                coach.phone_number,
                coach.profile_picture,
                coach.speciality,
                coach.bio,
                coach.id
            ],
        );
        return result.affectedRows;
    }
}

export default new CoachRepository();