import { z as validator } from "zod";

export const CardValidator = validator.object({
    id: validator.string(),
    boardId: validator.string()
});