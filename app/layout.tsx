
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {

   return(
    <html suppressHydrationWarning>
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
         <script dangerouslySetInnerHTML={{ __html: `
           window.$crisp=[];
           window.CRISP_WEBSITE_ID="b1163da2-88e0-4695-8efc-46f4abe71adf";
           (function(){var d=document;var s=d.createElement("script");
           s.src="https://client.crisp.chat/l.js";
           s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
         `}} />
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