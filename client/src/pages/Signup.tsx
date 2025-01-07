import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SignupForm from "@/components/SignupForm";
import { useNavigate } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();
    return (
        <main className="flex flex-col items-center justify-between h-screen">
            <header className="flex flex-col items-center justify-center w-full border-b border-gray-100 md:mb-10">
                <img src="/fitflow-logo-text.svg" alt="Logo" className="w-48 h-auto md:w-72" />
            </header>
            <section className="flex flex-col md:flex-row items-center justify-center w-full h-fit max-w-screen-xl px-6 gap-10 md:gap-20">
                <div className="flex items-center justify-center w-full order-2 md:order-1">
                    <Card className="w-full max-w-lg flex flex-col gap-4">
                        <CardHeader>
                            <CardTitle>Créer un compte</CardTitle>
                            <CardDescription>Découvrez une nouvelle façon de gérer votre activité.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SignupForm />
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            <p className="text-sm text-gray-500 w-full text-center">Vous avez déjà un compte ?</p>
                            <Button
                                onClick={() => navigate("/login")}
                                variant="outline"
                                className="w-full">Se connecter</Button>
                        </CardFooter>
                    </Card>
                </div>
                <div className="flex flex-col items-center justify-center w-full max-w-lg h-full p-6 gap-10 mt-10 md:mt-0 md:max-w-full md:items-start">
                    <img src="/fitflow-logo.svg" alt="Logo" className="w-16 h-auto" />
                    <h3 className="text-2xl font-semibold text-center md:text-left">L'outils tout-en-un pour les coachs et les salle de sport</h3>
                    <p className="text-sm text-gray-500 text-center md:text-left">
                        Simplifiez la gestion de vos clients, planifiez vos séances, suivez les progrès
                        et gérez vos paiements en toute simplicité. Notre plateforme tout-en-un vous
                        permet de vous concentrer sur l'essentiel : accompagner vos clients vers leurs objectifs.
                    </p>
                </div>
            </section>
            <footer className="w-full mt-6">
                <div className="flex flex-col items-center justify-center w-full px-6 py-10">
                    <p className="text-xs text-gray-500 max-w-lg text-center">En saisissant votre email, vous acceptez que FitFlow vous contacte au sujet de nos
                        produits et services. Vous pouvez vous désinscrire à tout moment en cliquant sur le lien de désabonnement dans nos emails.</p>
                </div>
            </footer>
        </main>
    );
}

export default Signup;