export interface IFilterInterface {
  id: string;
  label: string;
  isHiddenPlacehoder?: boolean;
  value: any;
  onChange(e: any): void;
  placeholder: string;
  option: IOptionInterface[];
  isRangeFilter?: boolean;
  isDateRangeFilter?: boolean;
  isLazyLoad?: boolean;
  onScroll?: (e: any) => Promise<void>;
}

export interface IOptionInterface {
  id: string;
  value: any;
  name: string;
}
