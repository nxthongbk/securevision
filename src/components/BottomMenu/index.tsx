import React, { useState } from 'react';
import './style.scss';
import {
  Lightbulb,
  VideoCamera,
  Lightning,
  FireExtinguisher,
  Leaf,
  Drop,
  Door,
  SunDim,
  SquaresFour,
  TrafficSignal,
  ThermometerHot,
  LetterCircleP,
  ShieldCheck,
} from '@phosphor-icons/react';

interface MenuItem {
  label: string;
  path?: string;
  icon?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  lightbulb: <Lightbulb size={32} />,
  video: <VideoCamera size={32} />,
  bolt: <Lightning size={32} />,
  'fire-extinguisher': <FireExtinguisher size={32} />,
  leaf: <Leaf size={32} />,
  tint: <Drop size={32} />,
  parking: <LetterCircleP size={32} />,
  'door-closed': <Door size={32} />,
  'solar-panel': <SunDim size={32} />,
  'street-light': <TrafficSignal size={32} />,
  safety: <ShieldCheck size={32} />,
  hvac: <ThermometerHot size={32} />,
};

interface BottomMenuProps {
  items: MenuItem[];
  onMenuClick?: (path?: string) => void;
  activePath?: string;
  bottomBarBg?: string;
  onCenterClick?: () => void;
}

const BottomMenu: React.FC<BottomMenuProps> = ({
  items,
  onMenuClick,
  activePath,
  bottomBarBg,
  onCenterClick,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleCenterClick = () => {
    if (onCenterClick) {
      onCenterClick();
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="bottom-menu-wrapper">
      <button
        className="bottom-menu-center-btn"
        onClick={handleCenterClick}
        aria-label="Menu"
        type="button"
      >
        <SquaresFour size={40} />
      </button>
      {showModal && (
        <div className="bottom-menu-modal" onClick={() => setShowModal(false)}>
          <div className="bottom-menu-modal-content" onClick={e => e.stopPropagation()}>
            <button className="bottom-menu-modal-close" onClick={() => setShowModal(false)}>
              &times;
            </button>

            <h3>Master Dashboard</h3>
            <div className="bottom-menu-modal-list">
              {items.map(item => (
                <div
                  key={item.label}
                  className={
                    'bottom-menu-modal-list-item' + (item.path === activePath ? ' active' : '')
                  }
                  onClick={() => {
                    setShowModal(false);
                    if (item.path && onMenuClick) onMenuClick(item.path);
                  }}
                >
                  {item.icon && iconMap[item.icon] ? (
                    <span>{iconMap[item.icon]}</span>
                  ) : (
                    item.icon && <i className={item.icon} aria-hidden="true"></i>
                  )}
                  <span className="item-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="bottom-bar">
        <img
          src={bottomBarBg}
          alt="Bottom Bar"
          style={{
            position: 'fixed',
            bottom: 0,
            width: '100vw',
            zIndex: 100,
            paddingRight: '2px',
            paddingLeft: '2px',
            paddingBottom: '1px',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default BottomMenu;
