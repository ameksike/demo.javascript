import { z as validator } from "zod";

export const ListValidator = validator.object({
    id: validator.string(),
    boardId: validator.string()
});