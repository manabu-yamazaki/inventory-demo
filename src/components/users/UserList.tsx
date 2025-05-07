import { UserProfile } from '@/types/user';
import { updateUserRole } from '@/lib/supabase';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserListProps {
  users: UserProfile[];
  currentUserRole?: string;
  onRoleUpdate?: () => void;
}

export function UserList({ users, currentUserRole, onRoleUpdate }: UserListProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<{ id: string; newRole: 'admin' | 'manager' | 'user' } | null>(null);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'manager' | 'user') => {
    setSelectedUser({ id: userId, newRole });
  };

  const confirmRoleUpdate = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(selectedUser.id);
      await updateUserRole(selectedUser.id, selectedUser.newRole);
      toast.success('ロールを更新しました');
      onRoleUpdate?.();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('ロールの更新に失敗しました');
    } finally {
      setUpdating(null);
      setSelectedUser(null);
    }
  };

  const RoleSelect = ({ user }: { user: UserProfile }) => {
    console.log(currentUserRole);
    if (currentUserRole !== 'admin' || user.role === 'admin') {
      return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
          user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {user.role === 'admin' ? '管理者' :
           user.role === 'manager' ? 'マネージャー' : '一般ユーザー'}
        </span>
      );
    }

    return (
      <select
        className={`px-2 py-1 text-xs rounded-full border ${
          // user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
          user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}
        value={user.role}
        onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'manager' | 'user')}
        disabled={updating === user.id}
      >
        <option value="user">一般ユーザー</option>
        <option value="manager">マネージャー</option>
        <option value="admin">管理者</option>
      </select>
    );
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* デスクトップ表示 */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  名前
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  メールアドレス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ロール
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作成日
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleSelect user={user} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('ja-JP')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* モバイル表示 */}
        <div className="md:hidden">
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-gray-900">{user.name || '-'}</div>
                  <RoleSelect user={user} />
                </div>
                <div className="text-sm text-gray-500 mb-1">{user.email}</div>
                <div className="text-xs text-gray-400">
                  {new Date(user.created_at).toLocaleDateString('ja-JP')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AlertDialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ロールの変更確認</AlertDialogTitle>
            <AlertDialogDescription>
              ユーザーのロールを{selectedUser?.newRole === 'admin' ? '管理者' :
                selectedUser?.newRole === 'manager' ? 'マネージャー' : '一般ユーザー'}に変更します。
              この操作は取り消すことができません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleUpdate}>変更する</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 