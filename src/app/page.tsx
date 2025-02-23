import { redirect } from 'next/navigation';

export default function Home() {
  // サーバーサイドで実行されるため、リクエストヘッダーから言語を判定できます（ここでは簡易版）
  // 詳細な実装は要件に合わせて調整してください
  const lang = 'ja'; // 例として常に日本語とする、またはリクエストヘッダーから判定
  redirect(`/${lang}/recipes`);
}
