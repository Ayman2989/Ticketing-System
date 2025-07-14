import { connect } from "@/db/dbConfig";
import Ticket from "@/models/Ticket";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export const PUT = async (
  req: NextRequest,
  { params }: { params: { _id: string } }
) => {
  const { _id } = params;
  if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
    return NextResponse.json(
      { success: false, message: "Invalid ID format" },
      { status: 400 }
    );
  }
  try {
    const {
      employee_id,
      employee_name,
      email,
      password,
      role,
      contact_number,
      designation,
      status,
    } = await req.json();

    const oldUser = await User.findById(_id);

    if (!oldUser) {
      NextResponse.json({ message: "old user not found" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const oldUserName = oldUser.employee_name;
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        employee_id,
        employee_name,
        email,
        password: hashedPassword,
        role,
        contact_number,
        designation,
        status,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "item not found" });
    }

    const updatedTicket = await Ticket.updateMany(
      {
        $or: [{ assigned_to: oldUserName }, { coordinator: oldUserName }],
      },
      {
        $set: {
          assigned_to: employee_name,
          coordinator: employee_name,
        },
      }
    );

    if (updatedTicket.matchedCount === 0) {
      console.warn("No related users found to update.");
    }

    return NextResponse.json({ message: "ticket update", updatedUser });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid ID format" },
      { status: 400 }
    );
  }
};
