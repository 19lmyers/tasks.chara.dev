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

import { get } from 'svelte/store';
import ky from 'ky';

import type { Profile, Task, TaskList, TokenPair } from '$lib/type';
import { auth, profile } from '$lib/stores';
import type { TaskListPrefs } from '$lib/type/TaskListPrefs';

const endpointUrl = 'https://dominaria.chara.dev:8804';
//const endpointUrl = 'http://localhost:8123';

const apiClient = ky.create({
	prefixUrl: endpointUrl,
	timeout: 5000,
	hooks: {
		beforeRequest: [
			(options) => {
				const accessToken = get(auth)?.access;
				if (accessToken) {
					options.headers.set('Authorization', `Bearer ${accessToken}`);
				}
			}
		],
		afterResponse: [
			async (input, options, response) => {
				if (response.status == 401) {
					const refreshToken = get(auth)?.refresh;

					if (refreshToken) {
						const tokens = await api().refreshAuth(refreshToken);
						auth.set(tokens);

						return ky(input, options);
					} else {
						auth.set(null);
						profile.set(null);

						const body = await response.json();

						throw new Error(body.error.message);
					}
				}
			}
		]
	}
});

const refreshClient = ky.create({
	prefixUrl: endpointUrl,
	timeout: 5000
});

export const api = () => ({
	getUserProfile: async () => {
		const response = await apiClient.get('profile');
		return (await response.json()) as Profile;
	},
	getUserProfileFor: async (userId: string) => {
		const response = await apiClient.get(`profile/${userId}`);
		return (await response.json()) as Profile;
	},
	updateUserProfile: async (profile: Profile) => {
		const response = await apiClient.put('profile', { json: profile });
		return response.status == 200; // OK
	},
	uploadProfilePhoto: async (file: File) => {
		const data = new FormData();
		data.append('file', file);

		const response = await apiClient.post('profile/photo', { body: data });
		return response.status == 200; // OK
	},

	createUser: async (email: string, displayName: string, password: string) => {
		const response = await apiClient.post('auth/register', {
			json: {
				email: email,
				displayName: displayName,
				password: password
			}
		});
		return response.status == 201; // Created
	},
	authenticateUser: async (email: string, password: string) => {
		const response = await apiClient.post('auth/login', {
			json: {
				email: email,
				password: password
			}
		});
		return (await response.json()) as TokenPair;
	},
	refreshAuth: async (refreshToken: string) => {
		const response = await refreshClient.post('auth/refresh', { body: refreshToken });
		return (await response.json()) as TokenPair;
	},
	changeEmail: async (newEmail: string) => {
		const response = await apiClient.post('auth/email', { body: newEmail });
		return response.status == 200; // OK
	},
	requestVerifyEmailResend: async () => {
		const response = await apiClient.post('auth/email/resend');
		return response.status == 200; // OK
	},
	changePassword: async (currentPassword: string, newPassword: string) => {
		const response = await apiClient.post('auth/password', {
			json: {
				currentPassword: currentPassword,
				newPassword: newPassword
			}
		});
		return response.status === 200; // OK
	},
	requestPasswordResetEmail: async (email: string) => {
		const response = await apiClient.post('auth/forgot', { body: email });
		return response.status === 202; // Accepted
	},
	verifyEmail: async (verifyToken: string, email: string) => {
		const response = await apiClient.post('auth/verify', {
			json: {
				verifyToken: verifyToken,
				email: email
			}
		});
		return response.status === 200; // OK
	},
	resetPassword: async (resetToken: string, newPassword: string) => {
		const response = await apiClient.post('auth/reset', {
			json: {
				resetToken: resetToken,
				newPassword: newPassword
			}
		});
		return response.status === 200; // OK
	},

	getLists: async () => {
		const response = await apiClient.get('lists');
		return (await response.json()) as TaskList[];
	},
	getList: async (listId: string) => {
		const response = await apiClient.get(`lists/${listId}`);
		return (await response.json()) as TaskList;
	},
	createList: async (taskList: TaskList, prefs: TaskListPrefs) => {
		const response = await apiClient.post(`lists`, {
			json: {
				taskList: taskList,
				prefs: prefs
			}
		});
		return response.status == 201; // Created;
	},
	updateList: async (taskList: TaskList) => {
		const response = await apiClient.put(`lists/${taskList.id}`, { json: taskList });
		return response.status == 200; // OK
	},
	// reorder?
	deleteList: async (listId: string) => {
		const response = await apiClient.delete(`lists/${listId}`);
		return response.status == 202; // Accepted
	},

	getListPrefs: async (listId: string) => {
		const response = await apiClient.get(`lists/${listId}/prefs`);
		return (await response.json()) as TaskListPrefs;
	},
	updateListPrefs: async (prefs: TaskListPrefs) => {
		const response = await apiClient.put(`lists/${prefs.listId}/prefs`, { json: prefs });
		return response.status == 200; // OK
	},
	getListMembers: async (listId: string) => {
		const response = await apiClient.get(`lists/${listId}/members`);
		return (await response.json()) as Profile[];
	},
	requestListInvite: async (listId: string) => {
		const response = await apiClient.post(`lists/${listId}/invite`);
		return await response.text();
	},
	getListInviteInfo: async (inviteToken: string) => {
		const response = await apiClient.post(`lists/invite`, { body: inviteToken });
		return (await response.json()) as TaskList;
	},
	requestListJoin: async (inviteToken: string) => {
		const response = await apiClient.post(`lists/join`, { body: inviteToken });
		return response.status == 200; // OK
	},
	leaveList: async (listId: string) => {
		const response = await apiClient.post(`lists/${listId}/leave`);
		return response.status == 200; // OK
	},
	removeMemberFromList: async (listId: string, memberId: string) => {
		const response = await apiClient.post(`lists/${listId}/remove`, { body: memberId });
		return response.status == 200; // OK
	},

	getTasks: async (listId: string) => {
		const response = await apiClient.get(`lists/${listId}/tasks`);
		return (await response.json()) as Task[];
	},
	createTask: async (task: Task) => {
		const response = await apiClient.post(`lists/${task.listId}/tasks`, { json: task });
		return response.status == 201; // Created
	},
	updateTask: async (task: Task) => {
		const response = await apiClient.put(`lists/${task.listId}/tasks/${task.id}`, { json: task });
		return response.status == 200; // OK
	},
	deleteTask: async (listId: string, taskId: string) => {
		const response = await apiClient.delete(`lists/${listId}/tasks/${taskId}`);
		return response.status == 202; // Accepted
	},
	moveTask: async (oldListId: string, newListId: string, taskId: string, lastModified: Date) => {
		const response = await apiClient.post(`lists/${oldListId}/tasks/${taskId}/move`, {
			json: {
				newListId: newListId,
				lastModified: lastModified
			}
		});
		return response.status == 200; // OK
	},
	// reorder?
	clearCompletedTasks: async (listId: string) => {
		const response = await apiClient.post(`lists/${listId}/tasks/clear`);
		return response.status == 200; // OK
	}
});
