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

export const profileCard = style({
	padding: 12,
	borderRadius: '1.5em',
	display: 'flex',
	border: 'solid',
	'@media': {
		'(prefers-color-scheme: light)': {
			backgroundColor: themeContract.colorSchemes.light.surfaceContainerHigh,
			color: themeContract.colorSchemes.light.onSurface,
			borderColor: themeContract.colorSchemes.light.surfaceContainerHighest
		},
		'(prefers-color-scheme: dark)': {
			backgroundColor: themeContract.colorSchemes.dark.surfaceContainerHigh,
			color: themeContract.colorSchemes.dark.onSurface,
			borderColor: themeContract.colorSchemes.dark.surfaceContainerHighest
		}
	}
});

export const profilePhoto = style({
	width: 48,
	height: 48,
	borderRadius: '1.5rem',
	marginRight: 16
});

export const profileText = style({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center'
});

export const email = style({
	opacity: 0.7,
	fontSize: '0.9rem'
});
