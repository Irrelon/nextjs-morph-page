import React, {Component} from "react";
import Link from 'next/link';

class Home extends Component {
	render () {
		return (
			<div className='page'>
				<div className={'containerWrap'}>
					<div className={'row'}>
						<div className={'column leftCol'}>
							<div>
								<div className={'imageContainer'} id='mainLogo1' data-morph-ms="100">
									<img className={'img1'} src={'/static/wf1.jpg'} />
								</div>
							</div>
							<div>
								<div className={'imageContainer'} id='mainLogo2' data-morph-ms="200">
									<img className={'img1'} src={'/static/wf2.jpg'} />
								</div>
							</div>
							<div>
								<div className={'imageContainer'} id='mainLogo3' data-morph-ms="300">
									<img className={'img1'} src={'/static/wf3.jpg'} />
								</div>
							</div>
							<div>
								<div className={'imageContainer'} id='mainLogo4' data-morph-ms="400">
									<img className={'img1'} src={'/static/wf4.jpg'} />
								</div>
							</div>
						</div>
						<div className={'column'}>
							<div>
								<h1 id={'pageTitle'} data-morph-ms="300">Home</h1>
							</div>
							<div>
								<p id={'pageDetail'} data-morph-ms="300">This is the home page. Here we have some really interested stuff about the user and whotnot.</p>
							</div>
						</div>
					</div>
				</div>
				<style jsx>{`
					.imageContainer {
						margin-top: 20px;
						border-radius: 50%;
						display: block;
						width: 100px;
						height: 100px;
						overflow: hidden;
					}
					.img1 {
						width: 200px;
					}
					.leftCol {
						margin-right: 10px;
					}
				`}</style>
			</div>
		);
	}
}

export default Home;