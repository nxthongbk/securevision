export interface ParamsGetTenant {
  page: number;
  size: number;
  keyword: string;
  status?: string;
}

export interface ParamsCreateTenant {
  avatarUrl?: string;
  name: string;
  email: string;
  username: string;
  phone: string;
}

export interface ParamsUpdateTenant  {
  id:string
  avatarUrl?: string;
  name: string;
  email: string;
  username: string;
  phone: string;
}