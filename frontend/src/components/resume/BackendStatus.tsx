import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Use a timeout to avoid hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        // Use relative path to go through Vite proxy, or direct if proxy fails
        const response = await fetch('/api/health', {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        }).catch(() => {
          // Fallback to direct connection
          return fetch('http://localhost:5001/', {
            method: 'GET',
            signal: controller.signal,
          });
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          try {
            const data = await response.json();
            if (data.message || data.status === 'ok') {
              setStatus('online');
            } else {
              setStatus('offline');
            }
          } catch {
            // If response is ok but not JSON, assume backend is online
            setStatus('online');
          }
        } else {
          setStatus('offline');
        }
      } catch (error) {
        // Only set offline if it's not an abort (timeout)
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Backend check failed:', error);
        }
        setStatus('offline');
      }
    };

    checkBackend();
    // Check every 10 seconds (less frequent)
    const interval = setInterval(checkBackend, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return (
      <Card className="border-2 border-muted">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Checking backend...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'offline') {
    return (
      <Card className="border-2 border-destructive/50 bg-destructive/5">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Backend Offline</p>
              <p className="text-xs text-muted-foreground">
                Start backend: <code className="text-xs">cd backend && ./start.sh</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-green-500/50 bg-green-500/5">
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">Backend Online</span>
        </div>
      </CardContent>
    </Card>
  );
}

