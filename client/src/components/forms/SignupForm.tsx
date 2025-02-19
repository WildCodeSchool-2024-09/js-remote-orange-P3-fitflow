import Apple from "@/components/icons/Apple";
import Facebook from "@/components/icons/Facebook";
import Google from "@/components/icons/Google";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const signupSchema = z.object({
    lastName: z.string().min(2, { message: "Votre nom doit contenir au moins 2 caractères" }),
    firstName: z.string().min(2, { message: "Votre prénom doit contenir au moins 2 caractères" }),
    email: z.string().email({ message: "Adresse email invalide" }),
    password: z.string()
        .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
        .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" })
        .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une majuscule" })
        .regex(/[^a-zA-Z0-9]/, { message: "Le mot de passe doit contenir au moins un caractère spécial" }),
});

type ServerError = {
    field: string;
    message: string;
};

function SignupForm() {

    const [serverErrors, setServerErrors] = useState<ServerError[]>([]);
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            lastName: "",
            firstName: "",
            email: "",
            password: "",
        },
    });
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (values: z.infer<typeof signupSchema>) => {
        setServerErrors([]);

        const newUser = {
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            password: values.password,
            user_role: "coach"
        };

        try {
            const response = await fetch("http://localhost:3310/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(newUser),
            });

            const responseText = await response.text();

            try {
                const data = JSON.parse(responseText);
                if (!response.ok) {
                    if (data.errors) {
                        setServerErrors(data.errors);
                        return;
                    }
                }

                if (data.redirectUrl) {
                    navigate(data.redirectUrl);
                } else {
                    console.error("Aucun URL de redirection fournie par le serveur.");
                }
            } catch (parseError) {
                console.error("Erreur de parsing JSON:", parseError);
                console.error("Contenu reçu:", responseText);
            }
        } catch (error) {
            console.error("Erreur de requête:", error);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-3">
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Nom
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Nom"
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Prénom
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Prénom" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Mot de passe
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mot de passe"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                        {showPassword ? (

                                            <Eye className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <EyeOff className="h-4 w-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {serverErrors.length > 0 && (
                    <Alert variant="destructive">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="rgba(239,68,68,1)"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path></svg>
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>
                            {serverErrors.map((error, index) => (
                                <p key={index}>{error.message}</p>
                            ))}
                        </AlertDescription>
                    </Alert>
                )}
                <Button
                    type="submit"
                    className="text-sm font-medium mt-4">
                    Créer mon compte
                </Button>
                <Button
                    variant="outline"
                    className="text-sm font-medium">
                    <Google />
                    S'inscrire avec Google
                </Button>
                <div className="flex gap-2 w-full">
                    <Button variant="outline" className="w-full">
                        <Facebook />
                        Facebook
                    </Button>
                    <Button variant="outline" className="w-full">
                        <Apple />
                        Apple
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default SignupForm;