/* eslint-disable @typescript-eslint/no-unused-vars */
import { google } from "@ai-sdk/google";
import { generateText, generateObject } from "ai";
import { z } from "zod";

const model = google("gemini-2.0-flash");

export interface RequestSuggestionParams {
  workspaceName: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url?: string;
  description?: string;
}

// Schema for request name suggestions
const RequestNameSchema = z.object({
  suggestions: z
    .array(
      z.object({
        name: z.string().describe("Suggested request name"),
        reasoning: z
          .string()
          .describe("Brief explanation of why this name was chosen"),
        confidence: z
          .number()
          .min(0)
          .max(1)
          .describe("Confidence score for this suggestion"),
      })
    )
    .length(3)
    .describe("Three different name suggestions ordered by relevance"),
});

/**
 * Agent 1: Suggest Request Names
 * Generates meaningful request names based on workspace context and HTTP method
 */

export async function suggestRequestName({
  workspaceName,
  method,
  url,
  description,
}: RequestSuggestionParams) {
  try {
    const prompt = `
You are an AI assistant helping developers name their API requests in a workspace called "${workspaceName}".

Context:
- HTTP Method: ${method}
- Workspace: ${workspaceName}
- URL: ${url || "Not provided"}
- Description: ${description || "Not provided"}

Generate 3 concise, descriptive request names that:
1. Reflect the HTTP method and purpose
2. Are relevant to the workspace context
3. Follow common REST API naming conventions
4. Are professional and clear
5. Are between 2-6 words long

Consider the workspace theme and make names that would make sense to other developers.
`;

    const result = await generateObject({
      model,
      schema: RequestNameSchema,
      prompt,
      temperature: 0.7,
    });

    return {
      success: true,
      data: result.object,
      error: null,
    };
  } catch (error) {
    console.error("Error generating request name suggestions:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export interface JsonBodyGenerationParams {
  prompt: string;
  method?: string;
  endpoint?: string;
  context?: string;
}

const JsonBodySchema = z.object({
  jsonBody: z.string().describe("Generated JSON body as a valid JSON string"),
  explanation: z
    .string()
    .describe("Brief explanation of the generated structure"),
  suggestions: z
    .array(z.string())
    .describe("Alternative field suggestions or improvements"),
});

/**
 * Agent 2: Generate JSON Body
 * Creates JSON request bodies based on user prompts and context
 */
export async function generateJsonBody({
  prompt,
  method = "POST",
  endpoint,
  context,
}: JsonBodyGenerationParams) {
  try {
    const systemPrompt = `
You are an AI assistant that generates JSON request bodies for API calls.

Context:
- HTTP Method: ${method}
- Endpoint: ${endpoint || "Not specified"}
- Additional Context: ${context || "None"}

Guidelines:
1. Generate realistic, well-structured JSON based on the user's request
2. Use appropriate data types (strings, numbers, booleans, arrays, objects)
3. Include reasonable example values that make sense for the context
4. Follow common JSON and REST API conventions
5. Consider the HTTP method when structuring the data
6. Make the JSON practical and ready-to-use
7. Include nested objects and arrays when appropriate
8. Use meaningful field names
9. Return the JSON as a properly formatted JSON string

User Request: ${prompt}

IMPORTANT: Return the jsonBody as a valid JSON string that can be parsed with JSON.parse().
`;

    const result = await generateObject({
      model,
      schema: JsonBodySchema,
      prompt: systemPrompt,
      temperature: 0.3,
    });

    // Parse the JSON string back to an object for easier handling

    let parsedJsonBody;
    try {
      parsedJsonBody = JSON.parse(result.object.jsonBody);
    } catch (parseError) {
      // If parsing fails, return the string as-is
      parsedJsonBody = result.object.jsonBody;
    }

    return {
      success: true,
      data: {
        ...result.object,
        jsonBody: parsedJsonBody,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error generating JSON body:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Batch process multiple requests for name suggestions
 */
export async function batchSuggestRequestNames(
  requests: RequestSuggestionParams[]
): Promise<
  Array<{
    originalRequest: RequestSuggestionParams;
    suggestions: z.infer<typeof RequestNameSchema> | null;
    error: string | null;
  }>
> {
  const results = await Promise.allSettled(
    requests.map((request) => suggestRequestName(request))
  );

  return results.map((result, index) => ({
    originalRequest: requests[index],
    suggestions:
      result.status === "fulfilled" && result.value.success
        ? result.value.data
        : null,
    error:
      result.status === "fulfilled"
        ? result.value.error
        : result.reason?.message || "Unknown error",
  }));
}
