import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  try {
    // Отправляем файл на Express сервер
    const serverResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}upload/`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!serverResponse.ok) {
      return NextResponse.json(
        { error: "Failed to upload file to server." },
        { status: serverResponse.status }
      );
    }

    return NextResponse.json({ message: "File uploaded successfully." });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
