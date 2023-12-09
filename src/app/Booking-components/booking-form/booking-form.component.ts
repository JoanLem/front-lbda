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
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BookingService } from '../booking.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-booking-form',
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
  ],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css',
})
export class BookingFormComponent {
  appoitmentService: BookingService = inject(BookingService);
  barberService: RickService = inject(RickService);

  appointmentList: any[] = [];
  barberList: any[] = [];

  loading = true;
  formulario: FormGroup;

  daySelected = new Date();
  barberSelected: any = '';
  numeroWhatsApp = '573002801952'; // Reemplaza con el número de WhatsApp al que deseas enviar mensajes
  urlWhatsApp = `https://wa.me/${this.numeroWhatsApp}`;

  horaCitaList: any[] = [];
  horaCitaSelected: any = '';

  constructor(private formBuilder: FormBuilder) {
    this.loadBarbers();
    // const dia = format(this.daySelected, 'yyyy-MM-dd');
    this.formulario = this.formBuilder.group({
      barbero: ['', [Validators.required, Validators.minLength(3)]],
      daySelected: new FormControl(this.daySelected),
      horaCita: ['', [Validators.required]],
      cliente: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(3)]],
    });

    // Escuchar cambios en el FormControl 'barbero'
    this.formulario.get('barbero')?.valueChanges.subscribe((value) => {
      this.barberSelected = value;
      this.loadSchedule(this.barberSelected.id, this.daySelected);
    });
    // Escuchar cambios en el FormControl 'barbero'
    this.formulario.get('daySelected')?.valueChanges.subscribe((value) => {
      this.daySelected = value;
      this.loadSchedule(this.barberSelected.id, this.daySelected);
    });
    // Escuchar cambios en el FormControl 'barbero'
    this.formulario.get('horaCita')?.valueChanges.subscribe((value) => {
      this.horaCitaSelected = value;
    });
  }

  async loadSchedule(id: number, day: Date) {
    try {
      this.horaCitaList = [];
      const data = {
        timeStart: format(day, "yyyy-MM-dd'T'00:00:00"),
        barberId: id,
      };
      console.log('>>>>>' + data.timeStart);
      await this.appoitmentService
        .getAppointmentsByBarberId(data)
        .then((data: any) => {
          this.appointmentList = data.data.availabilitySchedule;
          this.loading = false;
        });
      this.appointmentList.forEach((horas) => {
        if (horas.client == null) {
          const horaCita = { timeReal: horas.timeStart };
          this.horaCitaList.push(horaCita);
        }
      });
    } catch (error) {
      console.error('Error al cargar horarios disponibles:', error);
    }
  }

  async loadBarbers() {
    try {
      await this.barberService.getData().then((data: any) => {
        this.barberList = data.data;
        this.loading = false;
      });
    } catch (error) {
      console.error('Error al cargar la lista de barberos:', error);
    }
  }
  async crearCita() {
    if (this.formulario.valid) {
      const nuevaCita = {
        barberId: this.formulario.value.barbero.id,
        timeStart: this.formulario.value.horaCita.timeReal,
        client: {
          name: this.formulario.value.cliente,
          phone: this.formulario.value.phone,
        },
      };
      try {
        await this.appoitmentService.createData(nuevaCita);
        console.log('datos ');
        this.formulario.value.barbero = null;
        this.horaCitaSelected = null;
      } catch (error) {
        console.error('Error al crear cita:', error);
      }
    }
  }

  irAWhatsApp(): void {
    window.open(this.urlWhatsApp, '_blank');
  }
}
