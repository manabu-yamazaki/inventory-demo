"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'パスワードリセットに失敗しました';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">パスワードリセット</CardTitle>
        <CardDescription>パスワードリセットのリンクを送信します</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-600">
              パスワードリセットのリンクを送信しました。メールをご確認ください。
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '送信中...' : 'リセットリンクを送信'}
          </Button>
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-primary hover:underline"
            >
              ログインに戻る
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 