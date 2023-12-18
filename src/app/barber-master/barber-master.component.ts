import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RickService } from '../services/rick.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-barber-master',
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
  ],
  templateUrl: './barber-master.component.html',
  styleUrl: './barber-master.component.css',
})
export class BarberMasterComponent {
  displayedColumns: string[] = ['id', 'name', 'options'];
  idActualizar: number | undefined;
  idEliminar: number | undefined;
  dataService: RickService = inject(RickService);
  barberList: any[] = [];
  loading = true;
  formulario: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.loadData();
    this.formulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  async loadData() {
    try {
      await this.dataService.getData().then((data: any) => {
        this.barberList = data.data;
        this.loading = false;
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }

  async createData() {
    this.dataService.createData({});
    this.dataService.getData().then((data: any[]) => {
      this.barberList = data;
    });
    this.loadData();
  }

  async crearNuevoDato() {
    if (this.formulario.valid) {
      const nuevoDato = {
        name: this.formulario.value.nombre,
        phone: this.formulario.value.phone,
      };
      try {
        await this.dataService.createData(nuevoDato);
        // Actualizar la lista de datos después de la creación
        await this.loadData();
      } catch (error) {
        console.error('Error al crear nuevo dato:', error);
      }
      // Llama a tu función de guardar aquí
      console.log('Datos guardados:', this.formulario.value.nombre);
    }
  }

  async updateData(idActualizar: number) {
    if (idActualizar !== undefined) {
      const updatedDato = {
        name: ' Dato acttualizado',
      };

      try {
        await this.dataService.updateData(idActualizar, updatedDato);
        // Actualizar la lista de datos después de la actualización
        await this.loadData();
      } catch (error) {
        console.error('Error al actualizar dato:', error);
      }
    }
  }

  async deleteData(idEliminar: number) {
    if (idEliminar !== undefined) {
      try {
        await this.dataService.deleteData(idEliminar);
        // Actualizar la lista de datos después de la eliminación
        await this.loadData();
      } catch (error) {
        console.error('Error al eliminar dato:', error);
      }
    }
  }
}
