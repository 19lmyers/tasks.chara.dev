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

export const button = style({
	appearance: 'none',
	alignItems: 'center',
	alignContent: 'space-between',
	backgroundColor: 'inherit',
	border: 'none',
	borderRadius: '20px',
	cursor: 'pointer',
	display: 'flex',
	fontFamily: themeContract.typography.heading.family,
	fontWeight: themeContract.typography.heading.weight,
	fontSize: '.875rem',
	gap: '0.5rem',
	height: '40px',
	lineHeight: '1',
	margin: '0.25rem',
	padding: '0.5rem 1rem',
	position: 'relative',
	textDecoration: 'inherit',
	width: 'fit-content',
	zIndex: 1,
	':disabled': {
		opacity: '38%',
		cursor: 'not-allowed'
	},
	':hover': {
		boxShadow: 'none',
		textDecoration: 'none'
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
		'&:hover:not(:disabled)': {
			borderRadius: '0.75rem'
		},
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

export const elevated = style([
	button,
	{
		'@media': {
			'(prefers-color-scheme: light)': {
				backgroundColor: themeContract.colorSchemes.light.surface,
				color: themeContract.colorSchemes.light.primary,
				':hover': {
					color: themeContract.colorSchemes.light.primary
				},
				'::before': {
					backgroundColor: themeContract.colorSchemes.light.primary
				}
			},
			'(prefers-color-scheme: dark)': {
				backgroundColor: themeContract.colorSchemes.dark.surface,
				color: themeContract.colorSchemes.dark.primary,
				':hover': {
					color: themeContract.colorSchemes.dark.primary
				},
				'::before': {
					backgroundColor: themeContract.colorSchemes.dark.primary
				}
			}
		},
		boxShadow: themeContract.elevation.level1,
		':disabled': {
			boxShadow: themeContract.elevation.level0
		},
		selectors: {
			'&:hover:not(:disabled)': {
				boxShadow: themeContract.elevation.level2
			},
			'&:focus:not(:disabled)': {
				boxShadow: themeContract.elevation.level1
			},
			'&:active:not(:disabled)': {
				boxShadow: themeContract.elevation.level1
			}
		}
	}
]);

export const filled = style([
	button,
	{
		'@media': {
			'(prefers-color-scheme: light)': {
				backgroundColor: themeContract.colorSchemes.light.primary,
				color: themeContract.colorSchemes.light.onPrimary,
				':hover': {
					color: themeContract.colorSchemes.light.onPrimary
				},
				'::before': {
					backgroundColor: themeContract.colorSchemes.light.onPrimary
				}
			},
			'(prefers-color-scheme: dark)': {
				backgroundColor: themeContract.colorSchemes.dark.primary,
				color: themeContract.colorSchemes.dark.onPrimary,
				':hover': {
					color: themeContract.colorSchemes.dark.onPrimary
				},
				'::before': {
					backgroundColor: themeContract.colorSchemes.dark.onPrimary
				}
			}
		}
	}
]);

export const tonal = style([
	button,
	{
		'@media': {
			'(prefers-color-scheme: light)': {
				backgroundColor: themeContract.colorSchemes.light.secondaryContainer,
				color: themeContract.colorSchemes.light.onSecondaryContainer,
				':hover': {
					color: themeContract.colorSchemes.light.onSecondaryContainer
				},
				'::before': {
					backgroundColor: themeContract.colorSchemes.light.onSecondaryContainer
				}
			},
			'(prefers-color-scheme: dark)': {
				backgroundColor: themeContract.colorSchemes.dark.secondaryContainer,
				color: themeContract.colorSchemes.dark.onSecondaryContainer,
				':hover': {
					color: themeContract.colorSchemes.dark.onSecondaryContainer
				},
				'::before': {
					backgroundColor: themeContract.colorSchemes.dark.onSecondaryContainer
				}
			}
		}
	}
]);

export const outlined = style([
	button,
	{
		'@media': {
			'(prefers-color-scheme: light)': {
				color: themeContract.colorSchemes.light.primary,
				outlineColor: themeContract.colorSchemes.light.outline,
				':hover': {
					color: themeContract.colorSchemes.light.primary
				},
				'::before': {
					backgroundColor: themeContract.colorSchemes.light.primary
				}
			},
			'(prefers-color-scheme: dark)': {
				color: themeContract.colorSchemes.dark.primary,
				outlineColor: themeContract.colorSchemes.dark.outline,
				':hover': {
					color: themeContract.colorSchemes.light.primary
				},
				'::before': {
					backgroundColor: themeContract.colorSchemes.light.primary
				}
			}
		},
		outlineStyle: 'solid',
		outlineWidth: '0.0625rem'
	}
]);

export const text = style([
	button,
	{
		'@media': {
			'(prefers-color-scheme: light)': {
				color: themeContract.colorSchemes.light.primary,
				':hover': {
					color: themeContract.colorSchemes.light.secondary
				},
				'::before': {
					backgroundColor: themeContract.colorSchemes.light.primary
				}
			},
			'(prefers-color-scheme: dark)': {
				color: themeContract.colorSchemes.dark.primary,
				':hover': {
					color: themeContract.colorSchemes.dark.secondary
				},
				'::before': {
					backgroundColor: themeContract.colorSchemes.light.primary
				}
			}
		}
	}
]);

export const icon = style([
	button,
	{
		padding: '0.5rem',
		'@media': {
			'(prefers-color-scheme: light)': {
				color: themeContract.colorSchemes.light.primary,
				':hover': {
					color: themeContract.colorSchemes.light.secondary
				},
				'::before': {
					backgroundColor: themeContract.colorSchemes.light.primary
				}
			},
			'(prefers-color-scheme: dark)': {
				color: themeContract.colorSchemes.dark.primary,
				':hover': {
					color: themeContract.colorSchemes.dark.secondary
				},
				'::before': {
					backgroundColor: themeContract.colorSchemes.light.primary
				}
			}
		}
	}
]);
