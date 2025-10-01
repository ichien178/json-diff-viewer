# JSON Diff Viewer

公開URL（GitHub Pages）

- https://ichien178.github.io/json-diff-viewer/

ローカル開発

```bash
pnpm i
pnpm dev
```

デプロイ方法

- `release` ブランチにマージ/プッシュすると自動ビルド・公開されます（GitHub Actions + Pages）

注意点

- Vite の `base` は CI 時のみ `/${REPO_NAME}/` が適用されます（`vite.config.ts`）。ローカルでは `/` のままです。
- SPA の 404 対策として `public/404.html` を配置しています（Pages の直接アクセス対策）。
- リポジトリの Settings > Pages で Build and deployment を GitHub Actions に設定してください（UI 操作）。

## AIアシスタントによる開発

このリポジトリでは、AIアシスタント「Jules」が開発をサポートします。

Issueに実装したい機能や修正したいバグを自然言語で記述するだけで、Julesが自動でコードの変更、テスト、プルリクエストの作成まで行います。

開発者はJulesに指示を出すだけで、コーディング作業を大幅に効率化できます。
