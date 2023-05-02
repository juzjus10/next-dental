import axios from "axios";
import { prisma } from "./prisma";

// Users API
export async function getAllUsers() {
  const users = await axios.get("/api/users");

  return users.data;
}

export async function createUser(data: any) {
  const user = await axios.post("/api/users", data);
  return user.data;
}

export async function updateUser(id: string, data: any) {
  const user = await axios.put(`/api/users/${id}`, data);
  return user.data;
}

export async function deleteUser(id: string) {
  const user = await axios.delete(`/api/users/${id}`);
  return user.data;
}

// Appointments API

export async function getAllAppointments() {
  const appointments = await axios.get("/api/appointment");

  return appointments.data;
}

export async function createAppointment(data: any) {
  const appointment = await axios.post("/api/appointment", data);
  return appointment.data;
}

export async function updateAppointment(id: string, data: any) {
  const appointment = await axios.put(`/api/appointment/${id}`, data);
  return appointment.data;
}

export async function deleteAppointment(id: string) {
  const appointment = await axios.delete(`/api/appointment/${id}`);
  return appointment.data;
}

// Patient API

export async function getAllPatients() {
  const patients = await axios.get("/api/patient");

  return patients.data;
}

export async function createPatient(data: any) {
  const patient = await axios.post("/api/patient", data);
  return patient.data;
}

export async function updatePatient(id: string, data: any) {
  const patient = await axios.put(`/api/patient/${id}`, data);
  return patient.data;
}

export async function deletePatient(id: string) {
  const patient = await axios.delete(`/api/patient/${id}`);
  return patient.data;
}

//Doctor API

export async function getAllDoctors() {
  const doctors = await axios.get("/api/doctor");

  return doctors.data;
}

export async function createDoctor(data: any) {
  const doctor = await axios.post("/api/doctor", data);
  return doctor.data;
}

export async function updateDoctor(id: string, data: any) {
  const doctor = await axios.put(`/api/doctor/${id}`, data);
  return doctor.data;
}

export async function deleteDoctor(id: string) {
  const doctor = await axios.delete(`/api/doctor/${id}`);
  return doctor.data;
}