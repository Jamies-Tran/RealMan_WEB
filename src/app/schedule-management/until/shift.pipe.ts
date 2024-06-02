import { Pipe, PipeTransform } from '@angular/core';
import { ShiftType, ShiftTypeNameMapping } from 'src/app/share/data-access/api/enum/shift.enum';

@Pipe({
  name: 'mapShiftTypeName',
  standalone: true,
})
export class MapShiftTypeNamePipe implements PipeTransform {
  transform(value: ShiftType): string {
    return ShiftTypeNameMapping.find(m => m.value === value)?.label ?? '';
  }
}
