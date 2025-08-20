import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create the user in the database
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    return new Response(JSON.stringify({ id: user.id, email: user.email }));
  } catch (error) {
    return new Response(JSON.stringify({ error: "User creation failed" }), {
      status: 400,
    });
  }
}
