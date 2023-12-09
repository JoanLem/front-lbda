import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RickService } from './booking-list/rick.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FooterComponent } from './footer/footer.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { BookingListComponent } from './booking-list/booking-list.component';
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
    BookingListComponent,
    BookingSaveComponent,
    BookingFormComponent,
  ],
})
export class AppComponent {}
