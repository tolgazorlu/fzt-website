import { getAppointments } from "@/lib/db"
import { Calendar, Mail, Phone, User, MessageSquare } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AppointmentsPage() {
  const appointments = await getAppointments()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Randevular</h1>
        <p className="text-muted-foreground mt-1">
          İletişim formundan gelen randevu ve bilgi talepleri
        </p>
      </div>
      {appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Henüz randevu talebi bulunmuyor</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad Soyad</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>E-posta</TableHead>
                <TableHead>Mesaj</TableHead>
                <TableHead>Tarih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {a.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`tel:${a.phone}`}
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      {a.phone}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${a.email}`}
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      {a.email}
                    </a>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {a.message ? (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="line-clamp-2 text-sm">{a.message}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(a.createdAt).toLocaleString("tr-TR")}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
