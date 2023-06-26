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

import { ListIcon, SortDirection, SortType } from '$lib/type';

export function iconFromListIcon(icon?: ListIcon) {
	switch (icon) {
		case ListIcon.BACKPACK:
			return 'backpack';
		case ListIcon.BOOK:
			return 'book';
		case ListIcon.BOOKMARK:
			return 'bookmark';
		case ListIcon.BRUSH:
			return 'brush';
		case ListIcon.CAKE:
			return 'cake';
		case ListIcon.CALL:
			return 'call';
		case ListIcon.CAR:
			return 'directions_car';
		case ListIcon.CELEBRATION:
			return 'celebration';
		case ListIcon.CLIPBOARD:
			return 'content_paste';
		case ListIcon.FLIGHT:
			return 'flight_takeoff';
		case ListIcon.FOOD_BEVERAGE:
			return 'emoji_food_beverage';
		case ListIcon.FOOTBALL:
			return 'sports_football';
		case ListIcon.FOREST:
			return 'forest';
		case ListIcon.GROUP:
			return 'group';
		case ListIcon.HANDYMAN:
			return 'handyman';
		case ListIcon.HOME_REPAIR_SERVICE:
			return 'home_repair_service';
		case ListIcon.LIGHT_BULB:
			return 'lightbulb';
		case ListIcon.MEDICAL_SERVICES:
			return 'medical_services';
		case ListIcon.MUSIC_NOTE:
			return 'music_note';
		case ListIcon.PERSON:
			return 'person';
		case ListIcon.PETS:
			return 'pets';
		case ListIcon.PIANO:
			return 'piano';
		case ListIcon.RESTAURANT:
			return 'restaurant';
		case ListIcon.SCISSORS:
			return 'content_cut';
		case ListIcon.SHOPPING_CART:
			return 'shopping_cart';
		case ListIcon.SMILE:
			return 'mood';
		case ListIcon.WORK:
			return 'work';
		default:
			return 'checklist';
	}
}

export function iconFromSortType(type: SortType) {
	switch (type) {
		case SortType.LABEL:
			return 'sort_by_alpha';
		case SortType.DATE_CREATED:
			return 'event';
		case SortType.UPCOMING:
			return 'schedule';
		case SortType.STARRED:
			return 'star';
		default:
			return 'sort';
	}
}

export function iconFromSortDirection(direction: SortDirection) {
	if (direction === SortDirection.DESCENDING) {
		return 'arrow_downward';
	} else {
		return 'arrow_upward';
	}
}
