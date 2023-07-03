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

import { globalStyle, style } from '@vanilla-extract/css';
import { icon } from '$lib/component/base/Icon.css';
import { button } from '$lib/component/base/Button.css';
import { themeContract } from '$lib/theme';

export const dropdown = style({
	display: 'inline-block'
});

export const label = style({
	background: 'none',
	color: 'inherit',
	border: 'none',
	padding: 0,
	font: 'inherit',
	cursor: 'pointer',
	outline: 'inherit'
});

export const content = style({
	position: 'absolute',
	right: 16,
	zIndex: 10,
	boxShadow: themeContract.elevation.level1,
	borderRadius: '0.5em',
	'@media': {
		'(prefers-color-scheme: light)': {
			backgroundColor: themeContract.colorSchemes.light.surfaceContainerHigh
		},
		'(prefers-color-scheme: dark)': {
			backgroundColor: themeContract.colorSchemes.dark.surfaceContainerHigh
		}
	}
});

globalStyle(`${content} ul`, {
	listStyleType: 'none',
	padding: '4px'
});

globalStyle(`${content} ${button}`, {
	width: 'calc(100% - 6px)',
	margin: 4,
	'@media': {
		'(prefers-color-scheme: light)': {
			color: themeContract.colorSchemes.light.onSurface
		},
		'(prefers-color-scheme: dark)': {
			color: themeContract.colorSchemes.dark.onSurface
		}
	}
});

globalStyle(`${content} ${button} ${icon}`, {
	paddingRight: 8
});
