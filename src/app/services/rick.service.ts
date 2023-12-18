import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RickService {
  //apiUrl = 'https://6566a13664fcff8d730eebb1.mockapi.io/api/barbers';
  //apiUrl = 'http://localhost:8080/barbers';
  apiUrl = environment.apiUrl + environment.port + environment.path.barber;

  // >>>>>>>>>>>>  Metodo traer toda la data
  async getData(): Promise<any> {
    const response = await fetch(this.apiUrl);
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.statusText}`);
    }
    // console.log(' REsponse desde servicio : ' + response.json());
    // const data = response.json();
    // console.log(' Data desde servicio : ' + data);
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

  async updateData(id: number, updatedData: any): Promise<any> {
    const url = `${this.apiUrl}/${id}`;
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
