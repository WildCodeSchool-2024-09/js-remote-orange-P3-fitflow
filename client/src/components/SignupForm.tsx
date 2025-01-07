import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Google from "@/components/icons/Google";
import Facebook from "@/components/icons/Facebook";
import Apple from "@/components/icons/Apple";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

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

function SignupForm() {
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            lastName: "",
            firstName: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof signupSchema>) => {
        console.log(values);
        // TODO: Ajouter la logique de l'inscription de l'utilisateur
    }

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
                                <Input
                                    type="password"
                                    placeholder="Mot de passe"
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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