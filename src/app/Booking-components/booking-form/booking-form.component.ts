import { Component, Inject, inject, Input } from '@angular/core';
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
  /**
   * Injeccion de los servicios de cosumo el API
   */
  appoitmentService: BookingService = inject(BookingService);
  barberService: RickService = inject(RickService);
  clientService: ClientService = inject(ClientService);

  /**
   * Declaracion de variables para usarla en las listas desplegables del formulario
   */
  appointmentList: any[] = [];
  barberList: any[] = [];

  /**
   * Variables de renderizacion para el HTML
   */
  titulo = 'Agenda tu cita';
  flatAlerta = false;
  loading = true;

  /**
   * Declaracion de Input para recepcion de data de otro componente
   */
  @Input() appointmentDetails: any;

  formulario: FormGroup;

  day = new Date();
  daySelected = format(this.day, "yyyy-MM-dd'T'00:00:00");
  barberSelected: any = '';
  clientSelected: any = '';
  numeroWhatsApp = '573196073229'; // Reemplaza con el número de WhatsApp al que deseas enviar mensajes
  urlWhatsApp = `https://wa.me/${this.numeroWhatsApp}`;

  urlImgProfileDefault = `https://elasticbeanstalk-us-east-1-148301147089.s3.amazonaws.com/perfil+default.jpg`;

  horaCitaList: any[] = [];
  horaCitaSelected: any = '';

  idActualizar: number = 0;

  ngOnInit() {
    if (this.appointmentDetails) {
      console.log('form component Id a aculaizar es: ');
      console.log(this.appointmentDetails);
      this.idActualizar = this.appointmentDetails.id;
      this.barberSelected = this.appointmentDetails.barber;
      this.formulario.patchValue({
        babero: this.appointmentDetails.barber,
        daySelected: this.appointmentDetails.timeStart,
        horaCita: this.appointmentDetails.timeStart,
        cliente: this.appointmentDetails.client.name,
        phone: this.appointmentDetails.client.phone,
      });
    }
  }
  constructor() {
    console.log(
      'Id a actualizar en el componente formulario: ' + this.idActualizar
    );
    this.loadBarbers();
    this.formulario = new FormGroup({
      barbero: new FormControl(''),
      daySelected: new FormControl(this.daySelected),
      horaCita: new FormControl(''),
      cliente: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^[a-zA-ZñÑáéíóúÁÉÍÓÚ]{2,15} [a-zA-ZñÑáéíóúÁÉÍÓÚ]{2,15}$'
        ),
      ]),

      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$'),
      ]),
    });

    // Escuchar cambios en el FormControl 'barbero'
    this.formulario.get('barbero')?.valueChanges.subscribe((value) => {
      if (value !== '') {
        console.log('dia desde eveto barbero: ' + this.daySelected);
        this.barberSelected = value;
        this.loadSchedule(this.barberSelected.id, this.daySelected);
      }
    });
    // Escuchar cambios en el FormControl 'daySelected'
    this.formulario.get('daySelected')?.valueChanges.subscribe((value) => {
      if (value != null && this.barberSelected !== '') {
        console.log('dia desde eveto dayselected: ' + this.daySelected);
        this.daySelected = value;
        this.loadSchedule(this.barberSelected.id, this.daySelected);
      }
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

  /**
   * Funcion que carga la lista de barberos para ser usada en el componente se seleccion en html
   */

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

  /**
   * Funcion encargada de cargar las horas que estan disponibles para agendar una cita, dado el barbero y el dia.
   * @param barberId
   * @param day
   * @author Natalia M
   */

  async loadSchedule(barberId: number, day: String) {
    this.horaCitaList = [];
    const data = {
      timeStart: day,
      barberId: barberId,
    };
    try {
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

  async saveAppointment() {
    var appointmentCreated: any = [];
    if (this.formulario.valid) {
      const newAppointment = {
        barberId: this.formulario.value.barbero.id,
        timeStart: this.formulario.value.horaCita.timeReal,
        client: {
          name: this.formulario.value.cliente,
          phone: this.formulario.value.phone,
        },
      };
      try {
        if (this.appointmentDetails) {
          //Se Actualizara el appointment
          appointmentCreated = await this.appoitmentService.updateData(
            newAppointment,
            this.idActualizar
          );
        } else {
          //Se creará un nuevo Appointment
          appointmentCreated = await this.appoitmentService.createData(
            newAppointment
          );
        }
        this.appoitmentService.notificarNuevoRegistro();
        this.alertAppointmentDetails(appointmentCreated.data);
      } catch (error) {
        console.error('Error al crear cita:', error);
      }
    }
  }

  alertAppointmentDetails(appointmentCreated: any) {
    this.flatAlerta = true;
    this.titulo = 'Detalle de la cita';
    this.barberSelected = appointmentCreated.barber.name;
    this.clientSelected = appointmentCreated.client.name;
    this.daySelected = appointmentCreated.timeStart;
  }

  cerrarDetalleCita() {
    this.flatAlerta = false;
    this.titulo = 'Agendar cita';
    this.barberSelected = '';
    this.formulario.reset({
      cliente: '',
      phone: '',
      daySelected: this.daySelected,
      horaCita: '',
      barbero: '',
    });
  }

  irAWhatsApp(): void {
    window.open(this.urlWhatsApp, '_blank');
  }
}
