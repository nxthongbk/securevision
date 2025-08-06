import { ReactNode } from 'react';
import SearchBox from '~/components/SearchBox';

interface Props {
  setKeyword: any;
  keyword: string;
  btnComponent?: ReactNode;
}

const DrawerHeader = ({ keyword, setKeyword, btnComponent }: Props) => {
  return (
    <div className='w-full flex justify-between items-center'>
      <SearchBox keyword={keyword} setKeyword={setKeyword} id='inputSearchTabs' />
      {btnComponent}
    </div>
  );
};

export default DrawerHeader;
