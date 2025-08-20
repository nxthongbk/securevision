import { UserRole } from '~/utils/constant';

export interface LocationItem {
  id: string;
  code: number;
  name: string;
  address: string;
  devices: Record<string, number>;
  tenantInfo: Record<string, string>;
  operatorInfo: Record<string, string>;
  imageUrl: string;
}

export interface ManipulationLocationProps {
  locationId?: string;
  forceOpen?: boolean;
  onClose?: () => void;
  tenantCode?: string;
  userRole: UserRole;
}
