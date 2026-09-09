import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CounterStore } from '../../data-access/counter.store';

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
}
