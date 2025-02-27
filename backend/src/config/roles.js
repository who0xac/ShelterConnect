const ROLES = {
  ADMIN: 1,
  MANAGER: 2,
  STAFF: 3,
};

const PAGE_ACCESS = {
  [ROLES.ADMIN]: [
    "Dashboard",
    "Tenants",
    "Properties",
    "Agents",
    "RegisteredRSL",
    "Staff",
    "Settings",
  ],
  [ROLES.MANAGER]: ["Dashboard", "Tenants", "Properties", "Staff"],
  [ROLES.STAFF]: ["Dashboard", "Tenants", "Properties"],
};

export { ROLES, PAGE_ACCESS };
