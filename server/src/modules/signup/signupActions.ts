import type { RequestHandler } from "express";

import signupRepository from "./signupRepository";
import planSubscriptionRepository from "../plan_subscription/planSubscriptionRepository";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET;

type User = {
  email: string;
  password: string;
  user_role: string;
};

type Coach = {
  user_id: number;
  plan_id: number;
  first_name: string;
  last_name: string;
};

type PlanSubscription = {
  plan_id: number;
  coach_id: number;
  subscription_start_date: Date;
  subscription_end_date: Date;
  subscription_status: string;
  type_of_subscription: string;
};

const validate: RequestHandler = async (req, res, next) => {
  type ValidatorError = {
    field: string;
    message: string;
  };
  // Initialize an empty array to store validation errors
  const errors: ValidatorError[] = [];

  // Extract the fields from the request body
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const email = req.body.email;
  const password = req.body.password;

  // Check if name is not empty
  if (typeof firstName !== "string" || firstName.length < 2 || firstName.length > 255) {
    errors.push({ field: "first_name", message: "Votre prénom doit être une chaîne de caractères contenant au moins 2 caractères et maximum 255 caractères" });
  }

  // Check if last name is not empty
  if (typeof lastName !== "string" || lastName.length < 2 || lastName.length > 255) {
    errors.push({ field: "last_name", message: "Votre nom doit être une chaîne de caractères contenant au moins 2 caractères et maximum 255 caractères" });
  }

  // Check if the email is valid
  const emailRegex = /[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/;
  if (email === "") {
    errors.push({ field: "email", message: "L'email ne peut pas être vide" });
  } else if (!emailRegex.test(email)) {
    errors.push({ field: "email", message: "L'email n'est pas valide" });
  } else {
    const exists = await signupRepository.checkEmailExistence(email);
    if (exists) {
      errors.push({ field: "email", message: "Cet email existe déjà dans notre base de données, veuillez utiliser un autre email" });
    }
  }

  // Check if the password is not empty
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).{8,}$/;
  if (password === "") {
    errors.push({ field: "password", message: "Le mot de passe ne peut pas être vide" });
  } else if (!passwordRegex.test(password)) {
    errors.push({ field: "password", message: "Votre mot de passe doit contenir minimum 8 caractères, une majuscule, un chiffre et un caractère spécial" });
  }

  // If there are errors, return a 400 status with the errors
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  // If there are no errors, proceed to the next middleware
  next();
};

const add: RequestHandler = async (req, res, next) => {
    const newUser: User = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        user_role: "coach",
    };
    try {
        const insertId = await signupRepository.create(newUser);

        const newCoach: Coach = {
            user_id: Number(insertId),
            plan_id: 1,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
        };

        const coachId = await signupRepository.createCoach(newCoach);

        const newPlanSubscription: PlanSubscription = {
            plan_id: 1,
            coach_id: coachId,
            subscription_start_date: new Date(),
            subscription_end_date: new Date(new Date().setDate(new Date().getDate() + 14)),
            subscription_status: "active",
            type_of_subscription: "monthly",
        }

        await planSubscriptionRepository.create(newPlanSubscription);

        const token = jwt.sign({ 
            user: { ...newUser, id: insertId }
        }, JWT_SECRET, {
            expiresIn: "8h",
        });

        res.status(201)
            .cookie("token", token, { httpOnly: true })
            .json({ 
                success: true,
                user: {
                    id: insertId,
                    email: req.body.email,
                    user_role: "coach",
                    first_name: req.body.first_name,
                    last_name: req.body.last_name
                },
                redirectUrl: "/app/dashboard"
            });

    } catch (err) {
        next(err);
    }
};

export default { validate, add };