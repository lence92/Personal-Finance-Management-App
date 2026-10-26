import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AuthUser, RegisterRequest } from './auth.models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { AuthApi } from './auth.api';
import { Session, User } from '@supabase/supabase-js';

type AuthState = {
  session: Session | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  withState(initialState),
  withMethods((store, authService = inject(AuthApi)) => ({
    register: rxMethod<RegisterRequest>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((request) => authService.register(request)),
        tap((response) => {
          patchState(store, {
            session: response.session,
            user: {
              id: response.user?.id ?? '',
              created_at: response.user?.created_at ?? '',
              email: response.user?.email ?? '',
              firstName: response.user?.user_metadata['first_name'] ?? '',
              lastName: response.user?.user_metadata['last_name'] ?? '',
            },
            isLoading: false,
          });
        }),
      ),
    ),
  })),
);
