// app/api/signout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const cookie_store = await cookies();
    cookie_store.delete("ac_token");

    return NextResponse.json({ message: "Signed out" });
}
