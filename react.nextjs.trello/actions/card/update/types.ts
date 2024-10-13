import { z as validator } from "zod";
import { Card } from "@prisma/client";
import { ActionState } from "@/lib/action"
import { CardValidator } from "./schema";

export type InputType = validator.infer<typeof CardValidator>;
export type OutputType = ActionState<InputType, Card>;