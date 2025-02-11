import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Cours = {
    id: number;
    coach_id: number;
    current_status: string;
    title: string;
    description_notes: string;
    price: number;
    is_free: boolean;
    start_date: string;
    start_time: string;
    end_time: string;
    location_link: string;
    max_participants: number;
    participants: any[];
}

class CoursRepository {

    async readAll(coachId: number) {
        const [result] = await databaseClient.query<Rows>(
            "SELECT * FROM courses WHERE coach_id = ? ORDER BY created_at DESC",
            [coachId]
        );
        return result;
    }

    async read(id: number) {
        const [result] = await databaseClient.query<Rows>(
            "SELECT * FROM courses WHERE id = ?",
            [id]
        );
        return result[0];
    }

    async create(cours: Omit<Cours, "id">) {
        const [result] = await databaseClient.query<Result>(
            `INSERT INTO courses (
                coach_id,
                current_status,
                title,
                description_notes,
                price,
                is_free,
                start_date,
                start_time,
                end_time,
                location_link,
                max_participants
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )`,
            [
                cours.coach_id,
                cours.current_status,
                cours.title,
                cours.description_notes,
                cours.price,
                cours.is_free,
                cours.start_date,
                cours.start_time,
                cours.end_time,
                cours.location_link,
                cours.max_participants
            ]
        );
        return result;
    }

    async update(cours: Partial<Cours>) {
        const [result] = await databaseClient.query<Result>(
            `UPDATE courses 
            SET 
                coach_id = ?,
                current_status = ?,
                title = ?,
                description_notes = ?,
                price = ?,
                is_free = ?,
                start_date = ?,
                start_time = ?,
                end_time = ?,
                location_link = ?,
                max_participants = ?
            WHERE id = ?`,
            [
                cours.coach_id,
                cours.current_status,
                cours.title,
                cours.description_notes,
                cours.price,
                cours.is_free,
                cours.start_date,
                cours.start_time,
                cours.end_time,
                cours.location_link,
                cours.max_participants,
                cours.id
            ]
        );
        return result.affectedRows;
    }

    async delete(id: number) {
        const [result] = await databaseClient.query<Result>(
            "DELETE FROM courses WHERE id = ?",
            [id]
        );
        return result;
    }
}

export default new CoursRepository();