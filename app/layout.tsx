
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {

   return(
    <html>
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
      </body>
    </html>
   )
}