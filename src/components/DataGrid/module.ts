import { DataGridProps, GridColDef, GridColumnVisibilityModel, GridRowsProp } from '@mui/x-data-grid';

import { ReactNode } from 'react';

export interface CustomDataGridProps {
  apiRef?: any;
  getRowClassName?: any;
  renderCell?: any;
  size?: number;
  setSize?: any;
  rows?: GridRowsProp;
  columns?: GridColDef[];
  page?: number;
  setPage?: any;
  slots?: DataGridProps['slots'];
  headerComponent?: ReactNode;
  showPagination?: boolean;
  explainName?: string;
  total?: number;
  loading?: boolean;
  handleRowClick?: any;
  checkboxSelection?: any;
  onSelectionModelChange?: any;
  disableVirtual?: boolean;
  experimentalFeatures?: any;
  columnGroupingModel?: any;
  headerHeight?: any;
  rowHeight?: any;
  emptyMessage?: string;
  columnsVisible?: GridColumnVisibilityModel;
  pageSizeOptions?: any;
  isFillter?: boolean;
  handleCellClick?: any;
}

export interface FormData {
  name?: string;
  tax?: string;
  email?: string;
  username?: string;
  phone?: string;
  password?: string;
  avatarUrl?: string;
}
