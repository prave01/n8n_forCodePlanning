import { z } from "zod";

const IndividualPlan = z.object({
  planName: z.string(),
  targetFile: z.string(),
  planDescription: z.array(z.string()),
  planPrompt: z.string(),
});

const Plan_ResponseFormat = z.array(IndividualPlan);

const Execute_ResponseFormat = z.object({
  code: z.string(),
});

export { IndividualPlan, Plan_ResponseFormat, Execute_ResponseFormat };
