import Head from "next/head";
import { Roboto } from "next/font/google";
import "../styles/globals.css";
import "leaflet/dist/leaflet.css";
import { GA_TRACKING_ID, pageview } from "../helpers/withGoogleAnalytics";
import React, { useEffect } from "react";
import Router from "next/router";
import "firebaseui/dist/firebaseui.css";
import firebase from "firebase/compat/app";

import {RecoilRoot} from 'recoil'

const roboto = Roboto({
  weight: "500",
  subsets: ["latin"],
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const firebaseConfig = {
  apiKey: "AIzaSyDGbDncnE8u9TuFfzOBWqYasgeDmKaSrSE",
  authDomain: "hss-application.firebaseapp.com",
  projectId: "hss-application",
  storageBucket: "hss-application.appspot.com",
  messagingSenderId: "124675882675",
  appId: "1:124675882675:web:7b389a2a209de8da2efac6",
  measurementId: "G-JT6FHMP7DN",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// This default export is required in a new `pages/_app.js` file.
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" ||
      process.env.NODE_ENV === "development"
    ) {
      const handleRouteChange = (url) => {
        pageview(url);
      };

      Router.events.on("routeChangeComplete", handleRouteChange);

      return () => {
        Router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
  }, []);

  return (
    <main className={roboto.className}>
      <Head>
        {process.env.NODE_ENV === "production" ||
        process.env.NODE_ENV === "development" ? (
          <>
          {/* 不需要分析功能这里注释了 */}
            {/* <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            /> */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${GA_TRACKING_ID}');
                        `,
              }}
            />
          </>
        ) : null}
        <link rel="manifest" href={basePath + "/manifest.json"} />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="A brief description of your app" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="HSS" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${basePath}/icons/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${basePath}/icons/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${basePath}/icons/favicon-16x16.png`}
        />
      </Head>
      <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
    
    </main>
  );
}

export default MyApp;
