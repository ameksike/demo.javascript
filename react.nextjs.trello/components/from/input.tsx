"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { FromErrors } from "./error";

interface FormInputProps {
    id: string;
    label?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: Record<string, string[] | undefined>;
    errors?: {
        title?: string[]
    };
    className?: string;
    defaultValue?: string;
    onBlur?: () => void
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
    id,
    label,
    type,
    placeholder,
    required,
    disabled,
    error,
    className,
    defaultValue = "",
    onBlur
}, ref) => {
    const { pending } = useFormStatus();
    return (
        <div className="space-y-2">
            <div className="space-y-1">
                {label ? (
                    <Label
                        htmlFor={id}
                        className="text-xs font-semibold text-neutral-700"
                    >
                        Label
                    </Label>
                ) : null}
                <Input
                    onBlur={onBlur}
                    defaultValue={defaultValue}
                    ref={ref}
                    required={required}
                    name={id}
                    id={id}
                    placeholder={placeholder}
                    type={type}
                    disabled={pending || disabled}
                    className={cn(
                        "text-sm px-2 py-1 h-7",
                        className
                    )}
                    aria-describedby={`${id}-error`}
                />
            </div>
            <FromErrors 
                id={id}
                errors={error}
            />
        </div>
    )
});

FormInput.displayName = "FromInput";