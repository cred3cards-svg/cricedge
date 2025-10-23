
import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ error }: { error: Error | any }) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-destructive">
            <AlertCircle className="h-8 w-8" />
            <p className="font-semibold">Failed to load data</p>
            <p className="text-xs">{message}</p>
        </div>
    );
}
