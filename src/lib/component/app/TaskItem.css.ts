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

export const taskItem = style({
	display: 'flex',
	borderRadius: '1.5rem',
	marginTop: '4px',
	marginBottom: '4px',
	padding: '8px',
	'@media': {
		'(prefers-color-scheme: light)': {
			backgroundColor: themeContract.colorSchemes.light.surfaceVariant,
			color: themeContract.colorSchemes.light.onSurfaceVariant
		},
		'(prefers-color-scheme: dark)': {
			backgroundColor: themeContract.colorSchemes.dark.surfaceVariant,
			color: themeContract.colorSchemes.dark.onSurfaceVariant
		}
	}
});

export const checkbox = style({
	marginRight: '8px',
	width: '1.5em',
	'@media': {
		'(prefers-color-scheme: light)': {
			accentColor: themeContract.colorSchemes.light.primary
		},
		'(prefers-color-scheme: dark)': {
			accentColor: themeContract.colorSchemes.dark.primary
		}
	}
});

export const text = style({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center'
});

export const label = style({
	fontSize: '1rem'
});

export const spacer = style({
	flex: 1
});

export const details = style({
	fontSize: '0.8rem',
	opacity: '85%'
});
