import { Routes } from '@angular/router';
import { BookingSaveComponent } from './Booking-components/booking-save/booking-save.component';
import { BarberMasterComponent } from './barber-master/barber-master.component';
import { BookingFormComponent } from './Booking-components/booking-form/booking-form.component';

export const routes: Routes = [
  { path: 'booking', component: BookingSaveComponent },
  { path: 'agendar', component: BookingFormComponent },
  { path: 'barbers', component: BarberMasterComponent },
];
