import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Patient, Appointment } from './api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  patients: Patient[] = [];
  appointments: Appointment[] = [];

  patientForm = {
    name: '',
    email: ''
  };

  appointmentForm = {
    patientName: '',
    date: '',
    status: 'Pending'
  };

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.api.getPatients().subscribe({
      next: data => {
        this.patients = data;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('patients load failed:', err);
      }
    });

    this.api.getAppointments().subscribe({
      next: data => {
        this.appointments = data;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('appointments load failed:', err);
      }
    });
  }

  addPatient(): void {
    if (!this.patientForm.name || !this.patientForm.email) return;

    this.api.addPatient(this.patientForm).subscribe({
      next: () => {
        this.patientForm = { name: '', email: '' };
        this.loadData();
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('add patient failed:', err);
      }
    });
  }

  addAppointment(): void {
    if (!this.appointmentForm.patientName || !this.appointmentForm.date) return;

    this.api.addAppointment(this.appointmentForm).subscribe({
      next: () => {
        this.appointmentForm = {
          patientName: '',
          date: '',
          status: 'Pending'
        };
        this.loadData();
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('add appointment failed:', err);
      }
    });
  }

  setStatus(id: number, status: string): void {
    this.api.updateAppointmentStatus(id, status).subscribe({
      next: () => {
        this.loadData();
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('update status failed:', err);
      }
    });
  }

  get totalPatients(): number {
    return this.patients.length;
  }

  get totalAppointments(): number {
    return this.appointments.length;
  }

  get completedAppointments(): number {
    return this.appointments.filter(a => a.status === 'Completed').length;
  }

  get pendingAppointments(): number {
    return this.appointments.filter(a => a.status === 'Pending').length;
  }
}