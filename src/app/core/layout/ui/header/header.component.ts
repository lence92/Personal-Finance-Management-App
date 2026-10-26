import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthApi } from '../../../auth/data-access/auth.api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  @Output() readonly menuToggle = new EventEmitter<void>();

  @ViewChild('menuArea') private menuArea?: ElementRef<HTMLElement>;

  readonly openPanel = signal<'account' | 'notifications' | null>(null);
  readonly isSigningOut = signal(false);
  readonly signOutError = signal<string | null>(null);

  togglePanel(panel: 'account' | 'notifications'): void {
    this.signOutError.set(null);
    this.openPanel.update((current) => current === panel ? null : panel);
  }

  @HostListener('document:click', ['$event'])
  closePanelOnOutsideClick(event: MouseEvent): void {
    const target = event.target;

    if (
      this.openPanel() &&
      target instanceof Node &&
      !this.menuArea?.nativeElement.contains(target)
    ) {
      this.openPanel.set(null);
    }
  }

  async signOut(): Promise<void> {
    this.isSigningOut.set(true);
    this.signOutError.set(null);

    try {
      await this.authApi.signOut();
      this.openPanel.set(null);
      await this.router.navigateByUrl('/login');
    } catch {
      this.signOutError.set('Could not sign out. Please try again.');
    } finally {
      this.isSigningOut.set(false);
    }
  }
}
