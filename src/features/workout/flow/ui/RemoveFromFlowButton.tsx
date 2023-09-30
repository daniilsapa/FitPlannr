import React from 'react';
import { ButtonSize, ButtonType } from 'antd/es/button';
import { MinusCircleOutlined } from '@ant-design/icons';

import { removeFromFlow } from '../lib';
import BaseButton from './BaseButton';

// ---

interface RemoveToFlowButtonProps {
	workoutId: string;
	concise?: boolean;
	size?: ButtonSize;
	block?: boolean;
	type?: ButtonType;
	onClick?: () => void;
}

export default function RemoveToFlowButton({
	concise,
	workoutId,
	block,
	size,
	type,
	onClick,
}: RemoveToFlowButtonProps) {
	return (
		<BaseButton
			concise={concise}
			block={block}
			type={type}
			size={size}
			onClick={() => {
				removeFromFlow(workoutId);
				/* eslint-disable @typescript-eslint/no-non-null-assertion */
				onClick!();
			}}
			icon={<MinusCircleOutlined />}
			tooltipTitle="Remove from Flow"
		/>
	);
}

RemoveToFlowButton.defaultProps = {
	concise: false,
	block: false,
	type: 'text',
	size: 'medium',
	onClick: () => {},
};
