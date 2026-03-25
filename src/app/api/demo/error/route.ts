import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export async function POST() {
    throw new Error("API Error: Something went wrong on the server!")
}