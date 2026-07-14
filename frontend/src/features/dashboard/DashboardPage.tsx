import StatCardsRow from './components/StatCardsRow';
import IncomeChart from './components/IncomeChart';
import PendingRequests from './components/PendingRequests';
import RecentPayments from './components/RecentPayments';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <StatCardsRow />
      <IncomeChart />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PendingRequests />
        <RecentPayments />
      </div>
    </div>
  );
}
