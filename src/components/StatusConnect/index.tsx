const StatusConnect = ({ isConnect }: { isConnect: boolean }) => {
  return isConnect ? (
    <div className='h-3 w-3 rounded-full bg-[var(--green-500)]'></div>
  ) : (
    <div className='h-3 w-3 rounded-full bg-[var(--neutral)]'></div>
  );
};
export default StatusConnect;
