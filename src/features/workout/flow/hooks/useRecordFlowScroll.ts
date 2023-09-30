import { useEffect } from 'react';

import { setFlowScrollPosition } from '../lib';

// ---

export default function useRecordFlowScroll(
	workoutId: string,
	onChange: (scrollPosition: number) => void
) {
	useEffect(() => {
		const updateScrollPosition = () => {
			const scrollPosition = window.scrollY;
			setFlowScrollPosition(workoutId, scrollPosition);
			onChange(scrollPosition);
		};

		window.addEventListener('scroll', updateScrollPosition);

		return () => {
			window.removeEventListener('scroll', updateScrollPosition);
		};
		/* eslint-disable react-hooks/exhaustive-deps */
	}, [workoutId]);
}
