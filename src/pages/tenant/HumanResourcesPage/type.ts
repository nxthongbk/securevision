export interface HrItem {
  id: string;
  code: number;
  username: string;
  phone: string;
  name: string;
  permissionGroup: Record<string, string | string[]>;
  status: string;
  avatarUrl: string;
  locations: Record<string, string>[];
  assignAllLocations: boolean;
}

interface UpsertProps {
  forceOpen?: boolean;
  onClose?: () => void;
  tenantCode?: string;
}

export interface UpsertEmployeeProps extends UpsertProps {
  staffId?: string;
}

export interface UpsertPermissionGroupProps extends UpsertProps {
  permissionGroupId?: string;
}
