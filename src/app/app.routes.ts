import { Routes } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { BookingSaveComponent } from './Booking-components/booking-save/booking-save.component';
import { BookingListComponent } from './booking-list/booking-list.component';
import { BookingFormComponent } from './Booking-components/booking-form/booking-form.component';

export const routes: Routes = [
  { path: 'booking', component: BookingSaveComponent },
  { path: 'agendar', component: BookingFormComponent },
  { path: 'barbers', component: BookingListComponent },
];
