'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CricketIcon } from '@/components/icons/CricketIcon';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      // In a real application, you would use a more secure method like custom claims.
      // For this demo, we'll use sessionStorage to track the admin session.
      sessionStorage.setItem('admin-authenticated', 'true');
      toast({
        title: 'Admin Login Successful',
        description: "You've been successfully logged in as an administrator.",
      });
      router.push('/admin');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
        <div className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground">
          <CricketIcon className="h-6 w-6" />
          <span className="font-bold font-headline">OnlyWin - Admin</span>
        </div>
        <Card className="mx-auto w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
                <CardDescription>Enter your administrator credentials below.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                            id="username" 
                            placeholder="admin" 
                            required 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            type="password" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>
                    <Button onClick={handleLogin} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Login
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
