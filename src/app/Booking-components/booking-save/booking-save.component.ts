import { Component, inject, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RickService } from '../../services/rick.service';
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
import { BookingService } from '../../services/booking.service';
import { format } from 'date-fns';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { LoaderComponent } from '../../loader/loader.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../modal/modal.component';

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
    LoaderComponent,
    ModalComponent,
    MatRadioModule,
    MatCheckboxModule,
  ],
  templateUrl: './booking-save.component.html',
  styleUrl: './booking-save.component.css',
})
export class BookingSaveComponent {
  // injection services
  appoitmentService: BookingService = inject(BookingService);
  barberService: RickService = inject(RickService);

  // parametros filtro
  filtro: FormGroup;
  barberList: any[] = [];
  daySelected = format(new Date(), 'yyyy-MM-dd');
  displayedColumns: string[] = ['hora', 'opciones'];
  barberSelected = 0;
  clientSelected = '';
  //envio de registro para formulario de agenda
  // @Input() appointmentList: any[];
  @Output() editarRegistro = new EventEmitter<any>();

  idActualizar: number | undefined;
  idEliminar: number | undefined;
  appointmentDetails: any;

  // parametos tabla
  appointmentList: any[] = [];

  loading = true;
  isModalOpen = false;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {
    this.filtro = this.formBuilder.group({
      dayFilter: new Date(),
      barbero: '',
    });
    this.loadBarbers();
    this.loadData();
    // Escuchar cambios en el Filtro del Dia
    this.filtro.get('dayFilter')?.valueChanges.subscribe((value) => {
      this.daySelected = format(value, 'yyyy-MM-dd');
      this.loadData();
    });
    // Escuchar cambios en el filtro 'barbero'
    this.filtro.get('barbero')?.valueChanges.subscribe((value) => {
      this.barberSelected = value;
      this.loadData();
    });

    this.appoitmentService.nuevoRegistro$.subscribe(() => {
      // Lógica para actualizar la tabla
      this.loadData();
    });
  }

  async loadData() {
    try {
      const filtro = {
        barberId: this.barberSelected,
        timeStart: this.daySelected,
      };
      await this.appoitmentService.getData(filtro).then((data: any) => {
        this.appointmentList = data.data;
        this.loading = false;
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }

  async loadBarbers() {
    try {
      await this.barberService.getData().then((data: any) => {
        // this.barberList.push({ id: 0, name: 'Todos' });
        this.barberList = data.data;
        this.loading = false;
      });
    } catch (error) {
      console.error('Error al cargar la lista de barberos:', error);
    }
  }

  /**
   * Actualizar Appointment
   */
  updateData(appointmentDetails: any): void {
    this.isModalOpen = true;
    this.appointmentDetails = {
      id: appointmentDetails.id,
      barber: appointmentDetails.barber,
      timeStart: appointmentDetails.timeStart,
      client: appointmentDetails.client,
    };
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
  modalNuevaCita() {
    this.isModalOpen = true;
    //console.info('Abrimos modal');
  }

  closeModal() {
    this.isModalOpen = false;
    this.appointmentDetails = undefined;
    //console.info('Cerramos modal');
  }
}
