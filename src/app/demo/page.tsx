
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DemoPage() {
    const [loading, setLoading] = useState(false);

    const handleBlocking = async () => {
        setLoading(true);
        await fetch("/api/demo/blocking", { method: "POST" });
        setLoading(false);
    }

    const handleBackground = async () => {
        setLoading(true);
        await fetch("/api/demo/background", { method: "POST" });
        setLoading(false);
    }

    return (
        <div>
            <Button disabled={loading} onClick={handleBlocking}>
                { loading ? "Loading..." : "Blocking" }
            </Button>
            <Button disabled={loading} onClick={handleBackground}>
                { loading ? "Loading..." : "Background" }
            </Button>
        </div>
    )
}