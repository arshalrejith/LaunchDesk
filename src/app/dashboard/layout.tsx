import {
  LayoutDashboard,
  BarChart3,
  Globe,
  Building2,
  FolderTree,
  Package,
  BookOpen,
  Image as ImageIcon,
  Tag,
  Percent,
  Megaphone,
  MessageSquare,
  Search,
  History,
  Settings,
  Palette,
} from "lucide-react";
import { requireClientSession } from "@/lib/scope";
import { prisma } from "@/lib/prisma";
import DashboardSidebar from "./sidebar";
import { terminology } from "@/lib/businessConfig";

function makeNavGroups(category: string | null | undefined) {
  const t = terminology(category);
  return [
    { label: "Overview", items: [
      { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} strokeWidth={2} />, exact: true },
      { href: "/dashboard/analytics", label: "Analytics", icon: <BarChart3 size={16} strokeWidth={2} /> },
    ]},
    { label: "Site content", items: [
      { href: "/dashboard/website", label: "Website", icon: <Globe size={16} strokeWidth={2} /> },
      { href: "/dashboard/builder", label: "Page Builder", icon: <Palette size={16} strokeWidth={2} /> },
      { href: "/dashboard/business", label: "Business details", icon: <Building2 size={16} strokeWidth={2} /> },
      { href: "/dashboard/categories", label: t.category, icon: <FolderTree size={16} strokeWidth={2} /> },
      { href: "/dashboard/products", label: t.items, icon: <Package size={16} strokeWidth={2} /> },
      { href: "/dashboard/catalogue", label: t.item === "Service" ? "Service catalogue" : t.item === "Menu item" ? "Menu catalogue" : "Catalogue", icon: <BookOpen size={16} strokeWidth={2} /> },
      { href: "/dashboard/gallery", label: "Gallery", icon: <ImageIcon size={16} strokeWidth={2} /> },
    ]},
    { label: "Promote", items: [
      { href: "/dashboard/offers", label: "Offers", icon: <Tag size={16} strokeWidth={2} /> },
      { href: "/dashboard/discounts", label: "Discounts", icon: <Percent size={16} strokeWidth={2} /> },
      { href: "/dashboard/campaigns", label: "Campaigns", icon: <Megaphone size={16} strokeWidth={2} /> },
    ]},
    { label: "Manage", items: [
      { href: "/dashboard/messages", label: "Messages", icon: <MessageSquare size={16} strokeWidth={2} /> },
      { href: "/dashboard/seo", label: "SEO", icon: <Search size={16} strokeWidth={2} /> },
      { href: "/dashboard/history", label: "History", icon: <History size={16} strokeWidth={2} /> },
      { href: "/dashboard/settings", label: "Settings", icon: <Settings size={16} strokeWidth={2} /> },
    ]},
  ];
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { client, website } = await requireClientSession();
  const published = website.publishStatus === "PUBLISHED";
  const businessName = website.settings?.businessName ?? client.slug;
  // Surfaced as a badge on "Messages" so a new enquiry from a real customer
  // doesn't sit unnoticed until the client happens to click in.
  const unhandledEnquiries = await prisma.enquiry.count({ where: { websiteId: website.id, handled: false } });

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[248px_1fr] bg-[var(--surface-muted)]">
      <DashboardSidebar groups={makeNavGroups(website.settings?.category)} businessName={businessName} published={published} unhandledEnquiries={unhandledEnquiries} />
      <main className="min-w-0 p-5 md:p-9 animate-fade-in">{children}</main>
    </div>
  );
}
