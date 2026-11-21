import type { User } from '@starsector-builds/shared/user/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import fetchSafe from '@/api/fetchSafe';
import { AuthContext } from '@/modules/auth/hooks/useAuth';

const AUTH_STALE_TIME = 1000 * 60 * 5; // 5 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const { data: user = null, isLoading } = useQuery<User | null>({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const data = await fetchSafe<User>('/api/validate', {
                    credentials: 'include',
                });
                return { username: data.username };
            } catch {
                return null;
            }
        },
        staleTime: AUTH_STALE_TIME,
        retry: false,
    });

    const signupMutation = useMutation({
        mutationFn: async ({
            username,
            password,
            email,
        }: {
            username: string;
            password: string;
            email: string;
        }) => {
            return fetchSafe<{ username: string }>(
                '/api/signup',
                {
                    method: 'POST',
                    body: JSON.stringify({ username, password, email }),
                    credentials: 'include',
                },
                'Signup failed',
            );
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['user'], { username: data.username });
        },
    });

    const loginMutation = useMutation({
        mutationFn: async ({
            identifier,
            password,
        }: {
            identifier: string;
            password: string;
        }) => {
            return fetchSafe<{ username: string }>(
                '/api/login',
                {
                    method: 'POST',
                    body: JSON.stringify({ identifier, password }),
                    credentials: 'include',
                },
                'Invalid credentials',
            );
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['user'], { username: data.username });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await fetchSafe<void>(
                '/api/logout',
                {
                    method: 'POST',
                    credentials: 'include',
                },
                'Logout failed',
            );
        },
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
            queryClient.clear();
        },
    });

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                signup: async (username, password, email) => {
                    await signupMutation.mutateAsync({
                        username,
                        password,
                        email,
                    });
                },
                login: async (identifier, password) => {
                    await loginMutation.mutateAsync({
                        identifier,
                        password,
                    });
                },
                logout: async () => {
                    await logoutMutation.mutateAsync();
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
