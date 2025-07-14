type SidebarDataType = {
  title: string;
  href: string;
}[];
export const SidebarData: SidebarDataType = [
  { title: "Clients", href: "/clients" },
  { title: "Clients Type", href: "/client-types" },
  { title: "Issues", href: "/issues" },
  { title: "Projects", href: "/projects" },
  { title: "Modules", href: "/modules" },
  { title: "Tickets", href: "/tickets" },
];

export const ticketColumns = [
  {
    header: "Title",
    accessorKey: "title",
    hidden: { sm: false, md: false, xl: false },
    filter: true,
  },

  {
    header: "Assigned Staff",
    accessorKey: "assigned_to",
    hidden: { sm: true, md: true, xl: false },
    filter: true,
  },
  {
    header: "Coordinator",
    accessorKey: "coordinator",
    hidden: { sm: true, md: true, xl: true },
    filter: false,
  },
  {
    header: "Issue Date",
    accessorKey: "issue_date",
    hidden: { sm: true, md: true, xl: false },
    filter: false,
  },
  {
    header: "Mode",
    accessorKey: "mode_of_ticket",
    hidden: { sm: true, md: true, xl: false },
    filter: true,
  },
  {
    header: "Client",
    accessorKey: "client",
    hidden: { sm: true, md: false, xl: false },
    filter: true,
  },
  {
    header: "Status",
    accessorKey: "status",
    hidden: { sm: true, md: true, xl: false },
    filter: true,
  },
];
