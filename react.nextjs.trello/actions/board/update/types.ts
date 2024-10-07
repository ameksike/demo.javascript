import { z as validator } from "zod";
import { Board } from "@prisma/client";
import { ActionState } from "@/lib/action"
import { BoardUpdateValidator as BoardValidator } from "./schema";

export type InputType = validator.infer<typeof BoardValidator>;
export type OutputType = ActionState<InputType, Board>;