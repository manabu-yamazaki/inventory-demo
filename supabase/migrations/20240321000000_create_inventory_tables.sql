-- 商品カテゴリーテーブル
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 商品テーブル
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES product_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE NOT NULL,
  unit TEXT NOT NULL,
  min_stock_level INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 在庫テーブル
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 在庫履歴テーブル
CREATE TABLE inventory_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity_change INTEGER NOT NULL,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
  reason TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLSポリシーの設定
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_history ENABLE ROW LEVEL SECURITY;

-- 商品カテゴリーのポリシー
CREATE POLICY "商品カテゴリーは全員が閲覧可能" ON product_categories
  FOR SELECT USING (true);

CREATE POLICY "管理者のみが商品カテゴリーを編集可能" ON product_categories
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role = 'admin'
    )
  );

-- 商品のポリシー
CREATE POLICY "商品は全員が閲覧可能" ON products
  FOR SELECT USING (true);

CREATE POLICY "管理者とマネージャーが商品を編集可能" ON products
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'manager')
    )
  );

-- 在庫のポリシー
CREATE POLICY "在庫は全員が閲覧可能" ON inventory
  FOR SELECT USING (true);

CREATE POLICY "管理者とマネージャーが在庫を編集可能" ON inventory
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'manager')
    )
  );

-- 在庫履歴のポリシー
CREATE POLICY "在庫履歴は全員が閲覧可能" ON inventory_history
  FOR SELECT USING (true);

CREATE POLICY "管理者とマネージャーが在庫履歴を作成可能" ON inventory_history
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'manager')
    )
  );

-- トリガー関数：在庫更新時に履歴を記録
CREATE OR REPLACE FUNCTION record_inventory_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO inventory_history (
    product_id,
    quantity_change,
    previous_quantity,
    new_quantity,
    type,
    created_by
  ) VALUES (
    NEW.product_id,
    NEW.quantity - CASE WHEN OLD.quantity is null THEN 0 ELSE OLD.quantity END,
    CASE WHEN OLD.quantity is null THEN 0 ELSE OLD.quantity END,
    NEW.quantity,
    CASE
      WHEN NEW.quantity > CASE WHEN OLD.quantity is null THEN 0 ELSE OLD.quantity END THEN 'in'
      WHEN NEW.quantity < CASE WHEN OLD.quantity is null THEN 0 ELSE OLD.quantity END THEN 'out'
      ELSE 'adjustment'
    END,
    auth.uid()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 在庫更新時のトリガー
CREATE TRIGGER inventory_history_trigger
  AFTER UPDATE, INSERT ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION record_inventory_history();

-- -- ダウンマイグレーション
-- DROP TRIGGER IF EXISTS inventory_history_trigger ON inventory;
-- DROP FUNCTION IF EXISTS record_inventory_history();
-- DROP TABLE IF EXISTS inventory_history;
-- DROP TABLE IF EXISTS inventory;
-- DROP TABLE IF EXISTS products;
-- DROP TABLE IF EXISTS product_categories; 