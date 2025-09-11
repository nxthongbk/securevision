import { useRef } from 'react';
import { alpha, Button } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import IconPhosphor from '~/assets/iconPhosphor';

const CarouselCustom = ({ children }) => {
  const carouselRef = useRef(null);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
    }
  };

  return (
    <div>
      <Carousel arrows={false} ref={carouselRef} responsive={responsive}>
        {children}
      </Carousel>
      <div className='flex items-center justify-end gap-2 p-2'>
        <Button
          id='action-button'
          variant='contained'
          disableElevation
          onClick={handlePrev}
          className='h-[32px] !min-w-[32px] !p-0 !text-[var(--text-primary)]'
          sx={{ bgcolor: '#00BCFF', '&:hover': { bgcolor: alpha('#d9e1e8', 0.8) } }}
        >
          <IconPhosphor iconName='CaretLeft' size={20} />
        </Button>

        <Button
          id='action-button'
          variant='contained'
          disableElevation
          onClick={handleNext}
          className='h-[32px] !min-w-[32px] !p-0 !text-[var(--text-primary)]'
          sx={{ bgcolor: '#00BCFF', '&:hover': { bgcolor: alpha('#d9e1e8', 0.8) } }}
        >
          <IconPhosphor iconName='CaretRight' size={20} />
        </Button>
      </div>
    </div>
  );
};

export default CarouselCustom;