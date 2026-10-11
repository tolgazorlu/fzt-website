import {
  readAppointmentsFromFile,
  addAppointmentToFile,
  type Appointment,
} from "@/lib/appointments-store"

export type { Appointment }

export async function getAppointments(): Promise<Appointment[]> {
  return readAppointmentsFromFile()
}

export async function addAppointment(
  appointment: Omit<Appointment, "id" | "createdAt">,
): Promise<Appointment> {
  return addAppointmentToFile(appointment)
}
