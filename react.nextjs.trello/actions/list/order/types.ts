import { z as validator } from "zod";
import { List } from "@prisma/client";
import { ActionState } from "@/lib/action"
import { ListValidator } from "./schema";

export type InputType = validator.infer<typeof ListValidator>;
export type OutputType = ActionState<InputType, List[]>;