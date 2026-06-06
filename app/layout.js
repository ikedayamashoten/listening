export const metadata = {
  title: "リスニング問題ジェネレーター | 池田山商店",
  description: "AIで英語リスニング問題と音声を自動生成",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
