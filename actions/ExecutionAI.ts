'use server'

import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { Execute_ResponseFormat } from '@/app/zodSchema'

const API_KEY = process.env.GEMINI_API_KEY || null

const ExecuteAI = async (
  prompt: string,
  code: string,
  refData?: { fileName: string; code: string }
) => {
  if (!prompt) return new Error('No input prompt')

  const client = new OpenAI({
    apiKey: API_KEY as string,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
  })

  try {
    const completion = await client.chat.completions.parse({
      model: 'gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: `
You are an code generator/editor based on the given user prompt and the data,
you need to generate code and give the output in the format of

--Context:
Old Code Data : ${JSON.stringify(code)}

${
  refData?.code &&
  `
--Reference Data
fileName: ${refData?.fileName}
code: ${refData.code}
`
}
--Format:
{
  code: <string>
}

--NOTE:
- Please make sure the format of the spaces and lines in the generated string code are correct and indented properly
- No Explanitions, no comments but just a clean code
- Make sure the generated code is highly realted to the context
- Don't make any errors in the code
      `,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],

      response_format: zodResponseFormat(
        Execute_ResponseFormat as unknown as any,
        'event'
      ),
    })

    const event = completion.choices[0].message.parsed

    return event
  } catch (err: any) {
    throw Error('Internal Error', err)
  }
}

export default ExecuteAI
