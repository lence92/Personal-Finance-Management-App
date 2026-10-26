import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApi } from '../../data-access/auth.api';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.component.scss',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  readonly form = new FormGroup(
    {
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      acceptedTerms: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    },
    { validators: passwordsMatchValidator },
  );
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly confirmationMessage = signal<string | null>(null);

  async submit(): Promise<void> {
    if (this.isLoading()) return;

    this.error.set(null);
    this.confirmationMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      if (this.form.hasError('passwordMismatch')) {
        this.error.set('Passwords do not match.');
      } else if (this.form.controls.acceptedTerms.invalid) {
        this.error.set('You must agree to the Terms and Conditions and Privacy Policy to create an account.');
      }
      return;
    }

    this.isLoading.set(true);

    try {
      const { firstName, lastName, email, password } = this.form.getRawValue();
      const { session } = await this.authApi.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

      if (session) {
        await this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      } else {
        this.confirmationMessage.set('Account created. Check your email to confirm your account before signing in.');
      }
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Unable to create your account. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
