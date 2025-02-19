import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type CoursSubscription = {
    id: number;
    client_id: number;
    course_id: number;
    client_firstname: string;
    client_lastname: string;
    client_email: string;
    client_phone: string;
}

class CoursSubscriptionsRepository {

    async readAllClients(courseId: number) {
        const [result] = await databaseClient.query<Rows>(
            `SELECT 
                course_participants.id,
                course_participants.course_id,
                course_participants.client_id,
                clients.first_name as client_firstname,
                clients.last_name as client_lastname,
                clients.email as client_email,
                clients.phone as client_phone
            FROM course_participants
            JOIN clients ON course_participants.client_id = clients.id
            WHERE course_participants.course_id = ?`,
            [courseId]
        );
        return result;
    }

    async readAllCourses(clientId: number) {
        const [result] = await databaseClient.query<Rows>(
            `SELECT 
                courses.id,
                courses.coach_id,
                courses.title,
                courses.current_status,
                courses.description_notes,
                courses.price,
                courses.is_free,
                courses.start_date,
                courses.start_time,
                courses.end_time,
                courses.location_link,
                courses.max_participants
            FROM course_participants
            JOIN courses ON course_participants.course_id = courses.id
            WHERE course_participants.client_id = ?`,
            [clientId]
        );
        return result;
    }

    async addParticipant(courseId: number, clientId: number) {
        const [result] = await databaseClient.query<Result>(
            `INSERT INTO course_participants (course_id, client_id) VALUES (?, ?)`,
            [courseId, clientId]
        );
        return result;
    }

    async deleteParticipant(courseId: number, clientId: number) {
        const [result] = await databaseClient.query<Result>(
            `DELETE FROM course_participants 
             WHERE course_id = ? AND client_id = ?`,
            [courseId, clientId]
        );
        return result;
    }

    async deleteMultipleParticipants(courseId: number, clientIds: number[]) {
        const [result] = await databaseClient.query<Result>(
            `DELETE FROM course_participants WHERE course_id = ? AND client_id IN (?)`,
            [courseId, clientIds]
        );
        return result;
    }
}

export default new CoursSubscriptionsRepository();