
import "./globals.css"
import type { Metadata } from "next"
import { getSiteSettings } from "./lib/site-settings"
import { helvetica } from "./fonts"

// Favicon comes from admin-uploaded settings; /favicon.ico is the fallback
export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl: string | undefined
  try {
    faviconUrl = (await getSiteSettings()).faviconUrl
  } catch {
    // DB unavailable (e.g. build-time prerender) — use the static fallback
  }
  return {
    title: "Linkslandia",
    icons: faviconUrl
      ? { icon: faviconUrl, apple: faviconUrl, shortcut: faviconUrl }
      : { icon: "/favicon.ico" },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

   return(
    <html suppressHydrationWarning className={helvetica.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var theme = localStorage.getItem('admin-theme');
            if (theme === 'light') {
              document.documentElement.setAttribute('data-theme', 'light');
            }
          })();
        `}} />
      </head>
      <body>
         { children }
         <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
           (function(m,e,t,r,i,k,a){
             m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
             m[i].l=1*new Date();
             for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
             k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
           })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=109201052', 'ym');
           ym(109201052, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
         `}} />
         <noscript><div><img src="https://mc.yandex.ru/watch/109201052" style={{position:'absolute', left:'-9999px'}} alt="" /></div></noscript>
      </body>
    </html>
   )
}