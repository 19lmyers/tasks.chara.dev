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

export const header = style({
	padding: 16,
	display: 'flex',
	justifyContent: 'space-between',
	gap: 8,
	position: 'sticky',
	top: 0,
	zIndex: 100,
	'@media': {
		'(prefers-color-scheme: light)': {
			backgroundColor: themeContract.colorSchemes.light.background
		},
		'(prefers-color-scheme: dark)': {
			backgroundColor: themeContract.colorSchemes.dark.background
		}
	}
});

export const headerFlex = style({
	display: 'flex',
	alignItems: 'center',
	gap: 8
});

export const headerRight = style({
	justifyContent: 'flex-end'
});

export const headerWrap = style({
	flexWrap: 'wrap'
});

export const headerFill = style({
	flexGrow: 1
});

export const icon = style({
	display: 'flex',
	'@media': {
		'(prefers-color-scheme: light)': {
			color: themeContract.colorSchemes.light.primary
		},
		'(prefers-color-scheme: dark)': {
			color: themeContract.colorSchemes.dark.primary
		}
	}
});

export const profileButton = style({
	backgroundColor: 'inherit',
	border: 'none',
	cursor: 'pointer'
});

export const profilePhoto = style({
	width: 48,
	height: 48,
	borderRadius: '1.5rem',
	selectors: {
		'&:hover:not(:disabled)': {
			borderRadius: '0.75rem'
		},
		'&:focus:not(:disabled)': {
			borderRadius: '0.75rem'
		},
		'&:active:not(:disabled)': {
			borderRadius: '0.75rem'
		}
	}
});
