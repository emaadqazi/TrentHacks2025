import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, User, Mail, Calendar } from 'lucide-react';

/**
 * Debug component to test Firebase Authentication
 * Shows current auth state and user data
 */
export function AuthDebugPanel() {
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    console.log('🔐 Auth State Changed:', {
      loading,
      user: currentUser ? {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        emailVerified: currentUser.emailVerified,
        photoURL: currentUser.photoURL,
        metadata: {
          creationTime: currentUser.metadata.creationTime,
          lastSignInTime: currentUser.metadata.lastSignInTime,
        },
      } : null,
    });
  }, [currentUser, loading]);

  if (loading) {
    return (
      <Card className="border-2 border-muted">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Checking authentication...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentUser) {
    return (
      <Card className="border-2 border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Not Authenticated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            No user is currently signed in. Please log in to test authentication.
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Status</Badge>
              <span className="text-muted-foreground">Not logged in</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-green-500/50 bg-green-500/5">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          Authentication Working! ✅
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Display Name</p>
              <p className="text-sm font-medium">{currentUser.displayName || 'Not set'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono text-xs">
              UID
            </Badge>
            <div>
              <p className="text-xs text-muted-foreground">User ID</p>
              <p className="text-sm font-mono font-medium break-all">{currentUser.uid}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Account Created</p>
              <p className="text-sm font-medium">
                {currentUser.metadata.creationTime 
                  ? new Date(currentUser.metadata.creationTime).toLocaleString()
                  : 'Unknown'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Last Sign In</p>
              <p className="text-sm font-medium">
                {currentUser.metadata.lastSignInTime
                  ? new Date(currentUser.metadata.lastSignInTime).toLocaleString()
                  : 'Unknown'}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center gap-2">
              <Badge variant={currentUser.emailVerified ? "default" : "secondary"}>
                {currentUser.emailVerified ? 'Email Verified ✓' : 'Email Not Verified'}
              </Badge>
              {currentUser.photoURL && (
                <Badge variant="outline">Has Photo</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            💡 Check Firebase Console → Authentication → Users to see this user in the database
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log('Full User Object:', currentUser);
              console.log('User JSON:', JSON.stringify({
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                emailVerified: currentUser.emailVerified,
                photoURL: currentUser.photoURL,
                metadata: {
                  creationTime: currentUser.metadata.creationTime,
                  lastSignInTime: currentUser.metadata.lastSignInTime,
                },
              }, null, 2));
            }}
          >
            Log Full User Data to Console
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

