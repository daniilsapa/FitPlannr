import React, { useState } from 'react';
import { Checkbox, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SortOrder } from 'antd/es/table/interface';

import { Category } from '../../entities/category/model';
import { I18nMessage } from '../../shared/ui/i18n';
import { Exercise } from '../../entities/exercise/model';
import {
	FormDay,
	FormPlannedExercise,
	FormPlannedSet,
	FormWeek,
} from './types';

// ---

interface CategoryMetaData {
	tonnage: number;
	numberOfLifts: number;
}

type CategoryWithMetaAndDisabled = Category & {
	meta: CategoryMetaData;
	disabled: boolean;
};

function createCategoryToMetaData(categories: Category[]) {
	const categoryToMetaData: Record<string, CategoryMetaData> = {};

	return categories.reduce((acc, category) => {
		return {
			...acc,
			[category._id]: {
				tonnage: 0,
				numberOfLifts: 0,
			},
		};
	}, categoryToMetaData);
}

interface LoadCalculatorProps {
	categories: Record<string, Category>;
	exercises: Record<string, Exercise>;
	plan: FormWeek[];
	showColumnTitles?: boolean;
}

function withDisabled(
	sorter: (
		a: CategoryWithMetaAndDisabled,
		b: CategoryWithMetaAndDisabled
	) => 1 | -1 | number
) {
	return (
		a: CategoryWithMetaAndDisabled,
		b: CategoryWithMetaAndDisabled,
		sortOrder?: SortOrder
	) => {
		if (a.disabled && b.disabled) {
			return sorter(a, b);
		}

		if (a.disabled) {
			if (!sortOrder) {
				return 1;
			}
			return sortOrder === 'ascend' ? 1 : -1;
		}

		if (b.disabled) {
			if (!sortOrder) {
				return -1;
			}
			return sortOrder === 'ascend' ? -1 : 1;
		}

		return sorter(a, b);
	};
}

function calculateLoad(
	categoryMetas: Record<string, CategoryMetaData>,
	exercises: Record<string, Exercise>,
	plan: FormWeek[]
) {
	const categoryMetasCopy = structuredClone(categoryMetas);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function isNumeric(value: any): boolean {
		return !Number.isNaN(value - parseFloat(value));
	}

	plan.forEach((week: FormWeek) => {
		week.days.forEach((day: FormDay) => {
			day.exercises.forEach((exercise: FormPlannedExercise) => {
				if (!exercise.exercise) {
					return;
				}
				const { sets } = exercise;
				const categoryIds = exercises[exercise.exercise].categories;

				categoryIds.forEach((categoryId) => {
					sets.forEach((set: FormPlannedSet) => {
						if (!isNumeric(set.load)) {
							return;
						}

						categoryMetasCopy[categoryId].tonnage +=
							(Number(set.load) ?? 0) * (set.repeats ?? 0) * (set.sets ?? 0);
						categoryMetasCopy[categoryId].numberOfLifts +=
							(set.repeats ?? 0) * (set.sets ?? 0);
					});
				});
			});
		});
	});

	return categoryMetasCopy;
}

export default function LoadCalculator({
	categories,
	exercises,
	plan,
	showColumnTitles = true,
}: LoadCalculatorProps) {
	const [disabledCategories, setDisabledCategories] = useState<
		Record<string, boolean>
	>({});
	const categoryToMetaData = createCategoryToMetaData(
		Object.values(categories)
	);
	const categoryMetas = calculateLoad(categoryToMetaData, exercises, plan);
	const items: CategoryWithMetaAndDisabled[] = Object.entries(categoryMetas)
		.map(
			([categoryId, categoryMeta]): CategoryWithMetaAndDisabled => ({
				_id: categoryId,
				name: categories[categoryId].name,
				color: categories[categoryId].color,
				meta: categoryMeta,
				disabled: disabledCategories[categoryId],
			})
		)
		.sort(
			withDisabled(
				(a: CategoryWithMetaAndDisabled, b: CategoryWithMetaAndDisabled) =>
					a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
			)
		);

	const handleCheckboxChange = (category: Category, checked: boolean) => {
		setDisabledCategories({
			...disabledCategories,
			[category._id]: checked,
		});
	};

	const columns: ColumnsType<CategoryWithMetaAndDisabled> = [
		{
			title: <I18nMessage id="Category.category" />,
			dataIndex: 'name',
			render: (text, record: Category) => (
				<Space>
					<Tag color={record.color}>{text}</Tag>
				</Space>
			),
		},
		{
			title: <I18nMessage id="Workout.numberOfLiftsAbbr" />,
			dataIndex: 'meta',
			defaultSortOrder: 'descend',
			render: (meta) => meta.numberOfLifts,
			sorter: (aCat, bCat, sortOrder) =>
				withDisabled((a, b) => a.meta.numberOfLifts - b.meta.numberOfLifts)(
					aCat,
					bCat,
					sortOrder
				),
		},
		{
			title: <I18nMessage id="Workout.tonnage" />,
			dataIndex: 'meta',
			render: (meta) => meta.tonnage,
			sorter: (aCat, bCat, sortOrder) =>
				withDisabled((a, b) => a.meta.tonnage - b.meta.tonnage)(
					aCat,
					bCat,
					sortOrder
				),
		},
		{
			title: <I18nMessage id="Common.disabledAbbr" />,
			dataIndex: '_id',
			render: (_, category) => (
				<Space>
					<Checkbox
						checked={category.disabled}
						onChange={(e) => handleCheckboxChange(category, e.target.checked)}
					/>
				</Space>
			),
		},
	];

	return (
		<div
			className={`load-calculator ${
				showColumnTitles ? '' : 'load-calculator__hide-column-titles'
			}`}
		>
			<Table
				bordered
				size="small"
				showHeader
				pagination={false}
				scroll={{ y: 405 }}
				rowClassName={(record) => (record.disabled ? 'row-disabled' : '')}
				columns={
					showColumnTitles
						? columns
						: columns.map(({ title, ...rest }) => ({ ...rest }))
				}
				dataSource={items}
			/>
		</div>
	);
}

LoadCalculator.defaultProps = {
	showColumnTitles: true,
};
