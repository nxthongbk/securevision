import AlarmSummary from "./components/alarmSummary";
import LocationsSummary from "./components/locationSummary";
import UserSummary from "./components/userSummary";
import DeviceSummary from "./components/deviceSummary";

export default function ReportPage() {
  return (
    <div className="grid grid-cols-2 grid-rows-2 w-screen h-screen pt-[7vh] bg-[var(--bg)]">
      {/* Quarter 1 */}
      <div className="flex items-center justify-center border border-gray-700">
        <div className="w-full h-full">
          <AlarmSummary />
        </div>
      </div>

      {/* Quarter 2 */}
      <div className="flex items-center justify-center border border-gray-700">
        <div className="w-full h-full">
          <LocationsSummary />
        </div>
      </div>

      {/* Quarter 3 */}
      <div className="flex items-center justify-center border border-gray-700">
        <div className="w-full h-full">
          <UserSummary/>
        </div>
      </div>

      {/* Quarter 4 */}
      <div className="flex items-center justify-center border border-gray-700">
        <div className="w-full h-full">
          <DeviceSummary/>
        </div>
      </div>
    </div>
  );
}
