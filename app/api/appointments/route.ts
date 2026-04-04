import { NextRequest, NextResponse } from "next/server";
import { addAppointment, getAppointments } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

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
  } catch {
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
