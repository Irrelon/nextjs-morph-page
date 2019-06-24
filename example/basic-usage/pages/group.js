import React, {PureComponent} from 'react';

class Group extends PureComponent {
	render () {
		return (
			<div className='page'>
				<div className='containerWrap'>
					<div className='flex'>
						<div className='logoBox'>
							<div className={'imageContainer'} id='mainLogo1' data-morph-ms="100">
								<img className={'img1'} src={'/static/wf1.jpg'} />
							</div>
						</div>
						<div className='logoBox'>
							<div className={'imageContainer'} id='mainLogo2' data-morph-ms="200">
								<img className={'img1'} src={'/static/wf2.jpg'} />
							</div>
						</div>
						<div className='logoBox'>
							<div className={'imageContainer'} id='mainLogo3' data-morph-ms="300">
								<img className={'img1'} src={'/static/wf3.jpg'} />
							</div>
						</div>
						<div className='logoBox'>
							<div className={'imageContainer'} id='mainLogo4' data-morph-ms="400">
								<img className={'img1'} src={'/static/wf4.jpg'} />
							</div>
						</div>
					</div>
				</div>
				<style jsx>{`
					.page {
						background-color: #F2F4F8;
					}
					.flex {
						display: flex;
					}
					.logoBox {
						width: 100px;
						border-radius: 50%;
    					margin-right: 10px;
					}
					.imageContainer {
						border-radius: 10%;
						display: block;
						width: 100px;
						height: 100px;
						margin-top: 10px;
						margin-bottom: 10px;
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

export default Group;