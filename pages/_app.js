import '../styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0';
import { SWRConfig } from 'swr';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </UserProvider>
  );
}

export default MyApp;
