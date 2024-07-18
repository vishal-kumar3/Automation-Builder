import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, email_addresses, first_name, image_url } = body?.data || {};

    if (!id || !email_addresses || !first_name || !image_url) {
      return new NextResponse('Invalid request body', { status: 400 });
    }

    const email = email_addresses[0]?.email_address;

    if (!email) {
      return new NextResponse('Invalid email address', { status: 400 });
    }

    console.log("🇮🇱 :- ", body);

    await prisma.user.upsert({
      where: { clerkId: id, email },
      update: { email, name: first_name, profileImage: image_url },
      create: {
        clerkId: id,
        email,
        name: first_name,
        profileImage: image_url
      }
    });

    return new NextResponse('User updated', { status: 200 });
  } catch (e) {
    console.error('Error while updating user:', e);
    return new NextResponse('Error updating user', { status: 500 });
  }
}

export async function GET() {
  console.log('GET request receive');
}