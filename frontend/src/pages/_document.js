import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Connect with professionals, find jobs, and grow your network with JobNexus."
        />
        <link rel="icon" type="image/png" href="/images/linkedin.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
