import { MagnifyingGlass } from '@phosphor-icons/react';
import { Dispatch, SetStateAction } from 'react';
import { translationCapitalFirst } from '~/utils/translate';

export default function SearchBox({ setKeyword }: { setKeyword: Dispatch<SetStateAction<string>> }) {
  return (
    <form>
      <div className='relative'>
        <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
          <MagnifyingGlass size={20} color='var(--tertiary)' />
        </div>
        <input
          type='search'
          id='default-search'
          className='block outline-none w-full min-h-10 ps-10 pr-2 text-sm text-gray-900 border border-[var(--neutral)] rounded-md bg-white '
          placeholder={translationCapitalFirst('search')}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
      </div>
    </form>
  );
}
