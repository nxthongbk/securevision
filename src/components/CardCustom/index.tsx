import { PropsWithChildren } from 'react';

export default function CardCustom({ children }: PropsWithChildren) {
  return <div className='w-full h-fit bg-[#F4F5F5] rounded-[8px] p-[12px]'>{children}</div>;
}
