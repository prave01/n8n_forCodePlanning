"use server";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { Plan_ResponseFormat } from "../app/zodSchema";

const API_KEY = process.env.GEMINI_API_KEY || null;

export const generatePlan = async (
  context: Record<string, string>,
  input: string,
) => {
  if (Object.keys(context).length === 0) {
    throw Error("No context added, please add enough context");
  }

  console.log(context);

  if (!API_KEY) {
    throw Error("Add API key in the configuration of the AI client");
  }

  const client = new OpenAI({
    apiKey: API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
  });

  try {
    const response = await client.chat.completions.parse({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `
You are a Planner for executing a task, basically you gonna generate blue-print
in the format like this,, based on the user input. 

I will give you the data of the file which is user want it to be edited
--Context (The data given by the user)
${JSON.stringify(context, null, 2)}

--Format (An array of plans)
[
  {
    planName:<Plan name>,
    targetFile:<Which file is targeted to execute this plan>,   
    planDescription:[
      <The description for the plan>
    ],
    planPrompt:<Well optimized prompt for this particular plan, this is for the next AI executiong so be it>  
  }
]

NOTE: 
- The plan description should be precise to the point
- It should completely satisfy the user input
- You can generate how many plans as you want based on the complexity of the given task
- The prompt you are generating is should able to solve user need based on the CONTEXT they have provide you
- If the CONTEXT data has multiple files the plan can be whatever you want to be, but end of the day it should satisfies the user input completely
`,
        },
        {
          role: "user",
          content: input,
        },
      ],
      response_format: zodResponseFormat(Plan_ResponseFormat, "event"),
    });

    const event = response.choices[0].message.parsed;

    console.log("AI response", event);
    return event;
  } catch (err: any) {
    console.error("AI Error:", err);
    throw new Error("Internal error: " + err.message);
  }
};
