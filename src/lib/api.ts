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
import axios, { HttpStatusCode } from 'axios';

import type { Profile, Task, TaskList, TokenPair } from '$lib/type';
import { auth, profile } from '$lib/stores';

const endpointUrl = 'https://tasks-api.chara.dev';

const apiClient = axios.create({
	baseURL: endpointUrl,
	timeout: 5000
});

const refreshClient = axios.create({
	baseURL: endpointUrl,
	timeout: 5000
});

export const api = () => ({
	getUserProfile: async () => {
		const response = await apiClient.get('/profile');
		return (await response.data) as Profile;
	},
	updateUserProfile: async (profile: Profile) => {
		const response = await apiClient.put('/profile', profile);
		return response.status == HttpStatusCode.Ok;
	},
	uploadProfilePhoto: async (file: File) => {
		const data = new FormData();
		data.append('file', file);

		const response = await apiClient.post('/profile/photo', data, {
			headers: {
				'content-type': 'multipart/form-data'
			}
		});
		return response.status == HttpStatusCode.Ok;
	},

	createUser: async (email: string, displayName: string, password: string) => {
		const response = await apiClient.post('/auth/register', {
			email: email,
			displayName: displayName,
			password: password
		});
		return response.status == HttpStatusCode.Created;
	},
	authenticateUser: async (email: string, password: string) => {
		const response = await apiClient.post('/auth/login', {
			email: email,
			password: password
		});
		return (await response.data) as TokenPair;
	},
	refreshAuth: async (refreshToken: string) => {
		const response = await refreshClient.post('/auth/refresh', refreshToken);
		return (await response.data) as TokenPair;
	},
	changePassword: async (currentPassword: string, newPassword: string) => {
		const response = await apiClient.post('/auth/password', {
			currentPassword: currentPassword,
			newPassword: newPassword
		});
		return response.status === HttpStatusCode.Ok;
	},
	requestPasswordResetEmail: async (email: string) => {
		const response = await apiClient.post('/auth/forgot', email);
		return response.status === HttpStatusCode.Accepted;
	},
	resetPassword: async (resetToken: string, newPassword: string) => {
		const response = await apiClient.post('/auth/reset', {
			resetToken: resetToken,
			newPassword: newPassword
		});
		return response.status === HttpStatusCode.Ok;
	},

	getLists: async () => {
		const response = await apiClient.get('/lists');
		return (await response.data) as TaskList[];
	},
	getList: async (listId: string) => {
		const response = await apiClient.get(`/lists/${listId}`);
		return (await response.data) as TaskList;
	},
	createList: async (taskList: TaskList) => {
		const response = await apiClient.post(`/lists`, taskList);
		return response.status == HttpStatusCode.Created;
	},
	updateList: async (taskList: TaskList) => {
		const response = await apiClient.put(`/lists/${taskList.id}`, taskList);
		return response.status == HttpStatusCode.Ok;
	},
	deleteList: async (listId: string) => {
		const response = await apiClient.delete(`/lists/${listId}`);
		return response.status == HttpStatusCode.Accepted;
	},

	getTasks: async (listId: string) => {
		const response = await apiClient.get(`/lists/${listId}/tasks`);
		return (await response.data) as Task[];
	},
	createTask: async (task: Task) => {
		const response = await apiClient.post(`/lists/${task.listId}/tasks`, task);
		return response.status == HttpStatusCode.Created;
	},
	updateTask: async (task: Task) => {
		const response = await apiClient.put(`/lists/${task.listId}/tasks/${task.id}`, task);
		return response.status == HttpStatusCode.Ok;
	},
	moveTask: async (oldListId: string, newListId: string, taskId: string, lastModified: Date) => {
		const response = await apiClient.post(`/lists/${oldListId}/tasks/${taskId}/move`, {
			newListId: newListId,
			lastModified: lastModified
		});
		return response.status == HttpStatusCode.Ok;
	},
	clearCompletedTasks: async (listId: string) => {
		const response = await apiClient.post(`/lists/${listId}/tasks/clear`);
		return response.status == HttpStatusCode.Ok;
	}
});

apiClient.interceptors.request.use((config) => {
	const accessToken = get(auth)?.access;
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const request = error.config;
		if (error.response && error.response.status == 401 && !request._retry) {
			const refreshToken = get(auth)?.refresh;

			if (refreshToken) {
				const tokens = await api().refreshAuth(refreshToken);
				auth.set(tokens);

				request._retry = true;
				return axios(request);
			} else {
				auth.set(null);
				profile.set(null);

				return Promise.reject(error);
			}
		}
		return Promise.reject(error);
	}
);
