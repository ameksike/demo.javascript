import { z as validator } from "zod";

export const BoardValidator = validator.object({
    id: validator.string()
});