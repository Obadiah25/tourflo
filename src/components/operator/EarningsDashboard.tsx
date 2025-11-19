import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Download, ChevronRight,
  DollarSign, Calendar, CreditCard, Clock
} from 'lucide-react';
import { triggerHaptic } from '../../lib/gestures';

export default function EarningsDashboard() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');

  const earnings = {
    week: { total: 1250, change: 12 },
    month: { total: 4250, change: 23 },
    year: { total: 48500, change: 45 },
    all: { total: 125000, change: 0 }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 pb-32 overflow-y-auto h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings</h1>
          <p className="text-gray-500">Track your revenue and payouts</p>
        </div>

        <TotalEarnings period={period} earnings={earnings[period]} />
        <PeriodSelector period={period} setPeriod={setPeriod} />
        <EarningsChart />
        <BreakdownCards />
        <RecentTransactions />
      </div>
    </div>
  );
}

function TotalEarnings({ period, earnings }: { period: string; earnings: { total: number; change: number } }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 mb-6 shadow-2xl"
    >
      <div className="text-white/80 text-sm mb-2">Total Earnings</div>
      <motion.div
        key={earnings.total}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-6xl font-bold text-white mb-4 flex items-start"
      >
        <span className="text-3xl mr-1">$</span>
        {earnings.total.toLocaleString()}
      </motion.div>
      {earnings.change > 0 && (
        <div className="flex items-center gap-2 text-green-300">
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">+{earnings.change}% vs last period</span>
        </div>
      )}
    </motion.div>
  );
}

function PeriodSelector({
  period,
  setPeriod
}: {
  period: string;
  setPeriod: (p: 'week' | 'month' | 'year' | 'all') => void;
}) {
  const periods: Array<{ id: 'week' | 'month' | 'year' | 'all'; label: string }> = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' },
    { id: 'all', label: 'All Time' }
  ];

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
      {periods.map((p) => (
        <motion.button
          key={p.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setPeriod(p.id);
            triggerHaptic('light');
          }}
          className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap snap-center transition-all ${
            period === p.id
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          {p.label}
        </motion.button>
      ))}
    </div>
  );
}

function EarningsChart() {
  const data = [45, 52, 38, 65, 48, 72, 58];
  const max = Math.max(...data);

  return (
    <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Revenue Trend</h2>
        <button className="text-purple-600 text-sm font-medium">View Details</button>
      </div>

      <div className="flex items-end justify-between h-48 gap-2">
        {data.map((value, index) => {
          const height = (value / max) * 100;
          return (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              className="flex-1 bg-gradient-to-t from-purple-600 to-blue-500 rounded-t-xl min-h-[20px] relative group cursor-pointer"
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                ${value * 100}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-between mt-4 text-xs text-gray-500">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </div>
  );
}

function BreakdownCards() {
  const breakdowns = [
    {
      title: 'By Experience',
      items: [
        { name: 'Dunn\'s River Falls', amount: 1200, percent: 28, color: 'from-blue-500 to-blue-600' },
        { name: 'Blue Mountain Tour', amount: 900, percent: 21, color: 'from-green-500 to-green-600' },
        { name: 'Luminous Lagoon', amount: 1550, percent: 36, color: 'from-purple-500 to-purple-600' },
        { name: 'Others', amount: 600, percent: 15, color: 'from-gray-400 to-gray-500' }
      ]
    },
    {
      title: 'By Payment Method',
      items: [
        { name: 'Credit Card', amount: 2800, percent: 66, color: 'from-purple-500 to-purple-600' },
        { name: 'Cash', amount: 1200, percent: 28, color: 'from-green-500 to-green-600' },
        { name: 'Other', amount: 250, percent: 6, color: 'from-gray-400 to-gray-500' }
      ]
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Breakdown</h2>
      <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-2">
        {breakdowns.map((breakdown, bIndex) => (
          <motion.div
            key={bIndex}
            whileTap={{ scale: 0.95 }}
            className="min-w-[320px] snap-center"
          >
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{breakdown.title}</h3>
              <div className="space-y-3">
                {breakdown.items.map((item, iIndex) => (
                  <div key={iIndex}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">{item.name}</span>
                      <span className="text-sm font-bold text-gray-900">${item.amount}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ delay: iIndex * 0.1, duration: 0.5 }}
                        className={`h-full bg-gradient-to-r ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RecentTransactions() {
  const transactions = [
    {
      id: '1',
      type: 'payout',
      description: 'Weekly payout',
      amount: 1250,
      date: '2025-10-18',
      status: 'completed',
      icon: DollarSign
    },
    {
      id: '2',
      type: 'booking',
      description: 'Dunn\'s River Falls - 4 guests',
      amount: 200,
      date: '2025-10-17',
      status: 'completed',
      icon: Calendar
    },
    {
      id: '3',
      type: 'booking',
      description: 'Blue Mountain Tour - 2 guests',
      amount: 150,
      date: '2025-10-17',
      status: 'completed',
      icon: Calendar
    },
    {
      id: '4',
      type: 'payout',
      description: 'Weekly payout',
      amount: 1180,
      date: '2025-10-11',
      status: 'completed',
      icon: DollarSign
    },
    {
      id: '5',
      type: 'booking',
      description: 'Luminous Lagoon - 6 guests',
      amount: 300,
      date: '2025-10-10',
      status: 'pending',
      icon: Clock
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
        <button className="text-purple-600 text-sm font-medium">View All</button>
      </div>

      <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-2">
        {transactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            whileTap={{ scale: 0.95 }}
            className="min-w-[300px] snap-center"
          >
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  transaction.type === 'payout'
                    ? 'bg-green-100'
                    : transaction.status === 'pending'
                    ? 'bg-yellow-100'
                    : 'bg-blue-100'
                }`}>
                  <transaction.icon className={`w-6 h-6 ${
                    transaction.type === 'payout'
                      ? 'text-green-600'
                      : transaction.status === 'pending'
                      ? 'text-yellow-600'
                      : 'text-blue-600'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-gray-900 text-sm">
                      {transaction.type === 'payout' ? '+' : ''}${transaction.amount}
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 truncate">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {transaction.type === 'payout' && (
                <button className="w-full mt-4 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        className="w-full mt-6 bg-white border-2 border-dashed border-gray-300 text-gray-600 py-4 rounded-2xl font-medium hover:border-gray-400 transition-colors"
      >
        Load More Transactions
      </motion.button>
    </div>
  );
}
