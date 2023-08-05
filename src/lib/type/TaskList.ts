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

export interface TaskList {
	id: string;

	title: string;

	color?: ListColor;
	icon?: ListIcon;
	description?: string;

	showIndexNumbers: boolean;

	sortType: SortType;
	sortDirection: SortDirection;

	dateCreated: Date;
	lastModified: Date;
}

export enum ListColor {
	RED = 'RED',
	ORANGE = 'ORANGE',
	YELLOW = 'YELLOW',
	GREEN = 'GREEN',
	BLUE = 'BLUE',
	PURPLE = 'PURPLE',
	PINK = 'PINK'
}

export enum ListIcon {
	BACKPACK = 'BACKPACK',
	BOOK = 'BOOK',
	BOOKMARK = 'BOOKMARK',
	BRUSH = 'BRUSH',
	CAKE = 'CAKE',
	CALL = 'CALL',
	CAR = 'CAR',
	CELEBRATION = 'CELEBRATION',
	CLIPBOARD = 'CLIPBOARD',
	FLIGHT = 'FLIGHT',
	FOOD_BEVERAGE = 'FOOD_BEVERAGE',
	FOOTBALL = 'FOOTBALL',
	FOREST = 'FOREST',
	GROUP = 'GROUP',
	HANDYMAN = 'HANDYMAN',
	HOME_REPAIR_SERVICE = 'HOME_REPAIR_SERVICE',
	LIGHT_BULB = 'LIGHT_BULB',
	MEDICAL_SERVICES = 'MEDICAL_SERVICES',
	MUSIC_NOTE = 'MUSIC_NOTE',
	PERSON = 'PERSON',
	PETS = 'PETS',
	PIANO = 'PIANO',
	RESTAURANT = 'RESTAURANT',
	SCISSORS = 'SCISSORS',
	SHOPPING_CART = 'SHOPPING_CART',
	SMILE = 'SMILE',
	WORK = 'WORK'
}

export enum SortType {
	ORDINAL = 'ORDINAL',
	LABEL = 'LABEL',
	DATE_CREATED = 'DATE_CREATED',
	UPCOMING = 'UPCOMING',
	STARRED = 'STARRED'
}

export enum SortDirection {
	ASCENDING = 'ASCENDING',
	DESCENDING = 'DESCENDING'
}
