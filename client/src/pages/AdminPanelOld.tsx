import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield, Users, Edit, Trash2, UserPlus, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/contexts/AuthContext';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

function AdminPanelContent() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => apiRequest('/api/users'),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<User> }) =>
      apiRequest(`/api/users/${id}`, { method: 'PUT', body: updates }),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: 'User Updated',
        description: `${updatedUser.username} has been updated successfully.`,
      });
      setIsEditDialogOpen(false);
      setEditingUser(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update user',
        variant: 'destructive',
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/users/${id}`, { method: 'DELETE' }),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      const deletedUser = users.find(user => user.id === deletedId);
      toast({
        title: 'User Deleted',
        description: `${deletedUser?.username || 'User'} has been deleted successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      });
    },
  });

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, updates });
    }
  };

  const handleDeleteUser = (user: User) => {
    deleteUserMutation.mutate(user.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load users. Please check your permissions and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Shield className="h-8 w-8 mr-3 text-primary" />
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage users and system permissions
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Logged in as {currentUser?.username} (Admin)
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-users">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-admin-users">
              {users.filter(user => user.role === 'admin').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-active-users">
              {users.filter(user => user.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-recent-signups">
              {users.filter(user => {
                const createdAt = new Date(user.createdAt);
                const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                return createdAt > thirtyDaysAgo;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            User Management
          </CardTitle>
          <CardDescription>
            View and manage all system users. You can edit roles, activate/deactivate accounts, and delete users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span>{user.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? (
                          <>
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          'User'
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'success' : 'destructive'}>
                        {user.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(user.lastLogin)}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          data-testid={`button-edit-${user.id}`}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        
                        {currentUser?.id !== user.id && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                data-testid={`button-delete-${user.id}`}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {user.username}? This action cannot be undone.
                                  All data associated with this user will be permanently removed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent data-testid="edit-user-dialog">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <EditUserForm
              user={editingUser}
              onSave={handleUpdateUser}
              isLoading={updateUserMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface EditUserFormProps {
  user: User;
  onSave: (updates: Partial<User>) => void;
  isLoading: boolean;
}

function EditUserForm({ user, onSave, isLoading }: EditUserFormProps) {
  const [role, setRole] = useState<'admin' | 'user'>(user.role);
  const [isActive, setIsActive] = useState(user.isActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ role, isActive });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Username</Label>
          <Input value={user.username} disabled className="bg-muted" />
        </div>
        
        <div>
          <Label>Email</Label>
          <Input value={user.email} disabled className="bg-muted" />
        </div>
        
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={(value) => setRole(value as 'admin' | 'user')}>
            <SelectTrigger data-testid="select-edit-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="status">Account Status</Label>
          <Select value={isActive ? 'active' : 'inactive'} onValueChange={(value) => setIsActive(value === 'active')}>
            <SelectTrigger data-testid="select-edit-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <DialogFooter>
        <DialogTrigger asChild>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </DialogTrigger>
        <Button type="submit" disabled={isLoading} data-testid="button-save-user">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AdminPanel() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminPanelContent />
    </ProtectedRoute>
  );
}