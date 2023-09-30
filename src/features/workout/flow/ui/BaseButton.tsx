import React from 'react';
import { Button, Tooltip } from 'antd';
import { ButtonSize, ButtonType } from 'antd/es/button';

// ---

interface BaseButtonProps {
	onClick: () => void;
	concise?: boolean;
	icon: React.ReactNode;
	type?: ButtonType;
	size?: ButtonSize;
	block?: boolean;
	children?: React.ReactNode;
	tooltipTitle?: string | React.ReactNode;
}

export default function BaseButton({
	concise,
	icon,
	type,
	size,
	block,
	children,
	tooltipTitle,
	onClick,
}: BaseButtonProps) {
	return concise ? (
		<Tooltip title={tooltipTitle}>
			<Button size={size} block={block} type={type} onClick={onClick}>
				{icon}
			</Button>
		</Tooltip>
	) : (
		<Button size={size} block={block} type={type} onClick={onClick}>
			{icon} {children}
		</Button>
	);
}

BaseButton.defaultProps = {
	concise: false,
	children: null,
	type: 'text',
	size: 'medium',
	block: false,
	tooltipTitle: null,
};
