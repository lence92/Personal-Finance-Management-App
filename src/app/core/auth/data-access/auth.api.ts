import { inject, Injectable } from '@angular/core';
import { Session } from '@supabase/supabase-js';
import { SupabaseService } from '../../config/supabase.service';
import { LoginRequest, RegisterRequest } from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly supabase = inject(SupabaseService);

  public async register(request: RegisterRequest) {
    const { data, error } = await this.supabase.client.auth.signUp({
      email: request.email,
      password: request.password,
      options: {
        data: {
          first_name: request.firstName,
          last_name: request.lastName,
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  }

  public async login(request: LoginRequest) {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email: request.email,
      password: request.password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  public async getSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.client.auth.getSession();

    if (error) {
      throw error;
    }

    return data.session;
  }

  public async signOut(): Promise<void> {
    const { error } = await this.supabase.client.auth.signOut();

    if (error) {
      throw error;
    }
  }
}
