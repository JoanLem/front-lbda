import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RickService } from '../../booking-list/rick.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BookingService } from '../booking.service';
import { format } from 'date-fns';
import { BookingFormComponent } from '../booking-form/booking-form.component';

@Component({
  selector: 'app-booking-save',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BookingFormComponent,
  ],
  templateUrl: './booking-save.component.html',
  styleUrl: './booking-save.component.css',
})
export class BookingSaveComponent {
  displayedColumns: string[] = [
    'barbero',
    'hora',
    'cliente',
    'telefono',
    'options',
  ];
  idActualizar: number | undefined;
  idEliminar: number | undefined;
  appoitmentService: BookingService = inject(BookingService);
  barberService: RickService = inject(RickService);
  appointmentList: any[] = [];
  loading = true;
  filtro: FormGroup;

  daySelected = format(new Date(), 'yyyy-MM-dd');
  barberSelected: any = null;

  constructor(private formBuilder: FormBuilder) {
    const day = format(new Date(), 'yyyy-MM-dd');
    console.log('dia del filtro ' + this.daySelected);
    this.filtro = this.formBuilder.group({
      dayFilter: new FormControl(this.daySelected),
    });

    this.loadData();
    // Escuchar cambios en el FormControl 'barbero'
    this.filtro.get('dayFilter')?.valueChanges.subscribe((value) => {
      this.daySelected = format(value, 'yyyy-MM-dd');
      this.loadData();
    });
  }

  async loadData() {
    try {
      console.log('estoy en loadData' + this.daySelected);

      await this.appoitmentService
        .getData(this.daySelected)
        .then((data: any) => {
          this.appointmentList = data.data;
          this.loading = false;
        });
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }

  async filtrar() {
    this.loadData();
  }

  async updateData(cita: any) {
    if (cita.id !== undefined) {
      const updatedDato = {
        barberId: cita.barber.id,
        timeStart: cita.timeStart,
        client: {
          name: cita.client.name,
          phone: cita.client.phone,
        },
      };

      try {
        await this.appoitmentService.updateData(updatedDato);
        // Actualizar la lista de datos después de la actualización
        //await this.loadData();
      } catch (error) {
        console.error('Error al actualizar dato:', error);
      }
    }
  }

  async deleteData(idEliminar: number) {
    if (idEliminar !== undefined) {
      try {
        await this.appoitmentService.deleteData(idEliminar);
        // Actualizar la lista de datos después de la eliminación
        await this.loadData();
      } catch (error) {
        console.error('Error al eliminar dato:', error);
      }
    }
  }
}
