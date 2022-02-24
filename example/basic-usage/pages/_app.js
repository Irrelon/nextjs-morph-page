import React from 'react';
import MorphTransition from 'nextjs-morph-page';
import Header from "../components/Header";

function MyApp({Component, pageProps, router}) {
	return (
		<>
			<MorphTransition timeout={300} classNames="morph">
				<>
					<Header page={router.pathname.slice(1).replace(/\//g, '-') || "home"}/>
					<Component {...pageProps} />
				</>
			</MorphTransition>
			<style jsx global>{`
              html, body {
                padding: 0;
                margin: 0;
                font-family: "proxima-nova", Helvetica, Arial, sans-serif;
              }

              .containerWrap {
                position: relative;
                max-width: 950px;
                margin-left: auto;
                margin-right: auto;
              }

              .morph.enter.header {
                opacity: 0.5;
              }

              .morph.enter.active .header {
                opacity: 1;
                transition: opacity 1000ms;
              }

              .morph.exit .header {
                opacity: 0.5;
              }

              .morph.exit.active .header {
                opacity: 0;
                transition: opacity 1000ms;
              }

              .row {
                display: flex;
                flex-direction: row;
              }

              .column {
                display: flex;
                flex-direction: column;
              }

              .flex {
                display: flex;
                flex: 1;
              }

              .wrap {
                flex-wrap: wrap;
              }
			`}</style>
		</>
	);
}

export default MyApp;