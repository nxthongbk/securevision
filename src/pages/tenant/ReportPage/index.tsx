import AlarmSummary from './components/alarmSummary';

export default function ReportPage() {
  return (
    <div className="grid grid-cols-2 grid-rows-2 w-screen h-screen pt-[7vh] bg-[var(--bg)]">
      {/* Quarter 1 */}
      <div className="flex items-center justify-center border border-gray-700">
        <div className="w-full h-full">
          <AlarmSummary />
        </div>
      </div>

      {/* Keep the rest empty or remove if not needed */}
      <div className="flex items-center justify-center border border-gray-700" />
      <div className="flex items-center justify-center border border-gray-700" />
      <div className="flex items-center justify-center border border-gray-700" />
    </div>
  );
}
