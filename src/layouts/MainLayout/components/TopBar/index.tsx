import TopBarSVG from '~/assets/topbar/topbar.svg';

const TopBar = () => {
  return (
    <div
      className="fixed top-0 left-1/2 -translate-x-1/2 w-[110%] max-w-none 
                 pointer-events-none select-none z-40"
    >
      <img
        src={TopBarSVG}
        alt="Top Bar Logo"
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default TopBar;
