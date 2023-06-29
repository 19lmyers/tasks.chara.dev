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
import { themeContract } from '$lib/theme';

import { card, cardContent } from '../base/Card.css';

export const container = style({
	width: '100%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	'@media': {
		'(prefers-color-scheme: light)': {
			backgroundColor: themeContract.colorSchemes.light.surfaceVariant,
			color: themeContract.colorSchemes.light.surfaceVariant
		},
		'(prefers-color-scheme: dark)': {
			backgroundColor: themeContract.colorSchemes.dark.surface,
			color: themeContract.colorSchemes.dark.onSurface
		}
	}
});

export const content = style({
	width: '90%',
	height: '90%',
	margin: 'auto',
	borderRadius: '1.5em',
	'@media': {
		'(min-width: 680px)': {
			width: '50%',
			maxWidth: '400px',
			height: '60%'
		},
		'(prefers-color-scheme: light)': {
			backgroundColor: themeContract.colorSchemes.light.surface,
			color: themeContract.colorSchemes.light.onSurface
		},
		'(prefers-color-scheme: dark)': {
			backgroundColor: themeContract.colorSchemes.dark.surfaceVariant,
			color: themeContract.colorSchemes.dark.onSurfaceVariant
		}
	}
});

globalStyle(`${content} ${card}`, {
	display: 'flex',
	flexDirection: 'column',
	height: '100%'
});

globalStyle(`${content} form`, {
	height: '100%'
});

globalStyle(`${content} ${cardContent}`, {
	flex: 1
});
