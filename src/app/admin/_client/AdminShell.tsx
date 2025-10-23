
'use client';

import { AuthGate } from '@/components/auth/AuthGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminUsersTable } from '@/components/admin/AdminUsersTable';
import { AdminMarketsTable } from '@/components/admin/AdminMarketsTable';
import { AdminFixturesTable } from '@/components/admin/AdminFixturesTable';
import { AdminTradesTable } from '@/components/admin/AdminTradesTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function AdminDashboard() {
    return (
        <div className="container mx-auto py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage markets, fixtures, and application settings.</p>
            </header>

            <Tabs defaultValue="markets">
                <TabsList>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="trades">All Trades</TabsTrigger>
                    <TabsTrigger value="markets">Markets</TabsTrigger>
                    <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
                </TabsList>
                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>View all registered users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AdminUsersTable />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="trades">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Trades</CardTitle>
                            <CardDescription>View all trades across all users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AdminTradesTable />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="markets">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Markets</CardTitle>
                            <CardDescription>View, publish, lock, and resolve markets.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AdminMarketsTable teamsMap={new Map()} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="fixtures">
                     <Card>
                        <CardHeader>
                            <CardTitle>Fixtures</CardTitle>
                            <CardDescription>View upcoming and past fixtures.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <AdminFixturesTable />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function AdminShell() {
  return (
    <QueryClientProvider client={queryClient}>
        <AuthGate>
            <AdminDashboard />
        </AuthGate>
    </QueryClientProvider>
  );
}
