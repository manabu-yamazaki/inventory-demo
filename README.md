This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Homebrewを使用したSupabase CLIのインストール（macOS）
```
brew install supabase/tap/supabase
```

# プロジェクト管理
```
## プロジェクトの初期化
npx supabase init

## ローカル開発環境の起動
npx supabase start

## ローカル開発環境の停止
npx supabase stop

## プロジェクトの状態確認
npx supabase status
```

# データベース操作
```
## マイグレーションファイルの作成
npx supabase migration new <migration_name>

## マイグレーションの適用
npx supabase db reset

## データベースのバックアップ
npx supabase db dump

## データベースのリストア
npx supabase db restore <backup_file>

## 本番環境へのデプロイ
npx supabase db push

## マイグレーションの確認
npx supabase migration list
```

# エッジ関数
```
## エッジ関数のローカル実行
npx supabase functions serve <function_name>

## エッジ関数のデプロイ
npx supabase functions deploy <function_name>

## エッジ関数の削除
npx supabase functions delete <function_name>
```

# 認証・認可
```
## シークレットの設定
npx supabase secrets set <key>=<value>

## シークレットの一覧表示
npx supabase secrets list
```

# その他
```
## ヘルプの表示
npx supabase help

## バージョン確認
npx supabase --version

## プロジェクトの設定確認
npx supabase config
```

# デプロイ
```
npx supabase login
npx supabase link --project-ref [project-ref]
npx supabase functions deploy send-reminders
```
