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

import { createTheme } from '@vanilla-extract/css';

import { themeContract } from './contract.css';
import { themeTokensFromHex } from './tokens';

const base = themeTokensFromHex('#6750A4');

const red = themeTokensFromHex('#AC322C');
const orange = themeTokensFromHex('#974800');
const yellow = themeTokensFromHex('#7C5800');
const green = themeTokensFromHex('#356A22');
const blue = themeTokensFromHex('#00639D');
const purple = themeTokensFromHex('#6750A4');
const pink = themeTokensFromHex('#95416E');

export const baseTheme = createTheme(themeContract, base);

export const redTheme = createTheme(themeContract, red);
export const orangeTheme = createTheme(themeContract, orange);
export const yellowTheme = createTheme(themeContract, yellow);
export const greenTheme = createTheme(themeContract, green);
export const blueTheme = createTheme(themeContract, blue);
export const purpleTheme = createTheme(themeContract, purple);
export const pinkTheme = createTheme(themeContract, pink);
