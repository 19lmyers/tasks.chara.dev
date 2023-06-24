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

import { createThemeContract } from '@vanilla-extract/css';

const tokens = {
	colorSchemes: {
		light: {
			primary: '',
			onPrimary: '',
			primaryContainer: '',
			onPrimaryContainer: '',
			secondary: '',
			onSecondary: '',
			secondaryContainer: '',
			onSecondaryContainer: '',
			tertiary: '',
			onTertiary: '',
			tertiaryContainer: '',
			onTertiaryContainer: '',
			error: '',
			onError: '',
			errorContainer: '',
			onErrorContainer: '',
			background: '',
			onBackground: '',
			surface: '',
			onSurface: '',
			surfaceVariant: '',
			onSurfaceVariant: '',
			outline: '',
			outlineVariant: '',
			shadow: '',
			scrim: '',
			inverseSurface: '',
			inverseOnSurface: '',
			inversePrimary: ''
		},
		dark: {
			primary: '',
			onPrimary: '',
			primaryContainer: '',
			onPrimaryContainer: '',
			secondary: '',
			onSecondary: '',
			secondaryContainer: '',
			onSecondaryContainer: '',
			tertiary: '',
			onTertiary: '',
			tertiaryContainer: '',
			onTertiaryContainer: '',
			error: '',
			onError: '',
			errorContainer: '',
			onErrorContainer: '',
			background: '',
			onBackground: '',
			surface: '',
			onSurface: '',
			surfaceVariant: '',
			onSurfaceVariant: '',
			outline: '',
			outlineVariant: '',
			shadow: '',
			scrim: '',
			inverseSurface: '',
			inverseOnSurface: '',
			inversePrimary: ''
		}
	},
	shapes: {
		// TODO implement shape theming?
	},
	typography: {
		heading: { family: '', weight: '' },
		body: { family: '', weight: '' }
	},
	elevation: {
		level0: '',
		level1: '',
		level2: '',
		level3: '',
		level4: '',
		level5: ''
	}
};

export const themeContract = createThemeContract(tokens);
