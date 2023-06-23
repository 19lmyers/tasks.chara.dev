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

import { ListColor } from '$lib/type';

import {
	baseTheme,
	blueTheme,
	greenTheme,
	orangeTheme,
	pinkTheme,
	purpleTheme,
	redTheme,
	yellowTheme
} from './base.css';

export function themeFromListColor(color?: ListColor) {
	switch (color) {
		case ListColor.RED:
			return redTheme;
		case ListColor.ORANGE:
			return orangeTheme;
		case ListColor.YELLOW:
			return yellowTheme;
		case ListColor.GREEN:
			return greenTheme;
		case ListColor.BLUE:
			return blueTheme;
		case ListColor.PURPLE:
			return purpleTheme;
		case ListColor.PINK:
			return pinkTheme;
		default:
			return baseTheme;
	}
}
