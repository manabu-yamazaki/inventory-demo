-- ユーザープロファイルテーブル
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 権限テーブル
CREATE TABLE permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resource TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(resource, action)
);

-- ロールと権限の関連テーブル
CREATE TABLE role_permissions (
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (role, permission_id)
);

-- 初期データの挿入
INSERT INTO permissions (resource, action) VALUES
  ('dashboard', 'read'),
  ('inventory', 'create'),
  ('inventory', 'read'),
  ('inventory', 'update'),
  ('inventory', 'delete'),
  ('orders', 'create'),
  ('orders', 'read'),
  ('orders', 'update'),
  ('orders', 'delete'),
  ('users', 'create'),
  ('users', 'read'),
  ('users', 'update'),
  ('users', 'delete');

-- 管理者の権限を設定
INSERT INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions;

-- マネージャーの権限を設定
INSERT INTO role_permissions (role, permission_id)
SELECT 'manager', id FROM permissions
WHERE (resource = 'dashboard' AND action = 'read')
   OR (resource = 'inventory' AND action IN ('create', 'read', 'update'))
   OR (resource = 'orders' AND action IN ('create', 'read', 'update'));

-- 一般ユーザーの権限を設定
INSERT INTO role_permissions (role, permission_id)
SELECT 'user', id FROM permissions
WHERE (resource = 'dashboard' AND action = 'read')
   OR (resource = 'inventory' AND action = 'read')
   OR (resource = 'orders' AND action = 'read');

-- ユーザー作成時にプロファイルも作成するトリガー
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLSポリシーの設定
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- ユーザープロファイルのポリシー
CREATE POLICY "ユーザーは自分のプロファイルを閲覧可能"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "管理者は全てのプロファイルを閲覧可能"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "ユーザーは自分のプロファイルを更新可能"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "管理者は全てのプロファイルを更新可能"
  ON user_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 権限テーブルのポリシー
CREATE POLICY "全てのユーザーが権限を閲覧可能"
  ON permissions FOR SELECT
  USING (true);

-- ロール権限テーブルのポリシー
CREATE POLICY "全てのユーザーがロール権限を閲覧可能"
  ON role_permissions FOR SELECT
  USING (true);

-- -- downマイグレーション
-- DO $$ 
-- BEGIN
--   -- トリガーの削除
--   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  
--   -- 関数の削除
--   DROP FUNCTION IF EXISTS public.handle_new_user();
  
--   -- ポリシーの削除
--   DROP POLICY IF EXISTS "ユーザーは自分のプロファイルを閲覧可能" ON user_profiles;
--   DROP POLICY IF EXISTS "管理者は全てのプロファイルを閲覧可能" ON user_profiles;
--   DROP POLICY IF EXISTS "ユーザーは自分のプロファイルを更新可能" ON user_profiles;
--   DROP POLICY IF EXISTS "管理者は全てのプロファイルを更新可能" ON user_profiles;
--   DROP POLICY IF EXISTS "全てのユーザーが権限を閲覧可能" ON permissions;
--   DROP POLICY IF EXISTS "全てのユーザーがロール権限を閲覧可能" ON role_permissions;
  
--   -- RLSの無効化
--   ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE permissions DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE role_permissions DISABLE ROW LEVEL SECURITY;
  
--   -- テーブルの削除（外部キー制約のため、順序に注意）
--   DROP TABLE IF EXISTS role_permissions;
--   DROP TABLE IF EXISTS permissions;
--   DROP TABLE IF EXISTS user_profiles;
-- END $$; 