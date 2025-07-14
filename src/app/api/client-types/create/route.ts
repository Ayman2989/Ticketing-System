import ClientType from "@/models/ClientType";
import { connect } from "../../../../db/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export const POST = async (req: NextRequest) => {
  try {
    const { client_name, description, status } = await req.json();

    const newClientType = new ClientType({
      client_name,
      description,
      status,
    });

    const savedClientType = await newClientType.save();

    return NextResponse.json({
      message: "Client Type Created",
      success: true,
      savedClientType,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
