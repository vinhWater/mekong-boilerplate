'use client';

import { useEffect, useState } from 'react';
import { useNextAuth } from '@/lib/hooks/use-next-auth';
import { toast } from 'sonner';
import { User, UserRole } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProfileIndexPage() {
  const { user, session } = useNextAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    if (session?.user) {
      setFormData({
        id: typeof session.user.id === 'string' ? parseInt(session.user.id, 10) : session.user.id as number,
        email: session.user.email as string,
        name: session.user.name || '',
        role: session.user.role as UserRole | undefined,
      });
    }
  }, [session?.user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Cập nhật profile sẽ được xử lý thông qua useNextAuth sau này
      // Hiện tại chỉ hiển thị thông báo thành công
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Profile</CardTitle>
          {isEditing ? (
            <Button
              variant="ghost"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {/* Role Badge */}
          <div className="mb-6">
            {user && 'role' in user && (
              <Badge variant="outline" className="text-sm">
                {user.role as string}
              </Badge>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="mt-1">{user.name || 'Not set'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="mt-1">{user.email}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
