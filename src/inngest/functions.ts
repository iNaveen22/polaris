import { generateText } from "ai";
import { inngest } from "./client";
import { google } from "@ai-sdk/google";

export const demoGenerate = inngest.createFunction(
    { id: "demo-generate" },
    { event: "demo/generate" },
    async ({ step }) => {
        await step.run("generate-text", async () => {
            await generateText({
                model: google("gemini-2.5-flash"),
                prompt: "what is 2+2"
            })
        })
    },
);