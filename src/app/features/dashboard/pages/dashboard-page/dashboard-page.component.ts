import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CounterStore } from '../../data-access/counter.store';
import { CounterService } from '../../data-access/counter.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [],
  providers: [CounterStore],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  readonly store = inject(CounterStore);
  private readonly counterService = inject(CounterService);

  async testSupabase() {
    const updatedCounter = await this.counterService.incrementCounter();

    console.log('After:', updatedCounter);
  }
}
