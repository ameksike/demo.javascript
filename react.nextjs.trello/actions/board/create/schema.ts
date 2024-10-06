import { z as validator } from "zod";

export const BoardValidator = validator.object({
    title: validator.string({
        required_error: "Title is required",
        invalid_type_error: "Title is required"
    }).min(3, {
        message: "Minimun length of 3 letters is required"
    }),
    image: validator.string({
        required_error: "Image is required",
        invalid_type_error: "Image is required"
    })
});