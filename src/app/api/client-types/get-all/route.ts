import ClientType from "@/models/ClientType";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../db/dbConfig";

connect();

export const GET = async (req: NextRequest) => {
  try {
    const clientTypes = await ClientType.find();

    return NextResponse.json({ clientTypes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
