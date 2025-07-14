import { connect } from "@/db/dbConfig";
import Ticket from "@/models/Ticket";
import { NextRequest, NextResponse } from "next/server";

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

    const updatedTicket = await Ticket.findByIdAndUpdate(
      _id,
      {
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
      },
      { new: true }
    );

    if (!updatedTicket) {
      return NextResponse.json({ message: "item not found" });
    }

    return NextResponse.json({ message: "ticket update", updatedTicket });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid ID format" },
      { status: 400 }
    );
  }
};
