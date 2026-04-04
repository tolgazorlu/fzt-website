import Link from "next/link"
import { notFound } from "next/navigation"
import { getPatientByCode } from "@/lib/patient-exercises-store"
import { ExercisePlanClient } from "@/components/patient/exercise-plan-client"
import { buttonVariants } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function AdminPatientExercisesPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code: raw } = await params
  const code = decodeURIComponent(raw).trim().toUpperCase()
  const patient = await getPatientByCode(code)
  if (!patient) {
    notFound()
  }

  return (
    <div className="p-8">
      <Link
        href="/admin/dashboard/patients"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "-ml-2 mb-6 gap-2 text-muted-foreground hover:text-foreground sm:mb-8",
        )}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Hastalar listesi
      </Link>
      <ExercisePlanClient
        variant="therapist"
        patientCode={patient.code}
        displayName={patient.displayName}
        initialExercises={patient.exercises}
      />
    </div>
  )
}
