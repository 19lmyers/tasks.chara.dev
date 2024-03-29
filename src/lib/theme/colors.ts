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

import { ListColor, ThemeVariant } from '$lib/type';

import { dynamicColorTheme } from '$lib/theme/dynamic';

const base = '#6750A4';

const red = '#AC322C';
const orange = '#974800';
const yellow = '#7C5800';
const green = '#356A22';
const blue = '#00639D';
const purple = '#6750A4';
const pink = '#95416E';

export function themeFromVariant(variant: ThemeVariant = ThemeVariant.TONAL_SPOT) {
	return dynamicColorTheme(base, variant);
}

export function themeFromListColor(
	color: ListColor | undefined,
	variant: ThemeVariant = ThemeVariant.TONAL_SPOT
) {
	switch (color) {
		case ListColor.RED:
			return dynamicColorTheme(red, variant);
		case ListColor.ORANGE:
			return dynamicColorTheme(orange, variant);
		case ListColor.YELLOW:
			return dynamicColorTheme(yellow, variant);
		case ListColor.GREEN:
			return dynamicColorTheme(green, variant);
		case ListColor.BLUE:
			return dynamicColorTheme(blue, variant);
		case ListColor.PURPLE:
			return dynamicColorTheme(purple, variant);
		case ListColor.PINK:
			return dynamicColorTheme(pink, variant);
		default:
			return dynamicColorTheme(base, variant);
	}
}
