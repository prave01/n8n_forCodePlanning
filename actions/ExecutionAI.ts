"use server";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { Execute_ResponseFormat } from "@/app/zodSchema";

const API_KEY = process.env.GEMINI_API_KEY || null;

const ExecuteAI = async (prompt: string, code: string) => {
  if (!prompt) return new Error("No input prompt");

  const client = new OpenAI({
    apiKey: API_KEY as string,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
  });

  try {
    const completion = await client.chat.completions.parse({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `
You are an code generator/editorr based on the given user prompt and the data,
you need to generate code and give the output in the format of

--Context:
Old Code Data : ${JSON.stringify(code)}

--Format:
{
  code:<string>
}

--NOTE:
- No Explanitions, no comments but just a clean code
- Make sure the generated code is highly realted to the context
- Don't make any errors in the code
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: zodResponseFormat(Execute_ResponseFormat, "event"),
    });

    const event = completion.choices[0].message.parsed;

    return event;
  } catch (err: any) {
    throw Error("Internal Error", err);
  }
};

export default ExecuteAI;
