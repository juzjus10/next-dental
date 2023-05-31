import axios from "axios";
import { notifications } from "@mantine/notifications";

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
  //convert all date strings to date objects
  

  return appointments.data;
}

export async function createAppointment(data: any) {
  try {
    const response = await axios.post("/api/appointment", data);
    notifications.show({
      title: "Appointment Created",
      color: "green",
      message: "Appointment created successfully",
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      notifications.show({
        title: "Error",
        color: "red",
        message: error.response.data.message,
      });
    }
  }
}
export async function checkAppointment(data: any) {
  try {
    const response = await axios.post("/api/appointment/check-existing", data);
    notifications.show({
      title: "Appointment Status",
      color: "green",
      message: response.data.message,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      notifications.show({
        title: "Error",
        color: "red",
        message: error.response.data.message,
      });
    }
  }
}
export async function updateAppointment(id: string, data: any) {
  const response = await axios.put(`/api/appointment/${id}`, data);
  notifications.show({
    title: "Appointment Updated",
    color: "green",
    message: response.data.message,
  });
  return response.data;
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

export async function getPatient(id: string) {
  const patient = await axios.get(`/api/patient/${id}`);
  return patient.data;  
}

export async function createPatient(data: any) {
  try {
    const patient = await axios.post("/api/patient", data);
  return patient.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      const { details } = error.response.data;
      details.forEach((detail: string) => {
        notifications.show({
          title: 'Validation Error',
          message: detail,
          color: 'red',
        });
      });
    } else {
      throw error;
    }
  }
}

export async function checkPatient(data: any) {
  try {
    const response = await axios.post("/api/patient/check-existing", data);
    notifications.show({
      title: "Patient Status",
      color: "green",
      message: response.data.message,
      icon: "👋",
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      notifications.show({
        title: "Error",
        color: "red",
        icon: "🙁",
        message: error.response.data.message,
      });
    }
  }
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

// Setting API

export async function getAllSettings() {
  const settings = await axios.get("/api/settings");

  return settings.data;
}

export async function updateSettings(id: string, data: any) {
  const settings = await axios.put(`/api/settings/${id}`, data);
  return settings.data;
}


// Records APi

export async function getAllRecords() {
  const records = await axios.get("/api/records");

  return records.data;
}

export async function getRecordByID(id: string) {
  const record = await axios.get(`/api/records/${id}`);
  return record.data;
}

export async function createRecord(data: any) {
  try {
    const record = await axios.post("/api/records", data);
    return record.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      const { details } = error.response.data;
      details.forEach((detail: string) => {
        notifications.show({
          title: 'Validation Error',
          message: detail,
          color: 'red',
        });
      });
    } else {
      throw error;
    }
  }
}

export async function updateRecord(id: string, data: any) {
  const record = await axios.put(`/api/records/${id}`, data);
  return record.data;
}

export async function deleteRecord(id: string) {
  const record = await axios.delete(`/api/records/${id}`);
  return record.data;
}
