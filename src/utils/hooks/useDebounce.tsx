import { useEffect, useState } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // Thiết lập một timeout mỗi khi giá trị thay đổi
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Xóa timeout mỗi khi giá trị hoặc thời gian trễ thay đổi
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default useDebounce;
