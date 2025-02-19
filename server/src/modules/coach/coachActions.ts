import coachRepository from "./coachRepository";
import { RequestHandler } from "express";
import { isValidPhoneNumber } from "libphonenumber-js";
type User = {
    user: any;
    id: number;
    user_role: string;
}

const getCoach: RequestHandler = async (req, res, next) => {
    try {
        const userData: User = req.user as unknown as User;
        if (!userData) {
            res.status(401).json({ error: "Utilisateur non authentifié" });
            return;
        }
        const coachData = await coachRepository.read(userData.user.id);
        res.json({ coach: coachData });
        
    } catch (error) {
        next(error);
    }
};

const validateCoachData: RequestHandler = async (req, res, next) => {
    
    type ValidatorError = {
        field: string;
        message: string;
    };

    const errors: ValidatorError[] = [];
    const { last_name, first_name, phone_number, speciality, bio } = req.body;

    // Validation du fichier uniquement si le coach n'a pas déjà une photo de profil
    const existingCoach = await coachRepository.read(req.body.user_id);
    if (!req.file && !existingCoach.profile_picture) {
        errors.push({ field: "file", message: "Une photo de profil est requise" });
    }

    // Check if last name is not empty
    if (typeof last_name !== "string" || last_name.length < 2 || last_name.length > 255) {
        errors.push({ field: "last_name", message: "Votre nom doit être une chaîne de caractères contenant au moins 2 caractères et maximum 255 caractères" });
    }

    // Check if first name is not empty
    if (typeof first_name !== "string" || first_name.length < 2 || first_name.length > 255) {
        errors.push({ field: "first_name", message: "Votre prénom doit être une chaîne de caractères contenant au moins 2 caractères et maximum 255 caractères" });
    }

    // Check if phone number is not empty
    if (phone_number === null || phone_number === undefined || phone_number === "") {
        errors.push({ field: "phone_number", message: "Le numéro de téléphone est requis" });
    } else {
        const formattedPhoneNumber = `+${phone_number}`;
        if (!isValidPhoneNumber(formattedPhoneNumber)) {
            errors.push({ field: "phone_number", message: "Le numéro de téléphone n'est pas valide" });
        }
    }

    // Check if speciality is valid
    if (typeof speciality !== "string" || speciality.length > 255) {
        errors.push({ field: "speciality", message: "La spécialité doit être une chaîne de caractères contenant au moins 2 caractères et maximum 255 caractères" });
    }

    // Check if bio is valid
    if (typeof bio !== "string" || bio.length > 255) {
        errors.push({ field: "bio", message: "La bio doit être une chaîne de caractères contenant au moins 2 caractères et maximum 255 caractères" });
    }

    if (errors.length > 0) {
        res.status(400).json({ errors });
    }

    next();
};

const updateCoach: RequestHandler = async (req, res, next) => {
    try {
        const existingCoach = await coachRepository.read(req.body.user_id);
        
        const coach = {
            id: req.body.id,
            user_id: req.body.user_id,
            last_name: req.body.last_name,
            first_name: req.body.first_name,
            phone_number: req.body.phone_number,
            speciality: req.body.speciality,
            bio: req.body.bio,
            profile_picture: req.file?.filename || existingCoach.profile_picture // Garder l'ancienne photo si pas de nouvelle
        }

        const updatedCoach = await coachRepository.update(coach);
        if (updatedCoach === 0) {
            res.status(404).json({ error: "Aucun coach trouvé avec cet ID" });
        }
        res.status(200).json({ 
            success: true,
            affectedRows: updatedCoach,
            profile_picture: coach.profile_picture
        });
    } catch (error) {
        next(error);
    }
};

export default { getCoach, updateCoach, validateCoachData };