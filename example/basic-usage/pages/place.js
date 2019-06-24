import React, {PureComponent} from 'react';

class Place extends PureComponent {
	render () {
		return (
			<div className='page'>
				<div className='containerWrap'>
					<div className={'row wrap'}>
						<div className='column'>
							<div className={'imageContainer'} id='mainLogo1' data-morph-ms="100">
								<img className={'img1'} src={'/static/wf1.jpg'} />
							</div>
						</div>
						<div className='column'>
							<div className={'imageContainer'} id='mainLogo2' data-morph-ms="200">
								<img className={'img1'} src={'/static/wf2.jpg'} />
							</div>
						</div>
						<div className='column'>
							<div className={'imageContainer'} id='mainLogo3' data-morph-ms="300">
								<img className={'img1'} src={'/static/wf3.jpg'} />
							</div>
						</div>
						<div className='column'>
							<div className={'imageContainer'} id='mainLogo4' data-morph-ms="400">
								<img className={'img1'} src={'/static/wf4.jpg'} />
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className={'column'}>
							<div>
								<h1 id={'pageTitle'} data-morph-ms="300">Places</h1>
							</div>
							<div>
								<p id={'pageDetail'} data-morph-ms="300">Place page with some other text.</p>
							</div>
						</div>
					</div>
				</div>
				<style jsx>{`
					.page {
						background-color: #F2F4F8;
					}
					.imageContainer {
						border-radius: 5%;
						display: block;
						width: 200px;
						height: 130px;
						margin-top: 10px;
						margin-bottom: 10px;
						margin-right: 10px;
						overflow: hidden;
					}
					.img1 {
						width: 200px;
					}
				`}</style>
			</div>
		);
	}
}

export default Place;