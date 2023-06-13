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

import type { Theme } from '@importantimport/material-color-utilities';
import {
	argbFromHex,
	argbFromRgb,
	hexFromArgb,
	QuantizerCelebi,
	Score,
	themeFromSourceColor
} from '@importantimport/material-color-utilities';

// Modified from material-color-utilities
async function sourceColorFromImage(imageData: ArrayBuffer) {
	const rgba = new Uint8ClampedArray(imageData);
	const pixels = [];

	for (let i = 0; i < rgba.length; i += 4) {
		const r = rgba[i];
		const g = rgba[i + 1];
		const b = rgba[i + 2];
		const a = rgba[i + 3];
		if (a < 255) {
			continue;
		}
		const argb = argbFromRgb(r, g, b);
		pixels.push(argb);
	}

	const result = QuantizerCelebi.quantize(pixels, 128);
	const ranked = Score.score(result);
	return ranked[0]; // top
}

export async function themeTokensFromImage(imageData: ArrayBuffer) {
	const sourceColor = await sourceColorFromImage(imageData);
	const theme = themeFromSourceColor(sourceColor);
	return createThemeTokens(theme);
}

export function themeTokensFromHex(hexColor: string) {
	const theme = themeFromSourceColor(argbFromHex(hexColor));
	return createThemeTokens(theme);
}

function createThemeTokens(theme: Theme) {
	return {
		colorSchemes: {
			light: {
				primary: hexFromArgb(theme.schemes.light.primary),
				onPrimary: hexFromArgb(theme.schemes.light.onPrimary),
				primaryContainer: hexFromArgb(theme.schemes.light.primaryContainer),
				onPrimaryContainer: hexFromArgb(theme.schemes.light.onPrimaryContainer),
				secondary: hexFromArgb(theme.schemes.light.secondary),
				onSecondary: hexFromArgb(theme.schemes.light.onSecondary),
				secondaryContainer: hexFromArgb(theme.schemes.light.secondaryContainer),
				onSecondaryContainer: hexFromArgb(theme.schemes.light.onSecondaryContainer),
				tertiary: hexFromArgb(theme.schemes.light.tertiary),
				onTertiary: hexFromArgb(theme.schemes.light.onTertiary),
				tertiaryContainer: hexFromArgb(theme.schemes.light.tertiaryContainer),
				onTertiaryContainer: hexFromArgb(theme.schemes.light.onTertiaryContainer),
				error: hexFromArgb(theme.schemes.light.error),
				onError: hexFromArgb(theme.schemes.light.onError),
				errorContainer: hexFromArgb(theme.schemes.light.errorContainer),
				onErrorContainer: hexFromArgb(theme.schemes.light.onErrorContainer),
				background: hexFromArgb(theme.schemes.light.background),
				onBackground: hexFromArgb(theme.schemes.light.onBackground),
				surface: hexFromArgb(theme.schemes.light.surface),
				onSurface: hexFromArgb(theme.schemes.light.onSurface),
				surfaceVariant: hexFromArgb(theme.schemes.light.surfaceVariant),
				onSurfaceVariant: hexFromArgb(theme.schemes.light.onSurfaceVariant),
				outline: hexFromArgb(theme.schemes.light.outline),
				outlineVariant: hexFromArgb(theme.schemes.light.outlineVariant),
				shadow: hexFromArgb(theme.schemes.light.shadow),
				scrim: hexFromArgb(theme.schemes.light.scrim),
				inverseSurface: hexFromArgb(theme.schemes.light.inverseSurface),
				inverseOnSurface: hexFromArgb(theme.schemes.light.inverseOnSurface),
				inversePrimary: hexFromArgb(theme.schemes.light.inversePrimary)
			},
			dark: {
				primary: hexFromArgb(theme.schemes.dark.primary),
				onPrimary: hexFromArgb(theme.schemes.dark.onPrimary),
				primaryContainer: hexFromArgb(theme.schemes.dark.primaryContainer),
				onPrimaryContainer: hexFromArgb(theme.schemes.dark.onPrimaryContainer),
				secondary: hexFromArgb(theme.schemes.dark.secondary),
				onSecondary: hexFromArgb(theme.schemes.dark.onSecondary),
				secondaryContainer: hexFromArgb(theme.schemes.dark.secondaryContainer),
				onSecondaryContainer: hexFromArgb(theme.schemes.dark.onSecondaryContainer),
				tertiary: hexFromArgb(theme.schemes.dark.tertiary),
				onTertiary: hexFromArgb(theme.schemes.dark.onTertiary),
				tertiaryContainer: hexFromArgb(theme.schemes.dark.tertiaryContainer),
				onTertiaryContainer: hexFromArgb(theme.schemes.dark.onTertiaryContainer),
				error: hexFromArgb(theme.schemes.dark.error),
				onError: hexFromArgb(theme.schemes.dark.onError),
				errorContainer: hexFromArgb(theme.schemes.dark.errorContainer),
				onErrorContainer: hexFromArgb(theme.schemes.dark.onErrorContainer),
				background: hexFromArgb(theme.schemes.dark.background),
				onBackground: hexFromArgb(theme.schemes.dark.onBackground),
				surface: hexFromArgb(theme.schemes.dark.surface),
				onSurface: hexFromArgb(theme.schemes.dark.onSurface),
				surfaceVariant: hexFromArgb(theme.schemes.dark.surfaceVariant),
				onSurfaceVariant: hexFromArgb(theme.schemes.dark.onSurfaceVariant),
				outline: hexFromArgb(theme.schemes.dark.outline),
				outlineVariant: hexFromArgb(theme.schemes.dark.outlineVariant),
				shadow: hexFromArgb(theme.schemes.dark.shadow),
				scrim: hexFromArgb(theme.schemes.dark.scrim),
				inverseSurface: hexFromArgb(theme.schemes.dark.inverseSurface),
				inverseOnSurface: hexFromArgb(theme.schemes.dark.inverseOnSurface),
				inversePrimary: hexFromArgb(theme.schemes.dark.inversePrimary)
			}
		},
		shapes: {
			// TODO implement shape theming?
		},
		typography: {
			heading: { family: "'Source Code Pro', monospace", weight: '700', letterSpacing: '-0.025em' },
			body: { family: 'Lato, sans-serif', weight: '400' }
		},
		elevation: {
			level0: 'none',
			level1: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)',
			level2: '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)',
			level3: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)',
			level4: '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)',
			level5: '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)'
		}
	};
}
