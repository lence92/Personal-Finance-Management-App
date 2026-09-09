import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../core/config/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private readonly supabase = inject(SupabaseService);

  async incrementCounter() {
    const { data: counters, error: readError } = await this.supabase.client
      .from('counters')
      .select('*')
      .eq('name', 'test');

    console.log('READ RESULT:', counters);
    console.log('READ ERROR:', readError);

    if (readError) {
      throw readError;
    }

    if (!counters || counters.length !== 1) {
      throw new Error(
        `Expected exactly 1 counter, but found ${counters?.length ?? 0}`,
      );
    }

    const counter = counters[0];

    const { data: updatedRows, error: updateError } = await this.supabase.client
      .from('counters')
      .update({
        value: counter.value + 1,
      })
      .eq('id', counter.id)
      .select('*');

    console.log('UPDATE RESULT:', updatedRows);
    console.log('UPDATE ERROR:', updateError);

    if (updateError) {
      throw updateError;
    }

    return updatedRows?.[0];
  }
}
