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
	baseURL: endpointUrl
});

const refreshClient = axios.create({
	baseURL: endpointUrl
});

export const api = () => ({
	getUserProfile: async () => {
		const response = await apiClient.get('/profile');
		return (await response.data) as Profile;
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
	getLists: async () => {
		const response = await apiClient.get('/lists');
		return (await response.data) as TaskList[];
	},
	getTasks: async (listId: string) => {
		const response = await apiClient.get(`/lists/${listId}/tasks`);
		return (await response.data) as Task[];
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
