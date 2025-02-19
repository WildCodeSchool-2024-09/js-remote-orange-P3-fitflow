import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type User = {
  id: number;
  email: string;
  password: string;
  user_role: string;
};

type Coach = {
  id: number;
  user_id: number;
  plan_id: number;
  first_name: string;
  last_name: string;
};

class SignupRepository {
  async create(user: Omit<User, "id">) {
    const [result] = await databaseClient.query<Result>(
      "insert into user (email, password, user_role) values (?, ?, ?)",
      [user.email, user.password, "coach"],
    );
    return result.insertId;
  }

  async createCoach(coaches: Omit<Coach, "id">) {
    const [result] = await databaseClient.query<Result>(
      "insert into coaches (user_id, plan_id, first_name, last_name) values (?, ?, ?, ?)",
      [coaches.user_id, coaches.plan_id, coaches.first_name, coaches.last_name],
    );
    return result.insertId;
  }

  async checkEmailExistence(email: string) {
    const [result] = await databaseClient.query<Rows>(
      "select * from user where email = ?",
      [email],
    );
    return result.length > 0;
  }
}

export default new SignupRepository();
