import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Client = {
    id: number;
    coach_id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: number;
    gender: string;
    birth_date: string;
    weight_kg: number;
    height_cm: number;
    notes: string;
}

class ClientsRepository {

    async readAll (coachId: number) {
        const [result] = await databaseClient.query<Rows>(
            "SELECT * FROM clients WHERE coach_id = ? ORDER BY created_at DESC",
            [coachId]
        );
        return result;
    }

    async read(id: number) {
        const [result] = await databaseClient.query<Rows>(
            "SELECT * FROM clients WHERE id = ?",
            [id]
        );
        return result[0];
    }

    async checkEmailExistence(email: string, coachId: number) {
        const [rows] = await databaseClient.query<Rows>(
            "SELECT id FROM clients WHERE email = ? AND coach_id = ?",
            [email, coachId]
        );
        return rows[0] || null;
    }

    async create(client: Omit<Client, "id">) {
        const [result] = await databaseClient.query<Result>(
            `INSERT INTO clients (
                coach_id, email, first_name, last_name, 
                phone, gender, birth_date, weight_kg, 
                height_cm, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                client.coach_id,
                client.email,
                client.first_name,
                client.last_name,
                client.phone,
                client.gender,
                client.birth_date,
                client.weight_kg,
                client.height_cm,
                client.notes
            ]
        );
        return result.insertId;
    }

    async update(client: Client) {
        const [result] = await databaseClient.query<Result>(
            `UPDATE clients 
            SET coach_id = ?, email = ?, first_name = ?, 
                last_name = ?, phone = ?, gender = ?, 
                birth_date = ?, weight_kg = ?, height_cm = ?, 
                notes = ? 
            WHERE id = ?`,
            [
                client.coach_id,
                client.email,
                client.first_name,
                client.last_name,
                client.phone,
                client.gender,
                client.birth_date,
                client.weight_kg,
                client.height_cm,
                client.notes,
                client.id
            ]
        );
        return result.affectedRows;
    }

    async delete(id: number) {
        if (typeof id !== 'number' || isNaN(id)) {
            throw new Error(`ID invalide: ${id}`);
        }

        const [result] = await databaseClient.query<Result>(
            "DELETE FROM clients WHERE id = ?",
            [id]
        );
        return result.affectedRows;
    }

    async deleteList(ids: number[]) {
        const [result] = await databaseClient.query<Result>(
            "DELETE FROM clients WHERE id IN (?)",
            [ids]
        );
        return result.affectedRows;
    }
}

export default new ClientsRepository();