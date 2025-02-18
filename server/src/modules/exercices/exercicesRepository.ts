import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Exercice = {
    id: number;
    coach_id: number;
    exercise_name: string;
    notes: string;
    level_of_difficulty: string;
    primary_muscle_group: string;
    secondary_muscle_group: string;
    media_url: string;
}

class ExercicesRepository {

    async readAll(workoutId: number) {
        const [result] = await databaseClient.query<Rows>(
            "SELECT * FROM exercices WHERE workout_id = ?",
            [workoutId]
        );
        return result;
    }
}

export default new ExercicesRepository();