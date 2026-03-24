import { Spinner } from "@/components/ui/spinner";

export const AuthLoadingView = () => {
    return (
        <div className="justify-center flex items-center h-screen bg-background">
            <Spinner className="size-6 text-ring" />
        </div>
    );
};