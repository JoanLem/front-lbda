import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../enviroment-local';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  //apiUrl = 'https://6566a13664fcff8d730eebb1.mockapi.io/api/barbers';
  apiUrl = AppConfig.apiUrl + AppConfig.port + AppConfig.path.apointment;

  // >>>>>>>>>>>>  Metodo traer toda la data
  async getData(date: any): Promise<any> {
    const path = this.apiUrl + '/BookingDate/' + date;
    //const queryParams = new URLSearchParams(date).toString();
    //const urlWithParams = `${path}?${queryParams}`;
    const response = await fetch(path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.statusText}`);
    }
    return response.json();
  }

  //metodo para traer la agenda de un barbero por dia
  async getAppointmentsByBarberId(data: any): Promise<any> {
    const path = this.apiUrl + '/getAppointmentsByBarberId';

    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(data);
    const options = {
      method: 'POST',
      headers: headers,
      body: body,
    };

    const response = await fetch(path, options);
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.statusText}`);
    }
    return response.json();
  }

  // >>>>>>>>>>>>  Metodo traer Especifico registro por id
  async getDataById(id: number): Promise<any> {
    const url = `${this.apiUrl}/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener datos por ID: ${response.statusText}`);
    }
    return response.json();
  }

  // >>>>>>>>>>>>  Metodo Guardar un registro
  async saveData(barberNew: any): Promise<any> {
    const data = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(barberNew),
    });
    return await data.json();
  }

  // >>>>>>>>>>>>  Metodo Crear un registro

  async createData(data: any): Promise<any> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error al crear datos: ${response.statusText}`);
    }
    return response.json();
  }

  // >>>>>>>>>>>>  Metodo updateData un registro

  async updateData(updatedData: any): Promise<any> {
    const url = `${this.apiUrl}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error(`Error al actualizar datos: ${response.statusText}`);
    }
    return response.json();
  }

  // >>>>>>>>>>>>  Metodo deleteData un registro

  async deleteData(id: number): Promise<void> {
    const url = `${this.apiUrl}/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar datos: ${response.statusText}`);
    }
  }
}
