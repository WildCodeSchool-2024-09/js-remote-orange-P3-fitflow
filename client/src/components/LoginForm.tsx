import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Google from "@/components/icons/Google";
import Facebook from "@/components/icons/Facebook";
import Apple from "@/components/icons/Apple";
import ErrorWarning from "@/components/icons/ErrorWarning";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

const loginSchema = z.object({
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

function LoginForm() {
    const [serverErrors, setServerErrors] = useState<ServerError[]>([]);
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        setServerErrors([]);
        const response = await fetch("http://localhost:3310/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(values),
        });
        const data = await response.json();
        if (data.errors) {
            setServerErrors(data.errors);
            return;
        }
        if (data.success) {
            navigate(data.redirectUrl);
            // TODO: Ajouter la logique de la connexion de l'utilisateur
        } else {
            console.log(data);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-3">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Email"
                                    {...field} />
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
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Mot de passe"
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {serverErrors.length > 0 && (
                    <Alert variant="destructive">
                        <ErrorWarning />
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
                    className="w-full mt-4">
                    Connexion
                </Button>
                <Button
                    variant="outline"
                    className="text-sm font-medium">
                    <Google />
                    Continuer avec Google
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

export default LoginForm;