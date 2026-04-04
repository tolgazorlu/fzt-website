import { redirect } from "next/navigation"
import { getPatientSession } from "@/lib/patient-auth"
import { getPatientById } from "@/lib/patient-exercises-store"
import { PatientPanelShell } from "@/components/patient/patient-panel-shell"

export default async function HastaPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getPatientSession()
  if (!session) {
    redirect("/hasta")
  }
  const patient = await getPatientById(session.patientId)
  if (!patient) {
    redirect("/hasta")
  }
  return (
    <PatientPanelShell displayName={patient.displayName} code={patient.code}>
      {children}
    </PatientPanelShell>
  )
}
