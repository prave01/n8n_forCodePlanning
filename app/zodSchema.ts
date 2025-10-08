import { z } from "zod";

export const Plan_ResponseFormat = z.array(
  z.object({
    planName: z.string(),
    targetFile: z.string(),
    description: z.string(),
    plan_prompt: z.string(),
  }),
);
