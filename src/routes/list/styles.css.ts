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

export const listPage = style({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	flexGrow: 1,
	'@media': {
		'(prefers-color-scheme: light)': {
			backgroundColor: themeContract.colorSchemes.light.background,
			color: themeContract.colorSchemes.light.onBackground
		},
		'(prefers-color-scheme: dark)': {
			backgroundColor: themeContract.colorSchemes.dark.background,
			color: themeContract.colorSchemes.dark.onBackground
		}
	}
});

export const tasksContainer = style({
	padding: 16
});

export const tasksGroup = style({
	display: 'grid',
	gap: '0 0.5rem',
	'@media': {
		'screen and (min-width: 640px)': {
			gridTemplateColumns: 'repeat(2, 1fr)'
		},
		'screen and (min-width: 860px)': {
			gridTemplateColumns: 'repeat(3, 1fr)'
		},
		'screen and (min-width: 1280px)': {
			gridTemplateColumns: 'repeat(4, 1fr)'
		}
	}
});

export const divider = style({
	appearance: 'none',
	textDecoration: 'none',

	border: 'unset',
	background: 'inherit',
	font: 'inherit',
	cursor: 'pointer',
	width: '100%',

	padding: '12px',
	borderRadius: '2em',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',

	'@media': {
		'(prefers-color-scheme: light)': {
			color: themeContract.colorSchemes.light.onSurface,
			':hover': {
				backgroundColor: themeContract.colorSchemes.light.surfaceVariant
			}
		},
		'(prefers-color-scheme: dark)': {
			color: themeContract.colorSchemes.dark.onSurface,
			':hover': {
				backgroundColor: themeContract.colorSchemes.dark.surfaceVariant
			}
		}
	}
});

export const placeholder = style({
	textAlign: 'center'
});

export const sort = style({
	padding: 16,
	display: 'flex',
	justifyContent: 'space-between',
	position: 'sticky',
	bottom: 0,
	zIndex: 100,
	'@media': {
		'(min-width: 640px)': {
			justifyContent: 'flex-start'
		},
		'(prefers-color-scheme: light)': {
			backgroundColor: themeContract.colorSchemes.light.surfaceContainer,
			color: themeContract.colorSchemes.light.onSurface
		},
		'(prefers-color-scheme: dark)': {
			backgroundColor: themeContract.colorSchemes.dark.surfaceContainer,
			color: themeContract.colorSchemes.dark.onSurface
		}
	}
});
