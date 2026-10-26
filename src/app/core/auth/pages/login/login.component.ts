import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApi } from '../../data-access/auth.api';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  async submit(): Promise<void> {
    if (this.isLoading()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      await this.authApi.login({
        email: this.form.controls.email.value.trim(),
        password: this.form.controls.password.value,
      });

      const requestedUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      const returnUrl = requestedUrl?.startsWith('/') && !requestedUrl.startsWith('//')
        ? requestedUrl
        : '/dashboard';
      await this.router.navigateByUrl(returnUrl, { replaceUrl: true });
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
