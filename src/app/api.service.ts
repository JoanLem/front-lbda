import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl = 'https://6566a13664fcff8d730eebb1.mockapi.io/api/barbers'; // Reemplaza con la URL de tu API
  cars = ['chevrolet', 'mazda', 'ferrari'];
  protected barberList!: Observable<any[]>;

  getCars(): string[] {
    return this.cars;
  }
  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // getOne(id: number): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/${id}`);
  // }

  // create(data: any): Observable<any> {
  //   return this.http.post<any>(this.apiUrl, data);
  // }

  // update(id: number, data: any): Observable<any> {
  //   return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  // }

  // delete(id: number): Observable<any> {
  //   return this.http.delete<any>(`${this.apiUrl}/${id}`);
  // }
}
