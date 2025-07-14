import { redirect } from "next/navigation";

export default function Home() {
  redirect("/tickets"); // Always redirects to /tickets
}
