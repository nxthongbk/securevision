import { Typography } from '@mui/material';
//import { translationCapitalizadFirst } from '~/utils/handle-translation-and-character'

import { ReactNode } from 'react';
import { translationCapitalFirst } from '~/utils/translate';
export interface HeaderPageProps {
  title: string;
  btnPopup?: ReactNode;
}
export default function HeaderPage(props: HeaderPageProps) {
  const { title, btnPopup } = props;
  return (
    <div className='h-10 flex justify-between items-center'>
      <div>
        <Typography variant='h4'>{translationCapitalFirst(title)}</Typography>
      </div>
      <div>{btnPopup}</div>
    </div>
  );
}
