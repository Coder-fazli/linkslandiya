
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
      </body>
    </html>
   )
}