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
	display: 'flex',
	alignItems: 'center',
	'@media': {
		'(prefers-color-scheme: light)': {
			color: themeContract.colorSchemes.light.primary
		},
		'(prefers-color-scheme: dark)': {
			color: themeContract.colorSchemes.dark.primary
		}
	}
});

export const icon = style({
	'@media': {
		'(prefers-color-scheme: light)': {
			color: themeContract.colorSchemes.light.primary
		},
		'(prefers-color-scheme: dark)': {
			color: themeContract.colorSchemes.dark.primary
		}
	}
});

export const actions = style({
	width: '100%',
	display: 'flex',
	justifyContent: 'space-between'
});

export const copyLink = style({
	display: 'flex',
	alignItems: 'center',
	padding: 12,
	borderRadius: '1.5em',
	border: 'solid',
	position: 'relative',
	zIndex: 1,
	'@media': {
		'(prefers-color-scheme: light)': {
			backgroundColor: themeContract.colorSchemes.light.surfaceContainerHigh,
			color: themeContract.colorSchemes.light.onSurface,
			borderColor: themeContract.colorSchemes.light.surfaceContainerHighest,
			':hover': {
				color: themeContract.colorSchemes.light.primary
			},
			'::before': {
				backgroundColor: themeContract.colorSchemes.light.primary
			}
		},
		'(prefers-color-scheme: dark)': {
			backgroundColor: themeContract.colorSchemes.dark.surfaceContainerHigh,
			color: themeContract.colorSchemes.dark.onSurface,
			borderColor: themeContract.colorSchemes.dark.surfaceContainerHighest,
			':hover': {
				color: themeContract.colorSchemes.dark.primary
			},
			'::before': {
				backgroundColor: themeContract.colorSchemes.light.primary
			}
		}
	},
	'::before': {
		position: 'absolute',
		top: 0,
		left: 0,
		height: '100%',
		width: '100%',
		zIndex: 0,
		transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
		transitionDuration: '0.25s',
		pointerEvents: 'none',
		borderRadius: '1.5rem'
	},
	selectors: {
		'&:hover:not(:disabled)::before': {
			content: '',
			opacity: '8%'
		},
		'&:focus:not(:disabled)::before': {
			content: '',
			opacity: '12%'
		},
		'&:active:not(:disabled)::before': {
			content: '',
			opacity: '12%'
		}
	}
});
