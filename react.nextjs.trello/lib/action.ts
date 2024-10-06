import { z as validator } from "zod";

export type FieldErrors<T> = {
    [K in keyof T]?: string
}

export type ActionState<TInput, TOutput> = {
    fieldErros?: FieldErrors<TInput>;
    error?: string | null;
    data?: TOutput;
}

export const createAction = <TInput, TOutput>(
    schema: validator.Schema<TInput>,
    handler: (validateData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
    return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
        const validationResult = schema.safeParse(data);
        if (!validationResult.success) {
            return {
                fieldErros: validationResult.error.flatten().fieldErrors as FieldErrors<TInput>
            }
        }
        return handler(validationResult.data);
    }
}