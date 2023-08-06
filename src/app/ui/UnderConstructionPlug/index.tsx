import React from 'react';
import { Image, Layout, Typography } from 'antd';

import underConstruction from '../../under-construction.png';

import './index.css';
import { I18nMessage } from '../../../shared/ui/i18n';

//---

export default function UnderConstructionPlug() {
	return (
		<div className="under-construction">
			<Layout
				style={{
					height: '100vh',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<div className="under-construction-inner">
					<div className="under-construction-container">
						<Typography.Title level={1}>
							<I18nMessage id="App.pageIsUnderConstruction" />
						</Typography.Title>
						<p>
							<Typography.Text>
								<I18nMessage id="App.screenIsTooSmallDescription" />
							</Typography.Text>
						</p>
					</div>

					<div className="under-construction-container">
						<Image
							alt="Under construction image"
							src={underConstruction}
							width="100%"
							preview={false}
						/>
					</div>
				</div>
			</Layout>
		</div>
	);
}
