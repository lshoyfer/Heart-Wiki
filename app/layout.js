/* eslint-disable @next/next/no-head-element */
import 'server-only';
import NavBar from "../components/NavBar";
import '../styles/globals.css';
import localFont from '@next/font/local';
import { supabase } from '../utils/supabaseClient';
import { cookies } from 'next/headers';
import getSession from '../utils/getSession';
const vgaFont = localFont({
  src: '../utils/VGA437.ttf',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif']
});

export default async function RootLayout({ children }) {
  const data = await getSession();

  // console.log('LAYOUT', data);

  return (
    <html lang='en' className={vgaFont.className}>
      <head>

      </head>
      <body>
        <NavBar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
