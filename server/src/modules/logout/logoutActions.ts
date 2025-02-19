import type { RequestHandler } from "express";

const logout: RequestHandler = (req, res, next) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Déconnexion réussie" });
}

export default { logout };