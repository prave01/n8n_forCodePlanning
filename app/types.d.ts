import { z } from "zod";
import { IndividualPlan, Plan_ResponseFormat } from "./zodSchema";

export type IndividualResponseType = z.infer<typeof IndividualPlan>;
export type Plan_ResponseType = z.infer<typeof Plan_ResponseFormat>;

export type PlanCardExtendedType = IndividualResponseType & {
  codeData: string;
  run?: boolean;
  nodeId: string;
};
