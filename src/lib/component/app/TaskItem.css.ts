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

export const taskContainer = style({
	flex: '0 1',
	display: 'flex',
	alignItems: 'center',
	height: '100%',
	paddingTop: 4,
	paddingBottom: 4
});

export const ordinal = style({
	paddingRight: 12,
	fontSize: '1.25rem'
});

export const taskItem = style({
	height: '100%',
	flexGrow: 1,
	display: 'flex',
	flexDirection: 'column',
	borderRadius: '1.5rem',
	border: 'solid',
	padding: '8px',
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

export const taskContents = style({
	display: 'flex'
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
	opacity: '85%',
	whiteSpace: 'pre-wrap',
	height: '2.4rem',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
	display: '-webkit-inline-box',
	WebkitLineClamp: 2,
	WebkitBoxOrient: 'vertical'
});

export const hoverAction = style({
	display: 'none'
});

globalStyle(`${taskItem}:hover ${hoverAction}`, {
	display: 'block'
});

export const chips = style({
	display: 'flex',
	flexWrap: 'wrap'
});

export const chip = style({
	borderRadius: '0.75rem',
	border: `1px solid ${themeContract.colorSchemes.dark.outline}`,
	fontSize: '0.75rem',
	width: 'fit-content',
	display: 'flex',
	alignItems: 'center',
	alignContent: 'space-between',
	paddingRight: 12,
	marginTop: 4,
	marginBottom: 4
});
