import { z as validator } from "zod";

export const ListValidator = validator.object({
    items: validator.array(
        validator.object({
            id: validator.string(),
            title: validator.string(),
            order: validator.number(),
            createdAt: validator.date(),
            updatedAt: validator.date(),
        })
    ),
    boardId: validator.string()
});