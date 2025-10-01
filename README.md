# JSON Diff Viewer

2つのJSONテキストの差分を分かりやすく表示するWebツールです。

公開URL（GitHub Pages）

- https://ichien178.github.io/json-diff-viewer/

## 主な機能

- **JSON差分表示**: 左右のテキストエリアに入力された2つのJSONを比較し、行ごとの差分をハイライトして表示します。
- **比較オプション**:
    - `Sort object keys`: オブジェクトのキーをアルファベット順にソートしてから比較します。キーの順序が異なるだけの差分を無視したい場合に便利です。
    - `Ignore array order`: 配列内の要素の順序を無視して比較します。順序が違うだけの配列を同一とみなしたい場合に使用します。
- **ユーティリティ機能**:
    - `Format JSON`: 入力されたJSONテキストを整形し、見やすくします。
    - `Swap`: 左右のJSON入力を入れ替えます。
    - `Copy diff`: 表示されている差分結果をテキストとしてクリップボードにコピーします。

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
