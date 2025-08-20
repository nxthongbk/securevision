import { Avatar, SxProps, Typography, TypographyProps } from '@mui/material';

import React from 'react';

interface CardProps {
  classNameDivCard?: string;
  classNameDivTitleSection?: string;
  classNameDivTitle?: string;
  avatar: React.ReactNode;
  title: string;
  titleProps?: TypographyProps;
  subTitle?: string;
  subTitleProps?: TypographyProps;
  bodyText?: string;
  bodyProps?: TypographyProps;
  avatarStyles?: SxProps;
}

Card.defaultProps = {
  subTitle: '',
  bodyText: '',
  titleProps: { variant: 'h6' },
  subTitleProps: { variant: 'body1', color: 'var(--text-secondary)' },
  bodyProps: { variant: 'body1' },
  classNameDivCard: '',
  classNameDivTitleSection: '',
  classNameDivTitle: '',
  avatarStyles: { width: 48, height: 48, backgroundColor: 'var(--primary)' }
};

function Card({
  classNameDivCard: classNameDivCard,
  classNameDivTitleSection: classNameDivTitleSection,
  classNameDivTitle: classNameDivTitle,
  avatar,
  title,
  titleProps,
  subTitle,
  subTitleProps,
  bodyText,
  bodyProps,
  avatarStyles: avatarStyles
}: CardProps) {
  return (
    <div className={`group flex flex-col rounded-xl ${classNameDivCard}`}>
      <div className={`flex  ${classNameDivTitleSection}`}>
        <Avatar sx={avatarStyles}>{avatar}</Avatar>
        <div className={`flex flex-col ${classNameDivTitle}`}>
          <Typography {...titleProps}>{title}</Typography>
          <Typography {...subTitleProps}>{subTitle}</Typography>
        </div>
      </div>
      <Typography {...bodyProps}>{bodyText}</Typography>
    </div>
  );
}

export default Card;
