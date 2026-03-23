import { setBrandConfig } from "@core/lib/brand-config";

// Override nav items for Holy Ship (core defaults are WOPR-specific)
setBrandConfig({
  navItems: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Ship", href: "/ship" },
    { label: "Approvals", href: "/approvals" },
    { label: "Connect", href: "/connect" },
    { label: "Credits", href: "/billing/credits" },
    { label: "Settings", href: "/settings/profile" },
    { label: "Admin", href: "/admin/tenants" },
  ],
});

export * from "@core/lib/brand-config";
