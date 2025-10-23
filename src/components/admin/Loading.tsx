
import { Loader2 } from 'lucide-react';

export default function Loading({ message }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            {message && <p>{message}</p>}
        </div>
    );
}
