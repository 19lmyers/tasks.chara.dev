import type { Writable } from 'svelte/store';
import { persisted } from 'svelte-local-storage-store';

import type { Profile, TokenPair } from '$lib/type';
import { derived } from 'svelte/store';
import { ThemeVariant } from '$lib/type';

export const auth: Writable<TokenPair | null> = persisted('auth', null);
export const profile: Writable<Profile | null> = persisted('profile', null);

export const isAuthenticated = derived(profile, (profile) => profile != null);

export const mobileBannerDismissed = persisted('mobileBannerDismissed', false);

export const themeVariant = persisted('themeVariant', ThemeVariant.TONAL_SPOT);
