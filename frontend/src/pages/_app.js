import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "@/config/redux/store";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>JobNexus – A hub for job seekers and employers</title>
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
