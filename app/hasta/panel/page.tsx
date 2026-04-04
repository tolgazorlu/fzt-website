import { redirect } from "next/navigation";
import { getPatientSession } from "@/lib/patient-auth";
import { getPatientById } from "@/lib/patient-exercises-store";
import { ExercisePlanClient } from "@/components/patient/exercise-plan-client";

export default async function HastaPanelPage() {
  const session = await getPatientSession();
  if (!session) {
    redirect("/hasta");
  }
  const patient = await getPatientById(session.patientId);
  if (!patient) {
    redirect("/hasta");
  }
  return (
    <ExercisePlanClient
      variant="patient"
      displayName={patient.displayName}
      initialExercises={patient.exercises}
    />
  );
}
