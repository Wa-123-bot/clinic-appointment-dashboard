import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Patient {
  id: number;
  name: string;
  email: string;
}

export interface Appointment {
  id: number;
  patientName: string;
  date: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5053/api';

  constructor(private http: HttpClient) {}

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/patients`);
  }

  addPatient(patient: { name: string; email: string }): Observable<Patient> {
    return this.http.post<Patient>(`${this.baseUrl}/patients`, patient);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/appointments`);
  }

  addAppointment(appointment: { patientName: string; date: string; status: string }): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/appointments`, appointment);
  }

  updateAppointmentStatus(id: number, status: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/appointments/${id}/status`, { status });
  }
}