import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cool or Trash? - Rate Weird Products",
  description: "Swipe through the internet's weirdest products. Is it cool or trash? You decide.",
  metadataBase: new URL("https://coolortrash.com"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Cool or Trash?",
    description: "Rate the internet's weirdest products",
    siteName: "CoolOrTrash.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cool or Trash?",
    description: "Rate the internet's weirdest products",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://m.media-amazon.com" />
        <link rel="dns-prefetch" href="https://m.media-amazon.com" />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="ea5c83ef-d6f9-4c65-acc4-94b7d87c5112" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1091634579304555');
fbq('track', 'PageView');
`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1091634579304555&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist-sans)]">
        {children}
      </body>
    </html>
  );
}
