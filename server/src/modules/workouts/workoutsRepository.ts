import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Workout = {
    id: number,
    coach_id: number,
    title: string,
    workout_description: string,
    duration_minutes: number,
    level_of_difficulty: string,
}

class WorkoutsRepository {

    async readAll(coachId: number) {
        const [result] = await databaseClient.query<Rows>(
            "SELECT * FROM workouts WHERE coach_id = ? ORDER BY created_at DESC",
            [coachId]
        );
        return result;
    };

    async read(id: number) {
        const [result] = await databaseClient.query<Rows>(
            "SELECT * FROM workouts WHERE id = ?",
            [id]
        );
        return result[0];
    }

    async create(workout: Omit<Workout, "id">) {
        const [result] = await databaseClient.query<Rows>(
            `INSERT INTO workouts (
                coach_id,
                title,
                workout_description,
                duration_minutes,
                level_of_difficulty
            ) VALUES (
                ?, ?, ?, ?, ?
            )`,
            [
                workout.coach_id, 
                workout.title, 
                workout.workout_description, 
                workout.duration_minutes, 
                workout.level_of_difficulty
            ]
        );
        return result;
    }

    async update(workout: Workout) {
        const [result] = await databaseClient.query<Result>(
            `UPDATE workouts 
            SET 
                coach_id = ?,
                title = ?,
                workout_description = ?,
                duration_minutes = ?,
                level_of_difficulty = ?
            WHERE id = ?`,
            [
                workout.coach_id,
                workout.title,
                workout.workout_description,
                workout.duration_minutes,
                workout.level_of_difficulty,
                workout.id
            ]
        );
        return result;
    }

    async delete(id: number) {
        const [result] = await databaseClient.query<Result>(
            "DELETE FROM workouts WHERE id = ?",
            [id]
        );
        return result;
    }
}

export default new WorkoutsRepository();