-- 商品カテゴリーのサンプルデータ
INSERT INTO product_categories (name, description) VALUES
  ('電子機器', 'コンピュータ、スマートフォン、タブレットなどの電子機器'),
  ('オフィス用品', '文具、紙製品、デスク用品などのオフィス用品'),
  ('家具', 'デスク、チェア、キャビネットなどのオフィス家具'),
  ('消耗品', 'トナー、インク、バッテリーなどの消耗品'),
  ('ネットワーク機器', 'ルーター、スイッチ、アクセスポイントなどのネットワーク機器');

-- 商品のサンプルデータ
INSERT INTO products (category_id, name, description, sku, unit, min_stock_level) VALUES
  -- 電子機器
  ((SELECT id FROM product_categories WHERE name = '電子機器'), 'ノートPC Dell XPS 13', '13インチ、16GB RAM、512GB SSD', 'PC-DELL-XPS13', '台', 5),
  ((SELECT id FROM product_categories WHERE name = '電子機器'), 'モニター Dell 27インチ', '4K解像度、USB-C接続', 'MON-DELL-27', '台', 3),
  ((SELECT id FROM product_categories WHERE name = '電子機器'), 'キーボード メカニカル', '青軸、バックライト付き', 'KB-MECH-BLUE', '個', 10),

  -- オフィス用品
  ((SELECT id FROM product_categories WHERE name = 'オフィス用品'), 'コピー用紙 A4', '500枚/パック、白色', 'PAP-A4-500', 'パック', 20),
  ((SELECT id FROM product_categories WHERE name = 'オフィス用品'), 'ボールペン 黒', '0.5mm、替え芯付き', 'PEN-BALL-BLK', '本', 50),
  ((SELECT id FROM product_categories WHERE name = 'オフィス用品'), '付箋 3色セット', '75mm x 75mm、100枚/色', 'STICKY-3COL', 'セット', 15),

  -- 家具
  ((SELECT id FROM product_categories WHERE name = '家具'), 'オフィスチェア エルゴノミック', 'メッシュバック、高さ調整可能', 'CHAIR-ERG', '脚', 2),
  ((SELECT id FROM product_categories WHERE name = '家具'), 'デスク スタンディング', '電動昇降式、120cm幅', 'DESK-STAND', '台', 2),
  ((SELECT id FROM product_categories WHERE name = '家具'), 'キャビネット 2段', '鍵付き、A4サイズ対応', 'CAB-2TIER', '台', 3),

  -- 消耗品
  ((SELECT id FROM product_categories WHERE name = '消耗品'), 'プリンター用トナー ブラック', 'HP LaserJet対応、3000ページ', 'TONER-BLK-HP', '個', 5),
  ((SELECT id FROM product_categories WHERE name = '消耗品'), 'プリンター用インク 4色セット', 'Canon対応、XLサイズ', 'INK-4COL-CANON', 'セット', 8),
  ((SELECT id FROM product_categories WHERE name = '消耗品'), 'バッテリー リチウムイオン', 'ノートPC用、65Wh', 'BAT-LI-65W', '個', 10),

  -- ネットワーク機器
  ((SELECT id FROM product_categories WHERE name = 'ネットワーク機器'), 'Wi-Fiルーター', 'Wi-Fi 6対応、ギガビットLAN', 'ROUTER-WIFI6', '台', 2),
  ((SELECT id FROM product_categories WHERE name = 'ネットワーク機器'), 'ネットワークスイッチ', '24ポート、PoE対応', 'SW-24POE', '台', 1),
  ((SELECT id FROM product_categories WHERE name = 'ネットワーク機器'), 'アクセスポイント', 'Wi-Fi 6対応、PoE給電', 'AP-WIFI6', '台', 3);

-- 在庫のサンプルデータ
INSERT INTO inventory (product_id, quantity, location) 
SELECT 
  id,
  CASE 
    WHEN min_stock_level <= 5 THEN min_stock_level + 10
    ELSE min_stock_level + 5
  END,
  CASE 
    WHEN category_id = (SELECT id FROM product_categories WHERE name = '電子機器') THEN '倉庫A-1'
    WHEN category_id = (SELECT id FROM product_categories WHERE name = 'オフィス用品') THEN '倉庫B-2'
    WHEN category_id = (SELECT id FROM product_categories WHERE name = '家具') THEN '倉庫C-1'
    WHEN category_id = (SELECT id FROM product_categories WHERE name = '消耗品') THEN '倉庫B-1'
    WHEN category_id = (SELECT id FROM product_categories WHERE name = 'ネットワーク機器') THEN '倉庫A-2'
  END
FROM products;

-- -- ダウンマイグレーション
-- DELETE FROM inventory;
-- DELETE FROM products;
-- DELETE FROM product_categories; 