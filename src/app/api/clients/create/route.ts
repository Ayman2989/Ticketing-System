import { connect } from "@/db/dbConfig";
import Client from "@/models/Client";
import { NextRequest, NextResponse } from "next/server";

connect();
export const POST = async (req: NextRequest) => {
  try {
    const {
      client_id,
      client_name,
      client_fullname,
      client_type,
      email,
      contact,
      keam_code,
      status,
    } = await req.json();
    const newClient = new Client({
      client_id,
      client_name,
      client_fullname,
      client_type,
      email,
      contact,
      keam_code,
      status,
    });
    const savedClient = await newClient.save();
    return NextResponse.json({
      message: "ClientCreated",
      success: true,
      savedClient,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
