"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Navbar() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-xl">
            在庫管理
          </Link>
          {user && (
            <div className="hidden md:flex space-x-4">
              <Link href="/dashboard" className="text-sm font-medium">
                ダッシュボード
              </Link>
              <Link href="/inventory" className="text-sm font-medium">
                在庫管理
              </Link>
              <Link href="/orders" className="text-sm font-medium">
                注文管理
              </Link>
              <Link href="/users" className="text-sm font-medium">
                ユーザー一覧
              </Link>
              <Link href="/test1" className="text-sm font-medium">
                test1
              </Link>
              <Link href="/test2" className="text-sm font-medium">
                test2
              </Link>
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>メニュー</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <Link
                        href="/dashboard"
                        className="block text-sm font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        ダッシュボード
                      </Link>
                      <Link
                        href="/inventory"
                        className="block text-sm font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        在庫管理
                      </Link>
                      <Link
                        href="/orders"
                        className="block text-sm font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        注文管理
                      </Link>
                      <Link
                        href="/users"
                        className="block text-sm font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        ユーザー一覧
                      </Link>
                      <Link
                        href="/profile"
                        className="block text-sm font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        プロフィール
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleSignOut}
                      >
                        ログアウト
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.role === 'admin' ? '管理者' : '一般ユーザー'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/profile">プロフィール</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>
                      ログアウト
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <div className="flex space-x-2">
              <Link href="/login">
                <Button variant="ghost">ログイン</Button>
              </Link>
              <Link href="/signup">
                <Button>新規登録</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 