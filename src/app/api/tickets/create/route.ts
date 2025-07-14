import { connect } from "@/db/dbConfig";
import Ticket from "@/models/Ticket";
import { NextResponse, NextRequest } from "next/server";

connect();

export const POST = async (req: NextRequest) => {
  try {
    const {
      title,
      client,
      tags,
      mode_of_ticket,
      status,
      module,
      issue_date,
      priority,
      issue_type,
      project,
      assigned_to,
      coordinator,
      point_of_contact,
      client_contact_number,
      link,
      completion_time,
      expert_estimation,
      dueDate,
      completed_date,
      ticket_description,
      resolution_points,
      created_by,
      remarks,
    } = await req.json();
    // Format date fields (if provided)

    const newTicket = new Ticket({
      title,
      client,
      tags,
      mode_of_ticket,
      status,
      module,
      issue_date,
      priority,
      issue_type,
      project,
      assigned_to,
      coordinator,
      point_of_contact,
      client_contact_number,
      link,
      completion_time,
      expert_estimation,
      dueDate,
      completed_date,
      ticket_description,
      resolution_points,
      created_by,
      remarks,
    });
    const savedTicket = await newTicket.save();
    return NextResponse.json({
      message: "Ticket Created",
      success: true,
      savedTicket,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
