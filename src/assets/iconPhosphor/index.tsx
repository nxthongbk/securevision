import {
  ArrowCounterClockwise,
  ArrowsCounterClockwise,
  ArrowLeft,
  ArrowsDownUp,
  BellSimple,
  Buildings,
  Calendar,
  CalendarBlank,
  CalendarDot,
  CalendarDots,
  CaretDown,
  CaretLeft,
  CaretRight,
  ChargingStation,
  ChartLine,
  Check,
  CopySimple,
  Cpu,
  DownloadSimple,
  Fan,
  FileText,
  FileXls,
  FireSimple,
  GearSix,
  GlobeSimple,
  GridNine,
  House,
  IconWeight,
  ImageSquare,
  Info,
  Lightning,
  List,
  LockSimple,
  LockSimpleOpen,
  MagnifyingGlass,
  Monitor,
	Package,
  Password,
  PencilSimple,
  Phone,
  Plus,
	Plant,
  Sigma,
  SignIn,
  SignOut,
  Sun,
  TrashSimple,
  UploadSimple,
  Warning,
  Wind,
	Waves,
  X,
} from '@phosphor-icons/react';

import { FunctionComponent } from 'react';

export interface PropsIcon {
  iconName: string;
  size: number;
  weight?: IconWeight;
  color?: string;
  style?: any;
  className?: string;
}

const IconPhosphor: FunctionComponent<PropsIcon> = (propsIcon) => {
  const { className, color, iconName, size, weight, style } = propsIcon;
  switch (iconName) {
    case 'ArrowLeft':
      return <ArrowLeft size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'Phone':
      return <Phone size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'ArrowsDownUp':
      return <ArrowsDownUp size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'ArrowCounterClockwise':
      return <ArrowCounterClockwise size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'CopySimple':
      return <CopySimple size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'ImageSquare':
      return <ImageSquare size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'Cpu':
      return <Cpu size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'Warning':
      return <Warning size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'Info':
      return <Info size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'FireSimple':
      return <FireSimple size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'Password':
      return <Password size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'LockSimpleOpen':
      return <LockSimpleOpen size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'LockSimple':
      return <LockSimple size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'SignIn':
      return <SignIn size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'Buildings':
      return <Buildings size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'FileText':
      return <FileText size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'SignOut':
      return <SignOut size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'Check':
      return <Check size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'TrashSimple':
      return <TrashSimple size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'PencilSimple':
      return <PencilSimple size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'X':
      return <X size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'MagnifyingGlass':
      return <MagnifyingGlass size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'Plus':
      return <Plus size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'CaretLeft':
      return <CaretLeft size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'CaretRight':
      return <CaretRight size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'GridNine':
      return <GridNine size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'Fan':
      return <Fan size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'CaretDown':
      return <CaretDown size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'BellSimple':
      return <BellSimple size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'Monitor':
      return <Monitor size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'ChartLine':
      return <ChartLine size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'House':
      return <House size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'List':
      return <List size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'GlobeSimple':
      return <GlobeSimple size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'ChargingStation':
      return <ChargingStation size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'Lightning':
      return <Lightning size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'Sun':
      return <Sun size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'Wind':
      return <Wind size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'Sigma':
      return <Sigma size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'UploadSimple':
      return <UploadSimple size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'DownloadSimple':
      return <DownloadSimple size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'FileXls':
      return <FileXls size={size} weight={weight} color={color} style={style} className={className} />;
      break;
    case 'GearSix':
      return (
        <GearSix size={size} weight={weight} color={color} style={style} className={className} />
      );
      break;
    case 'CalendarBlank':
      return (
        <CalendarBlank
          size={size}
          weight={weight}
          color={color}
          style={style}
          className={className}
        />
      );
      break;

    case 'CalendarDot':
      return (
        <CalendarDot
          size={size}
          weight={weight}
          color={color}
          style={style}
          className={className}
        />
      );
      break;

    case 'CalendarDots':
      return (
        <CalendarDots
          size={size}
          weight={weight}
          color={color}
          style={style}
          className={className}
        />
      );
      break;
    case 'Calendar':
      return (
        <Calendar size={size} weight={weight} color={color} style={style} className={className} />
      );
      break;
		case 'ArrowsCounterClockwise':
			return <ArrowsCounterClockwise size={size} weight={weight} color={color} style={style} className={className} />;
			break;
		case 'Plant':
			return <Plant size={size} weight={weight} color={color} style={style} className={className} />;
			break;
		case 'Package':
			return <Package size={size} weight={weight} color={color} style={style} className={className} />;
			break;
		case 'Waves':
			return <Waves size={size} weight={weight} color={color} style={style} className={className} />;
			break;

    default:
      return <GlobeSimple size={size} weight={weight} color={color} style={style} className={className} />;
      break;
  }
};
export default IconPhosphor;
