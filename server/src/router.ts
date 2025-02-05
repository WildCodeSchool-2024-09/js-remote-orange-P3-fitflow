import express from "express";

const router = express.Router();

// Import cookie-related modules
import cookieJwtAuth from "./modules/cookie/cookieJwtAuth";
import coachActions from "./modules/coach/coachActions";
import { fileUpload } from "./modules/multer/multer";

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

import planActions from "./modules/plans/planActions";
import planSubscriptionActions from "./modules/plan_subscription/planSubscriptionActions";
router.get("/app/plans", 
    cookieJwtAuth.cookieJwtAuth,
    planActions.browse,
);

router.put("/app/plans", 
    cookieJwtAuth.cookieJwtAuth,
    planSubscriptionActions.edit
);

/* ************************************************************************* */
// Define profil routes
router.put("/app/profil", 
    cookieJwtAuth.cookieJwtAuth,
    fileUpload,
    coachActions.validateCoachData,
    coachActions.updateCoach
);

/* ************************************************************************* */
// Define clients routes

import clientsActions from "./modules/coach-clients/clientsActions";
router.get("/app/clients", 
    cookieJwtAuth.cookieJwtAuth,
    clientsActions.browse
);
router.post("/app/clients", 
    cookieJwtAuth.cookieJwtAuth,
    clientsActions.validate,
    clientsActions.add
);
router.get("/app/clients/:id",
    cookieJwtAuth.cookieJwtAuth,
    clientsActions.read
);
router.put("/app/clients/:id",
    cookieJwtAuth.cookieJwtAuth,
    clientsActions.validate,
    clientsActions.edit
);

router.delete("/app/clients", 
    cookieJwtAuth.cookieJwtAuth,
    clientsActions.destroy
);
router.delete("/app/clients/:id",
    cookieJwtAuth.cookieJwtAuth,
    clientsActions.destroyWithParams
);

/* ************************************************************************* */
// Define cours routes

import coursActions from "./modules/cours/coursActions";
router.get("/app/cours", 
    cookieJwtAuth.cookieJwtAuth,
    coursActions.browse
);
router.post("/app/cours", 
    cookieJwtAuth.cookieJwtAuth,
    coursActions.validate,
    coursActions.add
);

export default router;