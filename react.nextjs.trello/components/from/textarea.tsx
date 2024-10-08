"use client";

import { forwardRef, KeyboardEventHandler } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { FromErrors } from "./error";
import { useFormStatus } from "react-dom";

interface FormTextareaProps {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined>;
    className?: string;
    defaultValue?: string;
    onBlur?: () => void;
    onClick?: () => void;
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
    id,
    className,
    defaultValue,
    disabled,
    errors,
    label,
    onBlur,
    onClick,
    onKeyDown,
    placeholder,
    required
}, ref) => {
    const { pending } = useFormStatus();
    return (
        <div className="space-y-2 w-full">
            <div className="space-y-1 w-full" >
                {label ? (
                    <Label
                        htmlFor={id}
                        className="text-xs font-semibold text-neutral-700"
                    >
                        {label}
                    </Label>
                ) : null}

                <Textarea
                    ref={ref}
                    onKeyDown={onKeyDown}
                    onBlur={onBlur}
                    onClick={onClick}
                    required={required}
                    disabled={pending || disabled}
                    placeholder={placeholder}
                    name={id}
                    id={id}
                    className={cn(
                        "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",
                        className
                    )}
                    aria-describedby={`${id}-error`}
                    defaultValue={defaultValue}
                />
            </div>
            <FromErrors
                id={id}
                errors={errors}
            />

        </div>
    )
});

FormTextarea.displayName = "FormTextarea";