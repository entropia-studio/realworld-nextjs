import React from 'react';
import Head from 'next/head';
import { Footer } from './Footer';
import { Navigation } from './Navigation';

export const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <title>Conduit</title>
        <link
          href='//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css'
          rel='stylesheet'
          type='text/css'
        />
        <link
          href='//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic'
          rel='stylesheet'
          type='text/css'
        />
        <link rel='stylesheet' href='//demo.productionready.io/main.css'></link>
      </Head>
      <Navigation />
      <main className='m-b-3'>{children}</main>
      <Footer />
    </>
  );
};
