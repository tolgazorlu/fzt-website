import { NextRequest, NextResponse } from "next/server";
import { addAppointment, getAppointments } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { AppointmentsStorageNotConfiguredError } from "@/lib/appointments-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body;
    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: "Ad, telefon ve e-posta zorunludur" },
        { status: 400 },
      );
    }
    const appointment = await addAppointment({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      message: String(message || "").trim(),
    });
    return NextResponse.json({ success: true, id: appointment.id });
  } catch (err) {
    if (err instanceof AppointmentsStorageNotConfiguredError) {
      return NextResponse.json(
        {
          error:
            "Randevu kaydı henüz yapılandırılmamış. Vercel’de KV_REST_API_URL ve KV_REST_API_TOKEN (veya UPSTASH_REDIS_*) ortam değişkenlerini ekleyin. Yazma için salt okunur token kullanmayın.",
        },
        { status: 503 },
      );
    }
    console.error("POST /api/appointments", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const appointments = await getAppointments();
  return NextResponse.json(appointments);
}
