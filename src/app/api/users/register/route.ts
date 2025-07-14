import User from "@/models/User";
import { connect } from "../../../../db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export const POST = async (req: NextRequest) => {
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

    // validation

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ error: "user alr exists" }, { status: 400 });
    }
    //hashing password

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    // saving newuser
    const newUser = new User({
      employee_id,
      employee_name,
      email,
      password: hashedPassword,
      role,
      contact_number,
      designation,
      status,
    });

    const savedUser = await newUser.save();
    //returning the newly modified user
    return NextResponse.json({
      message: "User Created ",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
