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

import { style } from '@vanilla-extract/css';
import { themeContract } from '$lib/theme';

export const taskListItem = style({
	width: 'min-content',
	minWidth: '200px',
	maxWidth: '600px'
});

export const header = style({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center'
});

export const progress = style({
	width: '100%',
	'@media': {
		'(prefers-color-scheme: light)': {
			accentColor: themeContract.colorSchemes.light.primary
		},
		'(prefers-color-scheme: dark)': {
			accentColor: themeContract.colorSchemes.dark.primary
		}
	}
});

export const bullet = style({
	listStyleType: 'none'
});

export const divider = style({
	border: 'unset',
	background: 'inherit',
	font: 'inherit',
	cursor: 'pointer',
	width: '100%',

	padding: '12px',
	borderRadius: '1.5em',
	display: 'flex',
	justifyContent: 'space-between',

	'@media': {
		'(prefers-color-scheme: light)': {
			':hover': {
				backgroundColor: themeContract.colorSchemes.light.surfaceVariant
			}
		},
		'(prefers-color-scheme: dark)': {
			':hover': {
				backgroundColor: themeContract.colorSchemes.dark.surfaceVariant
			}
		}
	}
});
