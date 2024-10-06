"use client";

import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

interface FormSibmitProps {
    children: React.ReactNode,
    disabled?: boolean;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "primary" | "ghost" | "link";
}

export const FormSubmit = (({
    children,
    className,
    disabled,
    variant = "primary"
}: FormSibmitProps) => {
    const { pending } = useFormStatus();
    return (
        <Button
            disabled={pending || disabled}
            type="submit"
            variant={variant}
            className={cn(
                "w-full",
                className
            )}
        >
            {children}
        </Button>
    );
})