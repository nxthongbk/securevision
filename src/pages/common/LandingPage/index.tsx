import './styled.scss';

import {
  AddConfigGapContactSection,
  AddConfigGapHeroSection,
  AddConfigGapReasonSection,
  AddConfigPaddingHeroSectionVideo,
  AddConfigPaddingX,
  AddConfigPaddingXContactImage,
  AddConfigPaddingY100,
  AddConfigPaddingY120,
  AddConfigSizeIcon,
  AddConfigSubTitleHeroSecTion,
  AddConfigTitleContactSection,
  AddConfigTitleHeroSecTion,
  AddConfigTitleIntroSection,
  AddConfigTitleSolutionSection,
  AddConfigTitleVideoHeroSecTion,
  AddConfigWidthIntroSection
} from './styled';
import { Autoplay, Pagination } from 'swiper/modules';
import { Drop, EnvelopeSimple, FireSimple, Lightning, LightningA, Monitor, Phone, Wrench } from '@phosphor-icons/react';
import { Grid, Link, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import ButtonCustom from '~/components/ButtonCustom';
import Card from './components/Card';
import ContactBackground from '~/assets/images/svg/LandingPage/ContactBackground.svg';
import HereSectionVideo from '~/assets/images/png/LandingPageVideo.png';
import Image1 from '~/assets/images/svg/LandingPage/HeroSection/Image1.svg';
import Image2 from '~/assets/images/svg/LandingPage/HeroSection/Image2.svg';
import Image3 from '~/assets/images/svg/LandingPage/HeroSection/Image3.svg';
import Image4 from '~/assets/images/svg/LandingPage/HeroSection/Image4.svg';
import Logo from '~/assets/images/svg/LandingPage/LogosCity.svg';
import ROUTES from '~/constants/routes.constant';
import ReasonBackground from '~/assets/images/svg/LandingPage/ReasonBackground.svg';
import SwiperCustom from '../../../components/Swiper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.down('desktop'));
  const isMiniLaptop = useMediaQuery(theme.breakpoints.down('miniLaptop'));
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const [video, setVideo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get(
        'https://scity.innovation.com.vn/api/storage/files/system/landing-video.mp4',
        {
          params: {
            Range: ''
          },
          headers: {
            Accept: '*/*'
          },
          responseType: 'blob'
        }
      )
      .then((response) => {
        const URL = window.URL || window.webkitURL;
        const tempUrl = URL.createObjectURL(new Blob([response.data], { type: 'video/mp4' }));
        setVideo(tempUrl);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching the video:', error);
        setLoading(false);
      });
  }, []);

  const handleScroll = () => {
    const scrollTop = document.getElementById('scroll').scrollTop;
    setIsFixed(scrollTop >= 100);
  };

  useEffect(() => {
    const element = document.getElementById('scroll');
    element?.addEventListener('scroll', handleScroll);

    return () => {
      element?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate(ROUTES.LOGIN);
  };

  const solutionCardData = useMemo(
    () => [
      {
        avatar: (
          <FireSimple
            size={isTablet ? 28 : 32}
            className={isTablet ? '' : 'transition-transform duration-500 group-hover:rotate-45'}
          />
        ),
        title: 'Cảnh báo cháy nổ',
        bodyText:
          'Tính năng cảnh báo sự cố cháy nổ tự động. Gửi cảnh báo lập tức thông qua SMS, cuộc gọi tự động,... để kịp thời xử lý sự cố.'
      },
      {
        avatar: (
          <Lightning
            size={isTablet ? 28 : 32}
            className={isTablet ? '' : 'transition-transform duration-500 group-hover:rotate-45'}
          />
        ),
        title: 'Cảnh báo sự cố điện',
        bodyText:
          'Tích hợp hệ thống IoT vào hệ thống điện để kiểm tra các thông số theo thời gian thực. Tự động phát hiện các bất thường theo từng khu vực cục bộ.'
      },
      {
        avatar: (
          <Drop
            size={isTablet ? 28 : 32}
            className={isTablet ? '' : 'transition-transform duration-500 group-hover:rotate-45'}
          />
        ),
        title: 'Cảnh báo sự cố nước',
        bodyText:
          'Tích hợp hệ thống IoT vào nguồn nước cấp và nước thải. Tự động báo cáo các chuẩn đoán rò rì và đóng mở nguồn nước cục bộ khi có sự cố.'
      },
      {
        avatar: (
          <LightningA
            size={isTablet ? 28 : 32}
            className={isTablet ? '' : 'transition-transform duration-500 group-hover:rotate-45'}
          />
        ),
        title: 'Hệ thống điện tự động',
        bodyText:
          'Tính năng tự động tắt mở đèn và các thiết bị theo ngữ cảnh môi trường dựa vào thông số môi trường các cấu hình đã được thiết lập.'
      },
      {
        avatar: (
          <Monitor
            size={isTablet ? 28 : 32}
            className={isTablet ? '' : 'transition-transform duration-500 group-hover:rotate-45'}
          />
        ),
        title: 'Hệ thống giám sát AI',
        bodyText:
          'Camera AI phân thích dữ liệu chuyên sâu cho các giải pháp an ninh, kiểm soát sự cố, thống kê dữ liệu người và phương tiện theo thời gian thực.'
      },
      {
        avatar: (
          <Wrench
            size={isTablet ? 28 : 32}
            className={isTablet ? '' : 'transition-transform duration-500 group-hover:rotate-45'}
          />
        ),
        title: 'Tự động hóa bảo trì thiết bị',
        bodyText:
          'Hệ thống IoT lưu trữ mọi dữ liệu thời gian và tình trạng hoạt động của từng thiết bị để tự động lên lịch bảo trì và sữa chữa cho kỹ thuật viên.'
      }
    ],
    [isTablet]
  );

  const introCardData = useMemo(
    () => [
      {
        avatar: (
          <Typography variant='h4' color='var(--white)'>
            1
          </Typography>
        ),
        title: 'Không cần thay thế hệ thống cũ',
        subTitle:
          'Chúng tôi cung cấp giải pháp tích hợp IoT, AI và quy trình tự động hóa tiên tiến vào chính hệ thống hiện có của khu đô thị. Không cần lắp mới, tiết kiệm chi phí.'
      },
      {
        avatar: (
          <Typography variant='h4' color='var(--white)'>
            2
          </Typography>
        ),
        title: 'Tự động hóa mọi quy trình',
        subTitle:
          'Tự động hóa mọi quy trình cảnh báo và xử lý sự cố. Tự động phát hiện sự cố và phát động cảnh báo, gửi cảnh báo SMS, email, cuộc gọi tự động,... đến các bên liên quan.'
      },
      {
        avatar: (
          <Typography variant='h4' color='var(--white)'>
            3
          </Typography>
        ),
        title: 'Phần mềm vạn năng cho tất cả mọi người',
        subTitle:
          'Chúng tôi cung cấp một hệ sinh thái phần mềm bao gồm website, ứng dụng đặc thù cho từng nhóm người dùng như chủ đầu tư, ban quản lý, bảo an, lễ tân, cư dân, kỹ thuật viên,...'
      }
    ],
    []
  );

  const imageData = useMemo(
    () => [
      { src: Image1, alt: 'Image 1' },
      { src: Image2, alt: 'Image 2' },
      { src: Image3, alt: 'Image 3' },
      { src: Image4, alt: 'Image 4' }
    ],
    []
  );

  return (
    <div className='overflow-y-scroll h-[100vh]  w-full' id='scroll'>
      <header
        className={`flex items-center w-full fixed bg-white z-10 ${isFixed && 'shadow-[0_2px_12px_0_#1E20201F]'}`}
      >
        <AddConfigPaddingX className='flex justify-between items-center w-full h-[72px]'>
          <img alt='logo' src={Logo} className={isMiniLaptop ? 'w-[40px] h-[40px]' : 'w-[48px] h-[48px]'} />
          <ButtonCustom
            onClick={handleLoginClick}
            variant='contained'
            className={`${isMiniLaptop ? 'h-10' : 'h-12'}`}
            sx={{ padding: isMiniLaptop ? '10px 16px 10px 16px' : '10px 24px 10px 24px' }}
          >
            <Typography variant={isMiniLaptop ? 'button3' : 'button1'}>Đăng nhập</Typography>
          </ButtonCustom>
        </AddConfigPaddingX>
      </header>

      <main>
        {/* Header */}
        <div className='h-[72px] bg-white'></div>
        {/* First div */}
        <div
          className={`relative ${isTablet ? 'h-fit' : 'h-[600px]'} flex flex-col items-center justify-center w-full`}
        >
          <div className='flex w-full h-full'>
            {loading ? (
              <img
                src={HereSectionVideo}
                alt='Loading...'
                className='absolute top-0 left-0 object-cover w-full h-full'
              />
            ) : (
              <video
                src={video}
                autoPlay
                muted
                loop
                className='absolute top-0 left-0 object-cover w-full h-full pointer-events-none'
              />
            )}
            <div className='absolute top-0 left-0 w-full h-full pointer-events-none bg-[rgba(0,0,0,0.3)] z-2'></div>
            <AddConfigPaddingHeroSectionVideo className='relative flex flex-col items-center justify-center w-full h-full gap-10 px-1 z-3'>
              <AddConfigTitleVideoHeroSecTion
                align='center'
                color='var(--white)'
                className='drop-shadow-[0_0_24px_rgba(0,0,0,0.8)]'
              >
                Quản lý khu đô thị thông minh cùng <span style={{ color: 'var(--primary)' }}>sCity</span>
              </AddConfigTitleVideoHeroSecTion>
              <ButtonCustom
                href='#contactSection'
                variant='contained'
                className={`${isMiniLaptop ? 'h-10' : 'h-12'}`}
                sx={{ padding: isMiniLaptop ? '10px 16px 10px 16px' : '10px 24px 10px 24px' }}
              >
                <Typography variant='button1'>Liên hệ với chúng tôi</Typography>
              </ButtonCustom>
            </AddConfigPaddingHeroSectionVideo>
          </div>
        </div>

        {/* Second div */}
        <AddConfigPaddingX>
          <AddConfigPaddingY100>
            <AddConfigGapHeroSection
              className={`${isMiniLaptop ? 'flex flex-col justify-center items-center' : 'flex'}`}
            >
              <Grid container>
                <Grid item miniLaptop={6}>
                  <SwiperCustom
                    items={imageData}
                    renderItem={(image) => <img src={image.src} alt={image.alt} className='w-full h-fit' />}
                    swiperSettings={{
                      style: {
                        width: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 2px 12px rgba(30,32,32,0.12)',
                        display: isMiniLaptop ? 'none' : ''
                      },
                      modules: [Autoplay, Pagination],
                      autoplay: {
                        delay: 3000,
                        disableOnInteraction: false
                      },
                      loop: true
                    }}
                  />
                </Grid>
                <Grid item miniLaptop>
                  <div
                    className={`${isMiniLaptop ? 'items-center justify-center text-center' : 'pl-20'} flex flex-col ${isTablet ? 'gap-6' : 'gap-10'} `}
                  >
                    <div className={`flex flex-col ${isTablet ? 'gap-4' : 'gap-8'}`}>
                      <AddConfigTitleHeroSecTion>Tầm nhìn sứ mệnh</AddConfigTitleHeroSecTion>
                      <div className='flex flex-col gap-4'>
                        <AddConfigSubTitleHeroSecTion color='var(--text-secondary)'>
                          Chúng tôi cung cấp hệ thống cảnh báo các sự cố cháy nổ, sự cố điện nước,... Các hệ thống bật
                          tắt đèn, thiết bị hoàn toàn tự động hóa và thông minh nhờ tích hợp hệ thống IoT và AI.
                        </AddConfigSubTitleHeroSecTion>
                        <AddConfigSubTitleHeroSecTion color='var(--text-secondary)'>
                          Chúng tôi giúp khu đô thị của bạn an toàn hơn, thông minh hơn, hoạt động hiệu quả hơn. Giúp
                          bạn tiết kiệm tối đa chi phí quản lý và nguồn nhân lực.
                        </AddConfigSubTitleHeroSecTion>
                      </div>
                    </div>
                  </div>
                </Grid>
              </Grid>
              <div className={`${isMiniLaptop ? '' : 'hidden'} ${isTablet ? 'w-full' : 'w-[70%]'}`}>
                <SwiperCustom
                  items={imageData}
                  renderItem={(image) => <img src={image.src} alt={image.alt} className='w-full h-fit' />}
                  swiperSettings={{
                    style: { width: '100%', borderRadius: '12px', boxShadow: '0 2px 12px rgba(30,32,32,0.12)' },
                    modules: [Autoplay, Pagination],
                    autoplay: {
                      delay: 3000,
                      disableOnInteraction: false
                    },
                    loop: true
                  }}
                />
              </div>
            </AddConfigGapHeroSection>
          </AddConfigPaddingY100>
        </AddConfigPaddingX>

        {/* Third div */}
        <AddConfigPaddingX
          style={{
            backgroundImage: `url(${ReasonBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            paddingLeft: isTablet && 0,
            paddingRight: isTablet && 0
          }}
        >
          <AddConfigPaddingY100>
            <div
              className={`flex ${isMiniLaptop ? `flex-col justify-center items-center ${isTablet ? 'gap-10' : 'gap-14'}` : 'justify-between'}`}
            >
              <AddConfigTitleIntroSection color='var(--white)'>Thấu hiểu khách hàng</AddConfigTitleIntroSection>
              {isTablet ? (
                <div className='flex flex-col w-full gap-5'>
                  <SwiperCustom
                    items={introCardData}
                    renderItem={(card) => (
                      <Card
                        classNameDivTitleSection={`w-full p-4 h-[308px] gap-4 rounded-[32px] bg-white items-start`}
                        classNameDivTitle='gap-1'
                        avatar={card.avatar}
                        avatarStyles={{ width: 48, height: 48, backgroundColor: 'var(--primary)' }}
                        title={card.title}
                        titleProps={{ variant: 'label1' }}
                        subTitle={card.subTitle}
                        subTitleProps={{ variant: 'body2', color: 'var(--text-secondary)' }}
                      />
                    )}
                    swiperSettings={{
                      style: { width: '100%', height: '100%' },
                      modules: [Pagination],
                      pagination: {
                        el: '.intro-section-pagination',
                        clickable: true
                      },
                      loop: true,
                      className: 'intro-section-swiper'
                    }}
                  />
                  <div className='text-center '>
                    <div className='intro-section-pagination' />
                  </div>
                </div>
              ) : (
                <>
                  <div className='flex flex-col gap-6'>
                    {introCardData.map((card) => (
                      <AddConfigWidthIntroSection>
                        <Card
                          classNameDivCard='w-full'
                          classNameDivTitleSection={`items-center py-5 px-8 gap-5 rounded-[100px] bg-white`}
                          classNameDivTitle='gap-2'
                          avatar={card.avatar}
                          avatarStyles={{ width: 64, height: 64, backgroundColor: 'var(--primary)' }}
                          title={card.title}
                          titleProps={{ variant: 'h5' }}
                          subTitle={card.subTitle}
                          subTitleProps={{ variant: 'body1', color: 'var(--text-secondary)' }}
                        />
                      </AddConfigWidthIntroSection>
                    ))}
                  </div>
                </>
              )}
            </div>
          </AddConfigPaddingY100>
        </AddConfigPaddingX>

        {/* Fourth div */}
        <AddConfigPaddingX style={{ paddingLeft: isTablet && 0, paddingRight: isTablet && 0 }}>
          <AddConfigPaddingY120>
            <AddConfigGapReasonSection className='flex flex-col'>
              <AddConfigTitleSolutionSection align='center'>Các tính năng nổi bật</AddConfigTitleSolutionSection>
              {isTablet ? (
                <div className='flex flex-col gap-4'>
                  <SwiperCustom
                    items={solutionCardData}
                    renderItem={(card) => (
                      <Card
                        classNameDivCard='h-[200px] w-full p-3 gap-3 shadow-[0_0_6px_0_#1E202029]'
                        classNameDivTitleSection='items-center gap-3'
                        avatar={card.avatar}
                        avatarStyles={{ width: 40, height: 40, backgroundColor: 'var(--primary)' }}
                        title={card.title}
                        titleProps={{ variant: 'label1' }}
                        bodyText={card.bodyText}
                        bodyProps={{ variant: 'body2' }}
                      />
                    )}
                    swiperSettings={{
                      style: { height: '100%', width: '100%' },
                      modules: [Pagination],
                      pagination: {
                        el: '.solution-section-pagination',
                        clickable: true
                      },
                      loop: true,
                      className: 'solution-section-swiper'
                    }}
                  />
                  <div className='text-center'>
                    <div className='solution-section-pagination' />
                  </div>
                </div>
              ) : (
                <Grid container rowSpacing={isMiniLaptop ? 3 : 5} columnSpacing={3}>
                  {solutionCardData.map((card, index) => (
                    <Grid item miniLaptop={4} tablet={6} key={index}>
                      <Card
                        classNameDivCard={`h-full p-6 gap-6 group border border-[#C9CCCF] hover:border-[#007ef5] `}
                        classNameDivTitleSection='items-center gap-3'
                        avatar={card.avatar}
                        title={card.title}
                        bodyText={card.bodyText}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </AddConfigGapReasonSection>
          </AddConfigPaddingY120>
        </AddConfigPaddingX>

        {/* Fifth div */}
        <AddConfigPaddingX id='contactSection'>
          <AddConfigPaddingY120 style={{ paddingTop: 0 }}>
            <div className='gap-10'>
              <AddConfigPaddingXContactImage
                className={`${isTablet ? 'py-10' : 'py-14'} h-full rounded-xl`}
                style={{
                  backgroundImage: `url(${ContactBackground})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div
                  className={`${isDesktop ? 'flex flex-col text-center' : 'flex justify-between'} ${isTablet ? 'gap-8' : 'gap-14'}`}
                >
                  <AddConfigTitleContactSection>Liên hệ với chúng tôi</AddConfigTitleContactSection>
                  <div className={`${isMiniLaptop ? 'flex flex-col items-center' : 'flex'} justify-center`}>
                    <AddConfigGapContactSection className={`${isMiniLaptop ? 'flex flex-col items-start' : 'flex'}`}>
                      <div className={`flex gap-4 items-center justify-center`}>
                        <AddConfigSizeIcon className={`flex rounded-lg bg-[#007EF5] items-center justify-center`}>
                          <Phone
                            height={isTablet ? 24 : 32}
                            width={isTablet ? 24 : 32}
                            color='var(--white)'
                            weight='fill'
                          />
                        </AddConfigSizeIcon>
                        <div className={`${isTablet ? 'gap-1' : 'gap-2'} flex flex-col items-start`}>
                          {isTablet ? (
                            <>
                              <Link href={`tel:0383927958`} variant='label2' color='#3A3D41' underline='none'>
                                0908 052 510 (Phạm Đức Minh)
                              </Link>

                            </>
                          ) : (
                            <>
                              <Typography variant='h6'>0908 052 510 (Phạm Đức Minh)</Typography>
                            </>
                          )}
                        </div>
                      </div>
                      <div className='flex items-center gap-4'>
                        <AddConfigSizeIcon className={`flex rounded-lg bg-[#007EF5] items-center justify-center`}>
                          <EnvelopeSimple
                            height={isTablet ? 24 : 32}
                            width={isTablet ? 24 : 32}
                            color='var(--white)'
                            weight='fill'
                          />
                        </AddConfigSizeIcon>
                        <div className={`${isTablet ? 'gap-1' : 'gap-2'} flex flex-col  items-start`}>
                          <Typography variant={isTablet ? 'label2' : 'h6'}>minhpham@vftrader.com</Typography>

                        </div>
                      </div>
                    </AddConfigGapContactSection>
                  </div>
                </div>
              </AddConfigPaddingXContactImage>
            </div>
          </AddConfigPaddingY120>
        </AddConfigPaddingX>
      </main>

      <footer
        className={`${isTablet ? 'py-4' : 'py-8'}`}
        style={{ backgroundColor: 'var(--grey-primary-700)', color: 'var(--white' }}
      >
        <AddConfigPaddingX>
          <div className={` ${isTablet ? 'gap-4' : 'flex gap-8 items-center justify-between'}`}>
            <div className={isTablet ? 'hidden' : 'flex items-center'}>
              <img alt='logo' src={Logo} className='w-[40px] h-[40px]' />
            </div>
            <Typography variant='body2'>2024 TMA Solutions © All Rights Reserved</Typography>
          </div>
        </AddConfigPaddingX>
      </footer>
    </div>
  );
};

export default LandingPage;
