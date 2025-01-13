import express from "express";

const router = express.Router();

// Import cookie-related modules
import cookieJwtAuth from "./modules/cookie/cookieJwtAuth";
import coachActions from "./modules/coach/coachActions";

/* router.get("/app/dashboard", getCoach); */


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
import logoutActions from "./modules/logout/logoutActions";
router.post(
    "/login",
    loginActions.checkUser,
    loginActions.login
);

/* ************************************************************************* */
// Define dashboard routes

router.route("/app/dashboard")
    .get(
        cookieJwtAuth.cookieJwtAuth,
        coachActions.getCoach
    )
    .post(logoutActions.logout);

/* ************************************************************************* */
// Define plans routes


export default router;
