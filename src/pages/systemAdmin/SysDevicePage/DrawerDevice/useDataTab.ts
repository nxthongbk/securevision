import { useEffect, useState } from 'react';

type TProps = {
  data: any[];
  keyword: string;
  page: number;
  size: number;
};
function paginateArray(array: any[], size: number, page: number) {
  // Adjust page number to 0-based index
  --page;
  return array?.slice(page * size, (page + 1) * size);
}
export const useDataTab = (props: TProps) => {
  const { data, keyword, page, size } = props;
  const [resultData, setResultData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (keyword) {
      const arrSearch = data.filter((item) => {
        const key = item.key?.toLowerCase();
        const value = JSON.stringify(item.value)?.toLowerCase();
        const normalizedKeyword = keyword.toLowerCase();
        return key?.includes(normalizedKeyword) || value?.includes(normalizedKeyword);
      });

      const result = paginateArray(arrSearch, size, page);
      setResultData(result);
      setTotal(arrSearch?.length);
    } else {
      const result = paginateArray(data, size, page);
      setResultData(result);
      setTotal(data?.length);
    }
  }, [keyword, page, size, data]);

  return { resultData, total };
};
