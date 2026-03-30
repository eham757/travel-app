import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location } from '../../models/location';

const API_BASE = 'https://localhost:7144/api';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private http = inject(HttpClient);

  getAll(): Observable<Location[]> {
    return this.http.get<Location[]>(`${API_BASE}/location`);
  }

  /// ID is a guid
  getById(id: string): Observable<Location> {
    return this.http.get<Location>(`${API_BASE}/location/${id}`);
  }

  create(location: Location): Observable<Location> {
    return this.http.post<Location>(`${API_BASE}/location`, location);
  }

  update(id: string, location: Location): Observable<Location> {
    return this.http.put<Location>(`${API_BASE}/location/${id}`, location);
  }

  /// ID is a guid
  archive(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/location/${id}`);
  }
}
