import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import Head from 'next/head';
import { SSRProvider } from 'react-bootstrap';
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // โหลด Bootstrap JavaScript เมื่อ client-side rendering
    import('bootstrap/dist/js/bootstrap');
  }, []);

  return (
    <ThemeProvider attribute="class">
      <SSRProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>ระบบถ่ายรูปงานแต่งงาน</title>
          <meta name="description" content="ระบบถ่ายรูปงานแต่งงานพร้อมระบบจดจำใบหน้า" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </SSRProvider>
    </ThemeProvider>
  );
}

export default MyApp; 