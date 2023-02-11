import React from "react";
import Head from "next/head";

export default function LoadingSpinner() {
  return (
    <>
     <Head>
         <link rel="stylesheet" href="/styles/spinner.css" />
      </Head>
      <div className="spinner-container">
         <div className="loading-spinner">
         </div>
      </div>
    </>
    
  );
}