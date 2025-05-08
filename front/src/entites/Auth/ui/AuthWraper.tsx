
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/overlay/card";
import { PropsWithChildren } from "react";

interface AuthWrapperProps {
    heading: string;
}

export default function AuthWrapper({ children, heading }: PropsWithChildren<AuthWrapperProps>) {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <Card className="w-[450px]">
                <CardHeader className="flex-row items-center justify-center gap-x-4">
                    <CardTitle>{heading}</CardTitle>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </main>
    )
}