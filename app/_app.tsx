import { AppProps } from 'next/app';
import { reportWebVitals as reportToAnalytics } from '@/lib/performance';

export function reportWebVitals(metric: any) {
  reportToAnalytics(metric);
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;