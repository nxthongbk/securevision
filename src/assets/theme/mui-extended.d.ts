import '@mui/material/styles/createPalette';
import '@mui/material/Typography';
import '@mui/material/Button';

declare module '@mui/material/styles/createPalette' {
  export interface PaletteOptions {
    tertiary: {
      main: string;
    };
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    button1: true;
    button2: true;
    button3: true;
    h1: true;
    h2: true;
    h3: true;
    h4: true;
    h5: true;
    h6: true;
    label1: true;
    label2: true;
    label3: true;
    label4: true;
    label5: true;
    body1: true;
    body2: true;
    body3: true;
    caption1: true;
    caption2: true;
  }
}

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true;
    tablet: true;
    miniLaptop: true;
    laptop: true;
    desktop: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }
}
