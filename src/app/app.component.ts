import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FooterComponent } from './footer/footer.component';
import { BarberMasterComponent } from './barber-master/barber-master.component';
import { BookingSaveComponent } from './Booking-components/booking-save/booking-save.component';
import { BookingFormComponent } from './Booking-components/booking-form/booking-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    FormsModule,
    CommonModule,
    ToolbarComponent,
    FooterComponent,
    BarberMasterComponent,
    BookingSaveComponent,
    BookingFormComponent,
  ],
})
export class AppComponent {}
