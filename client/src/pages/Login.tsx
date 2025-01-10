import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    return (
        <main className="flex flex-col lg:flex-row items-center justify-center w-full h-screen">
            <section className="flex flex-col items-center justify-between w-full lg:w-1/2 h-screen p-10">
                <img
                    src="fitflow-logo-text.svg"
                    alt="Fitflow logo"
                    className="w-72 h-auto" />
                <Card className="w-full h-fit max-w-lg flex flex-col items-center justify-center gap-4">
                    <CardHeader className="flex flex-col items-center justify-center gap-2">
                        <CardTitle
                            className="text-center">
                            Connextez-vous
                        </CardTitle>
                        <CardDescription
                            className="text-center">
                            Connectez-vous à votre compte FitFlow pour accéder à votre espace personnel.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="w-full">
                        <LoginForm />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 w-full">
                        <p
                            className="text-sm text-gray-500 w-full text-center">
                            Vous n'avez pas de compte ?
                        </p>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => navigate("/signup")}>Créer un compte</Button>
                    </CardFooter>
                </Card>
                <div></div>
            </section>
            <section className="hidden lg:block w-1/2 h-screen bg-gray-100">
                <img
                    src="image-signup.png"
                    alt=""
                    className="w-full h-full object-cover" />
            </section>
        </main>
    );
}

export default Login;