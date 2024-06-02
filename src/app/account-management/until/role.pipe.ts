import { Pipe, PipeTransform } from '@angular/core';
import { RoleType, roleTypeNameMapping } from 'src/app/share/data-access/api/enum/role.enum';

@Pipe({
  name: 'mapRoleTypeName',
  standalone: true,
})
export class MapRoleTypeNamePipe implements PipeTransform {
  transform(value: RoleType): string {
    return roleTypeNameMapping.find(m => m.value === value)?.label ?? '';
  }
}
