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

import {
	argbFromHex,
	DynamicScheme,
	Hct,
	hexFromArgb,
	MaterialDynamicColors,
	SchemeExpressive,
	SchemeMonochrome,
	SchemeNeutral,
	SchemeTonalSpot,
	SchemeVibrant
} from '@material/material-color-utilities';

import { ThemeVariant } from '$lib/type';

function schemeFromThemeVariant(
	seed: Hct,
	darkTheme: boolean,
	variant: ThemeVariant = ThemeVariant.TONAL_SPOT,
	contrastLevel = 0
) {
	switch (variant) {
		case ThemeVariant.MONOCHROME:
			return new SchemeMonochrome(seed, darkTheme, contrastLevel);
		case ThemeVariant.NEUTRAL:
			return new SchemeNeutral(seed, darkTheme, contrastLevel);
		case ThemeVariant.TONAL_SPOT:
			return new SchemeTonalSpot(seed, darkTheme, contrastLevel);
		case ThemeVariant.VIBRANT:
			return new SchemeVibrant(seed, darkTheme, contrastLevel);
		case ThemeVariant.EXPRESSIVE:
			return new SchemeExpressive(seed, darkTheme, contrastLevel);
		default:
			return new SchemeTonalSpot(seed, darkTheme, contrastLevel);
	}
}

export function themeTokensFromHex(hexColor: string, variant?: ThemeVariant) {
	const schemeLight = schemeFromThemeVariant(Hct.fromInt(argbFromHex(hexColor)), false, variant);
	const schemeDark = schemeFromThemeVariant(Hct.fromInt(argbFromHex(hexColor)), true, variant);

	return createThemeTokens(schemeLight, schemeDark);
}

function createThemeTokens(schemeLight: DynamicScheme, schemeDark: DynamicScheme) {
	return {
		colorSchemes: {
			light: {
				primary: hexFromArgb(MaterialDynamicColors.primary.getArgb(schemeLight)),
				onPrimary: hexFromArgb(MaterialDynamicColors.onPrimary.getArgb(schemeLight)),
				primaryContainer: hexFromArgb(MaterialDynamicColors.primaryContainer.getArgb(schemeLight)),
				onPrimaryContainer: hexFromArgb(
					MaterialDynamicColors.onPrimaryContainer.getArgb(schemeLight)
				),
				secondary: hexFromArgb(MaterialDynamicColors.secondary.getArgb(schemeLight)),
				onSecondary: hexFromArgb(MaterialDynamicColors.onSecondary.getArgb(schemeLight)),
				secondaryContainer: hexFromArgb(
					MaterialDynamicColors.secondaryContainer.getArgb(schemeLight)
				),
				onSecondaryContainer: hexFromArgb(
					MaterialDynamicColors.onSecondaryContainer.getArgb(schemeLight)
				),
				tertiary: hexFromArgb(MaterialDynamicColors.tertiary.getArgb(schemeLight)),
				onTertiary: hexFromArgb(MaterialDynamicColors.onTertiary.getArgb(schemeLight)),
				tertiaryContainer: hexFromArgb(
					MaterialDynamicColors.tertiaryContainer.getArgb(schemeLight)
				),
				onTertiaryContainer: hexFromArgb(
					MaterialDynamicColors.onTertiaryContainer.getArgb(schemeLight)
				),
				error: hexFromArgb(MaterialDynamicColors.error.getArgb(schemeLight)),
				onError: hexFromArgb(MaterialDynamicColors.onError.getArgb(schemeLight)),
				errorContainer: hexFromArgb(MaterialDynamicColors.errorContainer.getArgb(schemeLight)),
				onErrorContainer: hexFromArgb(MaterialDynamicColors.onErrorContainer.getArgb(schemeLight)),
				background: hexFromArgb(MaterialDynamicColors.background.getArgb(schemeLight)),
				onBackground: hexFromArgb(MaterialDynamicColors.onBackground.getArgb(schemeLight)),
				surface: hexFromArgb(MaterialDynamicColors.surface.getArgb(schemeLight)),
				onSurface: hexFromArgb(MaterialDynamicColors.onSurface.getArgb(schemeLight)),
				surfaceVariant: hexFromArgb(MaterialDynamicColors.surfaceVariant.getArgb(schemeLight)),
				onSurfaceVariant: hexFromArgb(MaterialDynamicColors.onSurfaceVariant.getArgb(schemeLight)),
				outline: hexFromArgb(MaterialDynamicColors.outline.getArgb(schemeLight)),
				outlineVariant: hexFromArgb(MaterialDynamicColors.outlineVariant.getArgb(schemeLight)),
				shadow: hexFromArgb(MaterialDynamicColors.shadow.getArgb(schemeLight)),
				scrim: hexFromArgb(MaterialDynamicColors.scrim.getArgb(schemeLight)),
				inverseSurface: hexFromArgb(MaterialDynamicColors.inverseSurface.getArgb(schemeLight)),
				inverseOnSurface: hexFromArgb(MaterialDynamicColors.inverseOnSurface.getArgb(schemeLight)),
				inversePrimary: hexFromArgb(MaterialDynamicColors.inversePrimary.getArgb(schemeLight)),
				surfaceBright: hexFromArgb(MaterialDynamicColors.surfaceBright.getArgb(schemeLight)),
				surfaceContainer: hexFromArgb(MaterialDynamicColors.surfaceContainer.getArgb(schemeLight)),
				surfaceContainerHigh: hexFromArgb(
					MaterialDynamicColors.surfaceContainerHigh.getArgb(schemeLight)
				),
				surfaceContainerHighest: hexFromArgb(
					MaterialDynamicColors.surfaceContainerHighest.getArgb(schemeLight)
				),
				surfaceContainerLow: hexFromArgb(
					MaterialDynamicColors.surfaceContainerLow.getArgb(schemeLight)
				),
				surfaceContainerLowest: hexFromArgb(
					MaterialDynamicColors.surfaceContainerLowest.getArgb(schemeLight)
				),
				surfaceDim: hexFromArgb(MaterialDynamicColors.surfaceDim.getArgb(schemeLight))
			},
			dark: {
				primary: hexFromArgb(MaterialDynamicColors.primary.getArgb(schemeDark)),
				onPrimary: hexFromArgb(MaterialDynamicColors.onPrimary.getArgb(schemeDark)),
				primaryContainer: hexFromArgb(MaterialDynamicColors.primaryContainer.getArgb(schemeDark)),
				onPrimaryContainer: hexFromArgb(
					MaterialDynamicColors.onPrimaryContainer.getArgb(schemeDark)
				),
				secondary: hexFromArgb(MaterialDynamicColors.secondary.getArgb(schemeDark)),
				onSecondary: hexFromArgb(MaterialDynamicColors.onSecondary.getArgb(schemeDark)),
				secondaryContainer: hexFromArgb(
					MaterialDynamicColors.secondaryContainer.getArgb(schemeDark)
				),
				onSecondaryContainer: hexFromArgb(
					MaterialDynamicColors.onSecondaryContainer.getArgb(schemeDark)
				),
				tertiary: hexFromArgb(MaterialDynamicColors.tertiary.getArgb(schemeDark)),
				onTertiary: hexFromArgb(MaterialDynamicColors.onTertiary.getArgb(schemeDark)),
				tertiaryContainer: hexFromArgb(MaterialDynamicColors.tertiaryContainer.getArgb(schemeDark)),
				onTertiaryContainer: hexFromArgb(
					MaterialDynamicColors.onTertiaryContainer.getArgb(schemeDark)
				),
				error: hexFromArgb(MaterialDynamicColors.error.getArgb(schemeDark)),
				onError: hexFromArgb(MaterialDynamicColors.onError.getArgb(schemeDark)),
				errorContainer: hexFromArgb(MaterialDynamicColors.errorContainer.getArgb(schemeDark)),
				onErrorContainer: hexFromArgb(MaterialDynamicColors.onErrorContainer.getArgb(schemeDark)),
				background: hexFromArgb(MaterialDynamicColors.background.getArgb(schemeDark)),
				onBackground: hexFromArgb(MaterialDynamicColors.onBackground.getArgb(schemeDark)),
				surface: hexFromArgb(MaterialDynamicColors.surface.getArgb(schemeDark)),
				onSurface: hexFromArgb(MaterialDynamicColors.onSurface.getArgb(schemeDark)),
				surfaceVariant: hexFromArgb(MaterialDynamicColors.surfaceVariant.getArgb(schemeDark)),
				onSurfaceVariant: hexFromArgb(MaterialDynamicColors.onSurfaceVariant.getArgb(schemeDark)),
				outline: hexFromArgb(MaterialDynamicColors.outline.getArgb(schemeDark)),
				outlineVariant: hexFromArgb(MaterialDynamicColors.outlineVariant.getArgb(schemeDark)),
				shadow: hexFromArgb(MaterialDynamicColors.shadow.getArgb(schemeDark)),
				scrim: hexFromArgb(MaterialDynamicColors.scrim.getArgb(schemeDark)),
				inverseSurface: hexFromArgb(MaterialDynamicColors.inverseSurface.getArgb(schemeDark)),
				inverseOnSurface: hexFromArgb(MaterialDynamicColors.inverseOnSurface.getArgb(schemeDark)),
				inversePrimary: hexFromArgb(MaterialDynamicColors.inversePrimary.getArgb(schemeDark)),
				surfaceBright: hexFromArgb(MaterialDynamicColors.surfaceBright.getArgb(schemeDark)),
				surfaceContainer: hexFromArgb(MaterialDynamicColors.surfaceContainer.getArgb(schemeDark)),
				surfaceContainerHigh: hexFromArgb(
					MaterialDynamicColors.surfaceContainerHigh.getArgb(schemeDark)
				),
				surfaceContainerHighest: hexFromArgb(
					MaterialDynamicColors.surfaceContainerHighest.getArgb(schemeDark)
				),
				surfaceContainerLow: hexFromArgb(
					MaterialDynamicColors.surfaceContainerLow.getArgb(schemeDark)
				),
				surfaceContainerLowest: hexFromArgb(
					MaterialDynamicColors.surfaceContainerLowest.getArgb(schemeDark)
				),
				surfaceDim: hexFromArgb(MaterialDynamicColors.surfaceDim.getArgb(schemeDark))
			}
		},
		shapes: {
			// TODO implement shape theming?
		},
		typography: {
			heading: { family: 'Lato, sans-serif', weight: '600' },
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
