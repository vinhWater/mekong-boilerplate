'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNextAuth } from '@/lib/hooks/use-next-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, User, Shield, Calendar, LogOut, Crown, Users, Settings } from 'lucide-react';
import { UserRole } from '@/types/auth';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session } = useSession();
  const { logout } = useNextAuth();
  
  const user = session?.user;
  
  // Get role badge color
  const getRoleBadge = (role?: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Badge className="bg-purple-500 hover:bg-purple-600"><Crown className="w-3 h-3 mr-1" />Admin</Badge>;
      case UserRole.MANAGER:
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Shield className="w-3 h-3 mr-1" />Manager</Badge>;
      case UserRole.MEMBER:
        return <Badge className="bg-green-500 hover:bg-green-600"><Users className="w-3 h-3 mr-1" />Member</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="gap-2">
            <Link href="/client/settings">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </Button>
          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Profile Card */}
      <Card style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
        <CardContent className="pt-6 pb-6">
          {/* Avatar and Info - Horizontal Layout */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-border shadow-xl">
              <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-white">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{user?.name || 'User'}</h2>
                {getRoleBadge(user?.role)}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {user?.email || 'No email'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Details Card */}
        <Card style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Details
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-sm font-medium text-muted-foreground">User ID</span>
              <span className="text-sm font-mono">{user?.id || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-sm font-medium text-muted-foreground">Email</span>
              <span className="text-sm truncate max-w-[200px]">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-muted-foreground">Role</span>
              <span className="text-sm capitalize">{user?.role || 'Not specified'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Account Status Card */}
        <Card style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Account Status
            </CardTitle>
            <CardDescription>Current account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-sm font-medium text-muted-foreground">Session</span>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                Logged In
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-muted-foreground">Last Activity</span>
              <span className="text-sm">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
