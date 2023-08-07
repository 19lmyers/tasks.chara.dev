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

import { SortDirection, SortType } from '$lib/type';
import type { Task } from '$lib/type';

export function sortTasks(tasks: Task[], type: SortType, direction: SortDirection): Task[] {
	switch (String(type)) {
		case SortType.LABEL:
			tasks.sort((a: Task, b: Task) => (a.label < b.label ? -1 : 1));
			break;
		case SortType.DATE_CREATED:
			tasks.sort((a: Task, b: Task) => (a.dateCreated < b.dateCreated ? -1 : 1));
			break;
		case SortType.UPCOMING:
			tasks.sort((a: Task, b: Task) => {
				const distantFuture = '9999-12-31 23:59:59';

				const dateA = new Date(a.reminderDate || a.dueDate || distantFuture);
				const dateB = new Date(b.reminderDate || b.dueDate || distantFuture);

				if (+dateA !== +dateB) {
					return dateA < dateB ? -1 : 1;
				} else {
					return a.lastModified < b.lastModified ? -1 : 1;
				}
			});
			break;
		case SortType.STARRED:
			tasks.sort((a: Task, b: Task) => {
				if (a.isStarred !== b.isStarred) {
					return a.isStarred ? -1 : 1;
				} else {
					return a.lastModified < b.lastModified ? -1 : 1;
				}
			});
			break;
		default:
			tasks.sort((a: Task, b: Task) => (a.ordinal < b.ordinal ? -1 : 1));
			break;
	}

	if (type != SortType.ORDINAL && direction == SortDirection.DESCENDING) {
		tasks.reverse();
	}
	return tasks;
}
