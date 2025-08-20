import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const AddConfigPaddingX = styled('div')(({ theme }) => ({
  paddingLeft: '120px',
  paddingRight: '120px',
  [theme.breakpoints.down('miniLaptop')]: {
    paddingLeft: '24px',
    paddingRight: '24px'
  },
  [theme.breakpoints.down('tablet')]: {
    paddingLeft: '16px',
    paddingRight: '16px'
  }
}));

export const AddConfigPaddingY120 = styled('div')(({ theme }) => ({
  paddingTop: '100px',
  paddingBottom: '100px',
  [theme.breakpoints.down('desktop')]: {
    paddingTop: '120px',
    paddingBottom: '120px'
  },
  [theme.breakpoints.down('miniLaptop')]: {
    paddingTop: '80px',
    paddingBottom: '80px'
  },
  [theme.breakpoints.down('tablet')]: {
    paddingTop: '48px',
    paddingBottom: '48px'
  }
}));

export const AddConfigPaddingY100 = styled('div')(({ theme }) => ({
  paddingTop: '100px',
  paddingBottom: '100px',
  [theme.breakpoints.down('miniLaptop')]: {
    paddingTop: '80px',
    paddingBottom: '80px'
  },
  [theme.breakpoints.down('tablet')]: {
    paddingTop: '48px',
    paddingBottom: '48px'
  }
}));

export const AddConfigPaddingHeroSectionVideo = styled('div')(({ theme }) => ({
  paddingLeft: '120px',
  paddingRight: '120px',
  [theme.breakpoints.down('miniLaptop')]: {
    paddingLeft: '24px',
    paddingRight: '24px'
  },
  [theme.breakpoints.down('tablet')]: {
    paddingTop: '120px',
    paddingBottom: '120px',
    paddingLeft: '24px',
    paddingRight: '24px'
  }
}));

export const AddConfigPaddingXContactImage = styled('div')(({ theme }) => ({
  paddingLeft: '80px',
  paddingRight: '80px',
  [theme.breakpoints.down('miniLaptop')]: {
    paddingLeft: '40px',
    paddingRight: '40px'
  },
  [theme.breakpoints.down('tablet')]: {
    paddingLeft: '24px',
    paddingRight: '24px'
  }
}));

export const AddConfigTitleVideoHeroSecTion = styled(Typography)(({ theme }) => ({
  fontSize: '72px',
  lineHeight: '90px',
  fontWeight: '700',
  [theme.breakpoints.down('miniLaptop')]: {
    fontSize: theme.typography.h2.fontSize,
    lineHeight: theme.typography.h2.lineHeight,
    fontWeight: theme.typography.h2.fontWeight
  },
  [theme.breakpoints.down('tablet')]: {
    fontSize: theme.typography.h3.fontSize,
    lineHeight: theme.typography.h3.lineHeight,
    fontWeight: theme.typography.h3.fontWeight
  }
}));

export const AddConfigTitleHeroSecTion = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h2.fontSize,
  lineHeight: theme.typography.h2.lineHeight,
  fontWeight: theme.typography.h2.fontWeight,
  [theme.breakpoints.down('miniLaptop')]: {
    fontSize: theme.typography.h3.fontSize,
    lineHeight: theme.typography.h3.lineHeight,
    fontWeight: theme.typography.h3.fontWeight
  },
  [theme.breakpoints.down('tablet')]: {
    fontSize: theme.typography.h5.fontSize,
    lineHeight: theme.typography.h5.lineHeight,
    fontWeight: theme.typography.h5.fontWeight
  }
}));

export const AddConfigSubTitleHeroSecTion = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h5.fontSize,
  lineHeight: theme.typography.h5.lineHeight,
  fontWeight: theme.typography.h5.fontWeight,
  [theme.breakpoints.down('laptop')]: {
    fontSize: theme.typography.h6.fontSize,
    lineHeight: theme.typography.h6.lineHeight,
    fontWeight: theme.typography.h6.fontWeight
  },
  [theme.breakpoints.down('tablet')]: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '600'
  }
}));

export const AddConfigTitleIntroSection = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h2.fontSize,
  lineHeight: theme.typography.h2.lineHeight,
  fontWeight: theme.typography.h2.fontWeight,
  [theme.breakpoints.down('miniLaptop')]: {
    fontSize: theme.typography.h3.fontSize,
    lineHeight: theme.typography.h3.lineHeight,
    fontWeight: theme.typography.h3.fontWeight
  },
  [theme.breakpoints.down('tablet')]: {
    fontSize: theme.typography.h5.fontSize,
    lineHeight: theme.typography.h5.lineHeight,
    fontWeight: theme.typography.h5.fontWeight
  }
}));

export const AddConfigTitleSolutionSection = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h2.fontSize,
  lineHeight: theme.typography.h2.lineHeight,
  fontWeight: theme.typography.h2.fontWeight,
  [theme.breakpoints.down('miniLaptop')]: {
    fontSize: theme.typography.h3.fontSize,
    lineHeight: theme.typography.h3.lineHeight,
    fontWeight: theme.typography.h3.fontWeight
  },
  [theme.breakpoints.down('tablet')]: {
    fontSize: theme.typography.h5.fontSize,
    lineHeight: theme.typography.h5.lineHeight,
    fontWeight: theme.typography.h5.fontWeight
  }
}));

export const AddConfigTitleContactSection = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h3.fontSize,
  lineHeight: theme.typography.h3.lineHeight,
  fontWeight: theme.typography.h3.fontWeight,
  [theme.breakpoints.down('miniLaptop')]: {
    fontSize: theme.typography.h4.fontSize,
    lineHeight: theme.typography.h4.lineHeight,
    fontWeight: theme.typography.h4.fontWeight
  },
  [theme.breakpoints.down('tablet')]: {
    fontSize: theme.typography.h5.fontSize,
    lineHeight: theme.typography.h5.lineHeight,
    fontWeight: theme.typography.h5.fontWeight
  }
}));

export const AddConfigHeroSectionHeight = styled('div')(({ theme }) => ({
  height: '800px',
  [theme.breakpoints.down('desktop')]: {
    height: '700px'
  },
  [theme.breakpoints.down('laptop')]: {
    height: '600px'
  },
  [theme.breakpoints.down('miniLaptop')]: {
    height: 'fit-content'
  }
}));

export const AddConfigGapHeroSection = styled('div')(({ theme }) => ({
  gap: '80px',
  [theme.breakpoints.down('miniLaptop')]: {
    gap: '56px'
  },
  [theme.breakpoints.down('tablet')]: {
    gap: '40px'
  }
}));

export const AddConfigWidthIntroSection = styled('div')(({ theme }) => ({
  width: '1100px',
  [theme.breakpoints.down('desktop')]: {
    width: '792px'
  },
  [theme.breakpoints.down('laptop')]: {
    width: '686px'
  },
  [theme.breakpoints.down('tablet')]: {
    width: '100%'
  }
}));

export const AddConfigGapContactSection = styled('div')(({ theme }) => ({
  gap: '80px',
  [theme.breakpoints.down('desktop')]: {
    gap: '120px'
  },
  [theme.breakpoints.down('laptop')]: {
    gap: '80px'
  },
  [theme.breakpoints.down('miniLaptop')]: {
    gap: '40px'
  },
  [theme.breakpoints.down('tablet')]: {
    gap: '32px'
  }
}));

export const AddConfigGapReasonSection = styled('div')(({ theme }) => ({
  gap: '80px',
  [theme.breakpoints.down('miniLaptop')]: {
    gap: '56px'
  },
  [theme.breakpoints.down('tablet')]: {
    gap: '40px'
  }
}));

export const AddConfigSizeIcon = styled('div')(({ theme }) => ({
  width: '56px',
  height: '56px',
  [theme.breakpoints.down('miniLaptop')]: {
    width: '48px',
    height: '48px'
  },
  [theme.breakpoints.down('tablet')]: {
    width: '40px',
    height: '40px'
  }
}));
