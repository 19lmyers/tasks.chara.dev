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

import { themeContract } from './theme';

export const error = style({
	'@media': {
		'(prefers-color-scheme: light)': {
			color: themeContract.colorSchemes.light.error
		},
		'(prefers-color-scheme: dark)': {
			color: themeContract.colorSchemes.dark.error
		}
	}
});

export const main = style({
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'stretch',
	padding: 16,
	gap: '32px'
});

export const navHeader = style({
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

export const progress = style({
	'@media': {
		'(prefers-color-scheme: light)': {
			accentColor: themeContract.colorSchemes.light.primary
		},
		'(prefers-color-scheme: dark)': {
			accentColor: themeContract.colorSchemes.dark.primary
		}
	}
});

globalStyle('*,*:before,*:after', {
	boxSizing: 'border-box',
	transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
	transitionDuration: '0.25s'
});

globalStyle('body', {
	display: 'flex',
	flexFlow: 'column',
	height: '100svh',
	margin: 0,
	padding: 0
});

globalStyle('#base', {
	'@media': {
		'(prefers-color-scheme: light)': {
			backgroundColor: themeContract.colorSchemes.light.background,
			color: themeContract.colorSchemes.light.onBackground
		},
		'(prefers-color-scheme: dark)': {
			backgroundColor: themeContract.colorSchemes.dark.background,
			color: themeContract.colorSchemes.dark.onBackground
		}
	},
	fontFamily: themeContract.typography.body.family,
	fontWeight: themeContract.typography.body.weight,
	lineHeight: 1.5,
	flexGrow: 1
});

globalStyle('::selection', {
	'@media': {
		'(prefers-color-scheme: light)': {
			backgroundColor: themeContract.colorSchemes.light.tertiary,
			color: themeContract.colorSchemes.light.onTertiary
		},
		'(prefers-color-scheme: dark)': {
			backgroundColor: themeContract.colorSchemes.dark.tertiary,
			color: themeContract.colorSchemes.dark.onTertiary
		}
	}
});

globalStyle('blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre', {
	margin: 0
});

globalStyle('ul', {
	listStyleType: 'disc',
	listStylePosition: 'inside',
	padding: 0,
	margin: 0
});

globalStyle('form label', {
	display: 'block'
});

globalStyle('.material-symbols-outlined', {
	fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48"
});
