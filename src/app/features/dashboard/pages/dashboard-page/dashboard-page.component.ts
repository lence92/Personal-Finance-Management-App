import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CounterStore } from '../../data-access/counter.store';
import { CounterService } from '../../data-access/counter.service';
import { AuthApi } from '../../../../core/auth/data-access/auth.api';

@Component({
  selector: 'app-dashboard-page',
  imports: [],
  providers: [CounterStore],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  public readonly store = inject(CounterStore);
  private readonly counterService = inject(CounterService);
  private readonly authService = inject(AuthApi);

  public async testSupabase() {
    const updatedCounter = await this.counterService.incrementCounter();

    console.log('After:', updatedCounter);
  }

  public async testAuth() {
    const result = await this.authService.register({
      email: 'lence_5kovska+02@hotmail.com',
      password: 'Test123,./',
      firstName: 'Lenche',
      lastName: 'Petkovska',
    });
    console.log('result', result);
  }
}
