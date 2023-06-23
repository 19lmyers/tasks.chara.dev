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

import { isAxiosError } from 'axios';

import { api } from '$lib/api';
import { auth, profile } from '$lib/stores';
import { goto } from '$app/navigation';

export class AuthManager {
	email: string | null = null;
	displayName: string | null = null;
	password: string | null = null;

	isPending = false;

	errorMessage: string | null = null;

	async login() {
		if (this.email && this.password) {
			this.errorMessage = null;
			this.isPending = true;

			try {
				const tokens = await api().authenticateUser(this.email, this.password);
				auth.set(tokens);

				if (tokens) {
					const userProfile = await api().getUserProfile();
					profile.set(userProfile);
					this.isPending = false;
					await goto('/');
				}
			} catch (error) {
				if (isAxiosError(error) && error.response) {
					this.errorMessage = error.response.data;
				} else if (error instanceof Error) {
					this.errorMessage = error.message;
				}

				this.password = '';

				this.isPending = false;
			}
		}
	}

	async signup() {
		if (this.email && this.displayName && this.password) {
			this.errorMessage = null;
			this.isPending = true;

			try {
				const result = await api().createUser(this.email, this.displayName, this.password);
				if (result) {
					await this.login();
				}
			} catch (error) {
				if (isAxiosError(error) && error.response) {
					this.errorMessage = error.response.data;
				} else if (error instanceof Error) {
					this.errorMessage = error.message;
				}

				this.password = '';

				this.isPending = false;
			}
		}
	}
}
