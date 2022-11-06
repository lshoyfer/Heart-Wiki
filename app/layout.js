/* eslint-disable @next/next/no-head-element */
import 'server-only';
import NavBar from "../components/NavBar";
import '../styles/globals.css';
import localFont from '@next/font/local';
const vgaFont = localFont({
  src: '../utils/VGA437.ttf',
  fallback:  ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif']
});

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={vgaFont.className}>
      <head>

      </head>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
