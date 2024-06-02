import { NameMapping } from "src/app/share/ui/dropdown.type";

export enum ShiftType {
  MORNING = "1",
  NIGHT = "2",
}

export const ShiftTypeNameMapping: NameMapping<ShiftType>[] = [
  { value: ShiftType.MORNING, label: 'Ca sáng' },
  { value: ShiftType.NIGHT, label: 'Ca tối' },
];
