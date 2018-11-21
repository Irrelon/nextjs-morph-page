import React, {Fragment} from 'react';
import App, {Container} from 'next/app';
import MorphTransition from 'nextjs-morph-page';
import Header from "../components/Header";

export default class MyApp extends App {
	static async getInitialProps (req) {
		const {Component, router, ctx} = req;
		let pageProps = {};
		
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx) || {};
		}
		
		return {
			pageProps
		};
	}
	
	render () {
		const {Component, pageProps} = this.props;
		
		return (
			<Container>
				<MorphTransition timeout={0} classNames="page-transition">
					<Fragment>
						<Header page={this.props.router.pathname.slice(1).replace(/\//g, '-')} />
						<Component {...pageProps} />
					</Fragment>
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
					.page-transition-enter .header {
						opacity: 0.5;
					}
					.page-transition-enter-active .header {
						opacity: 1;
						transition: opacity 1000ms;
					}
					.page-transition-exit .header {
						opacity: 0.5;
					}
					.page-transition-exit-active .header {
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
			</Container>
		)
	}
}