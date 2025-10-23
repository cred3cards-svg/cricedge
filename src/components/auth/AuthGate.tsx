
'use client';

import { useUser } from '@/firebase';
import { useEffect, useState } from 'react';
import Loading from '@/components/admin/Loading';

const ADMIN_UID = 'Zx04QiJxoNW5KuiAinGuEZA9Zb62';

export function AuthGate({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        if (isUserLoading) {
            return;
        }

        if (!user) {
            setIsAdmin(false);
            return;
        }
        
        // Check if the logged-in user's UID matches the designated admin UID.
        setIsAdmin(user.uid === ADMIN_UID);

    }, [user, isUserLoading]);

    if (isAdmin === null || isUserLoading) {
        return <Loading message="Verifying authentication..." />;
    }

    if (!user) {
         return (
            <div className="flex h-screen w-full items-center justify-center">
                <p className="text-muted-foreground">Please log in to continue.</p>
            </div>
        );
    }
    
    if (!isAdmin) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <p className="text-destructive font-semibold">Access Denied. You are not authorized to view this page.</p>
            </div>
        );
    }

    return <>{children}</>;
}
