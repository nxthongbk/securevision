import { GridProps } from '@mui/material';
import { ReactNode } from 'react';

interface OptionInterface {
  id: string;
  value: any;
  name: string;
}

export interface ResizableHeaderFilter {
  id: string;
  label: string;
  isHiddenPlacehoder?: boolean;
  value: any;
  onChange(e: any): void;
  placeholder: string;
  option: OptionInterface[];
  isRangeFilter?: boolean;
  isDateRangeFilter?: boolean;
  isLazyLoad?: boolean;
  onScroll?: (e: any) => Promise<void>;
  sizes?: {
    mobile?: GridProps['mobile'];
    tablet?: GridProps['tablet'];
    miniLaptop?: GridProps['miniLaptop'];
    laptop?: GridProps['laptop'];
    desktop?: GridProps['desktop'];
  };
}

export interface ResizableHeaderProps {
  filter?: ResizableHeaderFilter[];
  disableResetFilter?: boolean;
  handleResetFilter?(): void;
  filterFullwidth?: boolean;
  isSearch: boolean;
  setKeyword: any;
  keyword: string;
  title: string;
  btnPopup?: ReactNode;
}
