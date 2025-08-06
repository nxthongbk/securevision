import './styles.scss';

export default function LoadingSuspense() {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className='atom-spinner'>
        <div className='spinner-inner'>
          <div className='spinner-line'></div>
          <div className='spinner-line'></div>
          <div className='spinner-line'></div>
          <div className='spinner-circle'>&#9679;</div>
        </div>
      </div>
    </div>
  );
}
