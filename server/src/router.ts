import express from "express";

const router = express.Router();

// Import cookie-related modules
import cookieJwtAuth from "./modules/cookie/cookieJwtAuth";


/* ************************************************************************* */
// Define signup routes

import signupActions from "./modules/signup/signupActions";
router.post(
    "/signup",
    signupActions.validate, 
    signupActions.add
);

/* ************************************************************************* */
// Define login routes

import loginActions from "./modules/login/loginActions";
router.post(
    "/login",
    loginActions.checkUser,
    loginActions.login
);

/* ************************************************************************* */
// Define dashboard routes

router.post(
    "/dashboard", 
    cookieJwtAuth.cookieJwtAuth,
    (req, res) => {
        // Vérifier si l'utilisateur est authentifié
        if (req.user) {
            // Envoyer les données de l'utilisateur
            res.clearCookie("token");
            res.status(200).json({
                message: "Accès autorisé au dashboard",
                user: req.user
            });
        } else {
            // Si pas d'utilisateur, renvoyer une erreur
            res.status(401).json({ 
                message: "Non autorisé" 
            });
        }
    }
)

/* router.get("/api/login", () => console.log("login")); */

export default router;