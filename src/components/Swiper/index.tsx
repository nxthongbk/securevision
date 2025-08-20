import 'swiper/scss';
import 'swiper/css/bundle';

import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';

import React from 'react';

interface SwiperComponentProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  swiperSettings?: SwiperProps;
}

const SwiperCustom = <T,>({ items, renderItem, swiperSettings }: SwiperComponentProps<T>) => {
  return (
    <Swiper {...swiperSettings}>
      {items.map((item, index) => (
        <SwiperSlide key={index}>{renderItem(item, index)}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperCustom;
