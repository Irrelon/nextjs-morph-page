import React, {PureComponent} from 'react';
import Link from "next/link";

class Header extends PureComponent {
	render () {
		return (
			<div className={'container ' + this.props.page} id={'headerBack'} data-morph-ms="300" data-morph-in-place="true">
				<div className={'nav'}>
					<div className={'containerWrap'}>
						<Link scroll={true} href={{pathname: '/home'}} as={`/`}>
							<a className="topLink home">Home</a>
						</Link>
						<Link scroll={true} href={{pathname: '/place'}} as={`/place`}>
							<a className="topLink place">My Places</a>
						</Link>
						<Link scroll={true} href={{pathname: '/group'}} as={`/group`}>
							<a className="topLink group">My Group</a>
						</Link>
					</div>
				</div>
				<div className={'containerWrap'}>
					<div className={'row'}>
						<div className={'column'}>
							<div className={'profile ' + this.props.page} id={'profileImage'} data-morph-ms="300" />
						</div>
					</div>
				</div>
				<style jsx>{`
					.container {
						color: #ffffff;
						width: 100%;
						height: 200px;
						user-select: none;
						box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.1);
						z-index: 0;
					}
					
					.nav {
						z-index: 1;
						height: 50px;
						background-color: rgba(4,67,98,.25);
						margin-bottom: 10px;
					}
					
					.nav .topLink {
						display: inline-block;
						margin-top: 0px;
						color: #fff;
						font-weight: bold;
						font-size: 12px;
						text-transform: uppercase;
						padding: 18px;
						text-decoration: none;
						transition: background-color 300ms;
					}
					
					.nav .topLink:hover {
						background-color: rgba(255, 255, 255, 0.2);
					}
					
					.home .nav .topLink.home {
						background-color: rgba(255, 255, 255, 0.2);
					}
					
					.place .nav .topLink.place {
						background-color: rgba(255, 255, 255, 0.2);
					}
					
					.group .nav .topLink.group {
						background-color: rgba(255, 255, 255, 0.2);
					}
					
					.profile {
						background-image: url(/static/profile1.jpg);
						background-position: 50%;
						background-size: cover;
						width: 70px;
						height: 70px;
						border-radius: 50%;
					}
					
					.profile.home {
						margin-top: 10px;
						width: 150px;
						height: 100px;
						border-radius: 10%;
					}
					
					.profile.place {
						margin-top: 10px;
						width: 100px;
						height: 100px;
						border-radius: 50%;
					}
					
					.profile.group {
						width: 200px;
						height: 130px;
						border-radius: 10%;
					}
					
					.container.home {
						background-image: url(/static/bg3.jpg);
						background-size: cover;
					}
					
					.container.place {
						background-image: url(/static/bg2.jpg);
						background-size: cover;
					}
					
					.container.group {
						background-image: url(/static/bg1.jpg);
						background-size: cover;
					}
				`}</style>
			</div>
		);
	}
}

export default Header;