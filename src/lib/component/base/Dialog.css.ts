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

/*
export const scrim = style({
	position: 'absolute',
	width: '100%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	':before': {
		content: '',
		opacity: '16%',
		position: 'absolute',
		width: '100%',
		height: '100%',
		top: 0,
		left: 0,
		zIndex: 5
	},
	'@media': {
		'(prefers-color-scheme: light)': {
			':before': {
				backgroundColor: themeContract.colorSchemes.light.scrim
			}
		},
		'(prefers-color-scheme: dark)': {
			':before': {
				backgroundColor: themeContract.colorSchemes.dark.scrim
			}
		}
	}
});
*/

export const dialog = style({
	margin: 'auto',
	zIndex: 10,
	borderRadius: '1.5em',
	border: 'none',
	opacity: '100%',
	maxWidth: 500,
	padding: 0,
	boxShadow: themeContract.elevation.level2,
	'@media': {
		'(prefers-color-scheme: light)': {
			backgroundColor: themeContract.colorSchemes.light.surfaceContainerHighest,
			color: themeContract.colorSchemes.light.onSurface
		},
		'(prefers-color-scheme: dark)': {
			backgroundColor: themeContract.colorSchemes.dark.surfaceContainerHighest,
			color: themeContract.colorSchemes.dark.onSurface
		}
	}
});

export const content = style({});
