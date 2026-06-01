import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Veiculo } from '../models/veiculo.model';

@Injectable({ providedIn: 'root' })
export class VeiculoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(`${this.apiUrl}/veiculo/api/listar/`);
  }

  editar(id: number, dados: Partial<Veiculo>): Observable<Veiculo> {
    return this.http.patch<Veiculo>(`${this.apiUrl}/veiculo/api/editar/${id}/`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/veiculo/api/excluir/${id}/`);
  }
}