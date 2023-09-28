import React, { useState } from 'react';
import { theme } from 'antd';
import {
	motion,
	useAnimation,
	useDragControls,
	EventInfo,
} from 'framer-motion';

// ---

interface CollapsibleBlockProps {
	children: React.ReactNode | ((isExpanded: boolean) => React.ReactNode);
	collapsedHeight?: string;
	expandedHeight?: string;
}

const { useToken } = theme;

export default function CollapsibleBlock({
	children,
	collapsedHeight,
	expandedHeight,
}: CollapsibleBlockProps) {
	const { token } = useToken();
	const [isExpanded, setIsExpanded] = useState(false);
	const controls = useAnimation();
	const dragControls = useDragControls();

	const handleDrag = (_: MouseEvent | TouchEvent, info: EventInfo) => {
		const { point } = info;
		const threshold = window.innerHeight / 1.5; // Adjust the threshold as needed
		const expanded = point.y < threshold;

		controls.start({ height: expanded ? expandedHeight : collapsedHeight });
		setIsExpanded(expanded); // Adjust the heights as needed
	};

	return (
		<motion.div
			className="collapsed-block"
			style={{ background: token.colorBgElevated }}
			initial={{ height: collapsedHeight }} // Adjust initial height
			animate={controls}
			drag="y"
			dragElastic={{
				top: 0,
				bottom: 0.1,
			}}
			dragConstraints={{ top: 0, bottom: 0 }}
			dragControls={dragControls}
			onDrag={handleDrag}
		>
			<div className="handle-wrapper">
				<div className="handle" style={{ background: token.colorBorder }} />
			</div>
			{typeof children === 'function' ? children(isExpanded) : children}
		</motion.div>
	);
}

CollapsibleBlock.defaultProps = {
	collapsedHeight: '100px',
	expandedHeight: '200px',
};
