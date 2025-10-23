
'use client';

import { doc, getDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { useEffect, useState } from 'react';
import Loading from '@/components/admin/Loading';

export function AuthGate({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        if (isUserLoading) {
            return;
        }

        if (!user) {
            setIsAdmin(false);
            return;
        }

        const checkAdminStatus = async () => {
            const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
            try {
                const docSnap = await getDoc(adminRoleRef);
                setIsAdmin(docSnap.exists());
            } catch (error) {
                console.error("Error checking admin status:", error);
                setIsAdmin(false);
            }
        };

        checkAdminStatus();
    }, [user, isUserLoading, firestore]);

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
                <p className="text-destructive font-semibold">Access Denied. Admins only.</p>
            </div>
        );
    }

    return <>{children}</>;
}
