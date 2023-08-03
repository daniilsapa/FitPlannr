import React from 'react';
import { Row, Col } from 'antd';

import './index.css';

// ---

export default function NotFoundPage() {
	return (
		<div className="not-found-page">
			<main className="not-found-page-inner">
				<Row>
					<Col offset="8" span="8">
						<h1 className="not-found-title">404</h1>
						<p className="not-found-text">Page not found</p>
					</Col>
				</Row>
			</main>
		</div>
	);
}
