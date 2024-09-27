import { NameMapping } from "src/app/share/ui/dropdown.type";

export enum RoleType {
  STAFF = "STAFF",
  RECEPTIONIST = "RECEPTIONIST",
  BRANCH_MANAGER = "BRANCH_MANAGER",
  SHOPOWNER = "SHOPOWNER",
  // CUSTOMER = "CUSTOMER"
}

export const roleTypeNameMapping: NameMapping<RoleType>[] = [
  { value: RoleType.STAFF, label: 'Staff' },
  { value: RoleType.RECEPTIONIST, label: 'receptionist' },
  { value: RoleType.BRANCH_MANAGER, label: 'Branch Manager' },
  // { value: RoleType.SHOP_OWNER, label: 'Shop Owner' },
  // { value: RoleType.CUSTOMER, label: 'Customer' },
];
