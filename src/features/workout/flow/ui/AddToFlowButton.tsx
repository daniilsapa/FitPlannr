import React from 'react';
import { ButtonSize, ButtonType } from 'antd/es/button';
import { PlusCircleOutlined } from '@ant-design/icons';

import addToFlow from '../lib';
import BaseButton from './BaseButton';

// ---

interface AddToFlowButtonProps {
	workoutId: string;
	concise?: boolean;
	block?: boolean;
	size?: ButtonSize;
	type?: ButtonType;
	onClick?: () => void;
}

export default function AddToFlowButton({
	concise,
	workoutId,
	block,
	size,
	type,
	onClick,
}: AddToFlowButtonProps) {
	return (
		<BaseButton
			concise={concise}
			block={block}
			type={type}
			size={size}
			onClick={() => {
				addToFlow(workoutId);
				/* eslint-disable @typescript-eslint/no-non-null-assertion */
				onClick!();
			}}
			icon={<PlusCircleOutlined />}
			tooltipTitle="Add to flow"
		>
			Add to flow
		</BaseButton>
	);
}

AddToFlowButton.defaultProps = {
	concise: false,
	block: false,
	type: 'text',
	size: 'medium',
	onClick: () => {},
};
