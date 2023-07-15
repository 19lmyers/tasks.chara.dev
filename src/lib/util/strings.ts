/*
 * MIT License
 *
 * Copyright (c) 2023 Luke Myers
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { SortDirection, SortType, ThemeVariant } from '$lib/type';

export function labelFromSortType(type: SortType) {
	switch (type) {
		case SortType.LABEL:
			return 'Label';
		case SortType.DATE_CREATED:
			return 'Date created';
		case SortType.UPCOMING:
			return 'Upcoming';
		case SortType.STARRED:
			return 'Starred recently';
		default:
			return 'My order';
	}
}

export function labelFromSortDirection(direction: SortDirection) {
	if (direction === SortDirection.DESCENDING) {
		return 'DESC';
	} else {
		return 'ASC';
	}
}

export function labelFromThemeVariant(variant: ThemeVariant) {
	switch (variant) {
		case ThemeVariant.MONOCHROME:
			return 'Monochrome';
		case ThemeVariant.NEUTRAL:
			return 'Neutral';
		case ThemeVariant.VIBRANT:
			return 'Vibrant';
		case ThemeVariant.EXPRESSIVE:
			return 'Expressive';
		default:
			return 'Tonal spot (default)';
	}
}
