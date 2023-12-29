import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
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
import { format } from 'date-fns';
// import servicios
import { BookingService } from '../../services/booking.service';
import { ClientService } from '../../services/client.service';
import { RickService } from '../../services/rick.service';
import { LoaderComponent } from '../../loader/loader.component';

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
    LoaderComponent,
  ],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css',
})
export class BookingFormComponent {
  appoitmentService: BookingService = inject(BookingService);
  barberService: RickService = inject(RickService);
  clientService: ClientService = inject(ClientService);

  appointmentList: any[] = [];
  barberList: any[] = [];

  titulo = 'Agenda tu cita';
  flatAlerta = false;
  loading = true;
  formulario: FormGroup;

  daySelected = new Date();
  barberSelected: any = '';
  clientSelected: any = '';
  numeroWhatsApp = '573196073229'; // Reemplaza con el número de WhatsApp al que deseas enviar mensajes
  urlWhatsApp = `https://wa.me/${this.numeroWhatsApp}`;

  urlImgProfileDefault = `https://elasticbeanstalk-us-east-1-148301147089.s3.amazonaws.com/perfil+default.jpg`;

  horaCitaList: any[] = [];
  horaCitaSelected: any = '';

  constructor(private formBuilder: FormBuilder) {
    this.loadBarbers();
    this.formulario = this.formBuilder.group({
      barbero: ['', [Validators.required]],
      daySelected: new FormControl(this.daySelected),
      horaCita: ['', [Validators.required]],
      cliente: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-ZñÑáéíóúÁÉÍÓÚ]{2,15} [a-zA-ZñÑáéíóúÁÉÍÓÚ]{2,15}$'
          ),
        ],
      ],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });

    // Escuchar cambios en el FormControl 'barbero'
    this.formulario.get('barbero')?.valueChanges.subscribe((value) => {
      if (value !== '') {
        this.barberSelected = value;
        this.loadSchedule(this.barberSelected.id, this.daySelected);
      }
    });
    // Escuchar cambios en el FormControl 'daySelected'
    this.formulario.get('daySelected')?.valueChanges.subscribe((value) => {
      this.daySelected = value;
      this.loadSchedule(this.barberSelected.id, this.daySelected);
    });
    // Escuchar cambios en el FormControl 'horaCita'
    this.formulario.get('horaCita')?.valueChanges.subscribe((value) => {
      this.horaCitaSelected = value;
    });

    // Escuchar cambios en el FormControl 'phone'
    this.formulario.get('phone')?.valueChanges.subscribe((value) => {
      if (value.length == 10) {
        this.formulario.patchValue({
          cliente: '',
        });
        this.getClientByPhone(value);
      }
      // this.horaCitaSelected = value;
    });
  }

  async loadSchedule(id: number, day: Date) {
    try {
      this.horaCitaList = [];
      const data = {
        timeStart: format(day, "yyyy-MM-dd'T'00:00:00"),
        barberId: id,
      };

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

  async getClientByPhone(phone: String) {
    try {
      await this.clientService.getClientByPhone(phone).then((response: any) => {
        if (response.data !== null) {
          this.formulario.patchValue({
            cliente: response.data.name,
          });
        }
        this.loading = false;
      });
    } catch (error) {
      console.error('Error al cargar datos del cliente:', error);
    }
  }

  async crearCita() {
    if (this.formulario.valid) {
      const nuevaCita = {
        barbero: this.formulario.value.barbero,
        barberId: this.formulario.value.barbero.id,
        timeStart: this.formulario.value.horaCita.timeReal,
        client: {
          name: this.formulario.value.cliente,
          phone: this.formulario.value.phone,
        },
      };
      try {
        await this.appoitmentService.createData(nuevaCita);
        this.appoitmentService.notificarNuevoRegistro();
        this.detalleCita(nuevaCita);
      } catch (error) {
        console.error('Error al crear cita:', error);
      }
    }
  }

  detalleCita(nuevaCita: {
    barbero: any;
    barberId: any;
    timeStart: any;
    client: { name: any; phone: any };
  }) {
    this.flatAlerta = true;
    this.titulo = 'Detalle de la cita';
    this.barberSelected = nuevaCita.barbero.name;
    this.clientSelected = nuevaCita.client.name;
    this.daySelected = nuevaCita.timeStart;
  }

  cerrarDetalleCita() {
    this.flatAlerta = false;
    this.titulo = 'Agendar cita';
    this.barberSelected = '';
    this.formulario.patchValue({
      cliente: '',
      phone: '',
      barbero: '',
      horaCita: '',
    });
  }

  irAWhatsApp(): void {
    window.open(this.urlWhatsApp, '_blank');
  }
}
