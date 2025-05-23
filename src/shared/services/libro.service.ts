import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { ILibro } from '../interfaces/libro.interface';

@Injectable({
  providedIn: 'root',
})
export class LibroService {
  baseUrl = `${environment.apiURL}/libros`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private createHeaders() {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Método para crear un nuevo prestador
  create(
    createPrestadorDto: any
  ): Observable<{ ok: boolean; item: ILibro; message: string }> {
    const headers = this.createHeaders();
    return this.http.post<{ ok: boolean; item: ILibro; message: string }>(
      `${this.baseUrl}`,
      createPrestadorDto,
      { headers }
    );
  }

  // Método para obtener todos los prestadores con filtros, paginación y ordenamiento
  findWithFilters(
    limit: number = 10,
    page: number = 1,
    query: string = '',
    orderByField: string = 'libr_titulo',
    orderByDirection: 'ASC' | 'DESC' = 'ASC'
  ): Observable<{
    ok: boolean;
    items: ILibro[];
    total: number;
    message: string;
  }> {
    const headers = this.createHeaders();
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('page', page.toString())
      .set('query', query)
      .set('orderByField', orderByField)
      .set('orderByDirection', orderByDirection);

    return this.http.get<{
      ok: boolean;
      items: ILibro[];
      total: number;
      message: string;
    }>(`${this.baseUrl}/search`, { headers, params });
  }

  // Método para obtener todos los prestadores
  findAll(): Observable<{ ok: boolean; items: ILibro[]; message: string }> {
    const headers = this.createHeaders();
    return this.http.get<{ ok: boolean; items: ILibro[]; message: string }>(
      this.baseUrl,
      { headers }
    );
  }

  // Método para obtener un prestador por su ID
  findOne(
    id: number
  ): Observable<{ ok: boolean; item: ILibro; message: string }> {
    const headers = this.createHeaders();
    return this.http.get<{ ok: boolean; item: ILibro; message: string }>(
      `${this.baseUrl}/${id}`,
      { headers }
    );
  }

  // Método para actualizar un prestador
  update(
    id: number,
    updatePrestadorDto: any
  ): Observable<{ ok: boolean; item: ILibro; message: string }> {
    const headers = this.createHeaders();
    return this.http.put<{ ok: boolean; item: ILibro; message: string }>(
      `${this.baseUrl}/${id}`,
      updatePrestadorDto,
      { headers }
    );
  }

  // Método para eliminar un prestador
  remove(
    id: number
  ): Observable<{ ok: boolean; item: ILibro; message: string }> {
    const headers = this.createHeaders();
    return this.http.delete<{ ok: boolean; item: ILibro; message: string }>(
      `${this.baseUrl}/${id}`,
      { headers }
    );
  }
}
