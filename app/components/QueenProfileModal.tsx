import { motion } from 'framer-motion';
import { Queen } from '../types';
import { format } from 'date-fns';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from 'recharts';

interface QueenProfileModalProps {
  queen: Queen;
  onClose: () => void;
}

const QueenProfileModal = ({ queen, onClose }: QueenProfileModalProps) => {
  // Process voting data
  const votingData = queen.voting_history
    .map(vote => ({
      date: format(new Date(vote.created_at), 'MMM dd'),
      votes: vote.votes,
      subnet: `Subnet ${vote.subnet_id}`
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate activity score (0-100)
  const activityScore = Math.min(100, Math.round(
    (queen.total_votes * 0.4) + 
    ((queen.referrals_given?.length ?? 0) * 10) + 
    (queen.total_staking * 5)
  ));

  const radialData = [
    {
      name: 'Activity Score',
      value: activityScore,
      fill: '#4F46E5'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Activity Score */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img 
                src={queen.dp_link} 
                alt={queen.username}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-100"
              />
              <motion.div
                className="absolute -bottom-2 -right-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                Queen
              </motion.div>
            </div>
            <div>
              <motion.h2 
                className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {queen.username}
              </motion.h2>
              <motion.p 
                className="text-gray-500 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Joined {format(new Date(queen.created_at), 'MMMM dd, yyyy')}
              </motion.p>
            </div>
          </div>
          
          {/* Activity Score */}
          <div className="w-32 h-32">
            <ResponsiveContainer>
              <RadialBarChart 
                innerRadius="70%" 
                outerRadius="100%" 
                data={radialData} 
                startAngle={90} 
                endAngle={-270}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={30}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-2xl font-bold"
                  fill="#4F46E5"
                >
                  {activityScore}
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative z-10">
              <p className="text-blue-100 text-sm">Total Staking</p>
              <p className="text-3xl font-bold mt-2">{queen.total_staking.toLocaleString()} GP</p>
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-400 rounded-full opacity-20" />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative z-10">
              <p className="text-purple-100 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold mt-2">
                {(queen.staking_earnings + queen.subnet_earnings).toLocaleString()} GP
              </p>
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-400 rounded-full opacity-20" />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative z-10">
              <p className="text-emerald-100 text-sm">Total Votes</p>
              <p className="text-3xl font-bold mt-2">{queen.total_votes.toLocaleString()}</p>
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-400 rounded-full opacity-20" />
          </motion.div>
        </div>

        {/* Voting Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Voting Timeline</h3>
          <div className="space-y-4">
            {queen.voting_history
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((vote, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-24 text-sm text-gray-500">
                    {format(new Date(vote.created_at), 'MMM dd, yyyy')}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <div className="flex-1 bg-gradient-to-r from-indigo-50 to-transparent p-4 rounded-xl">
                    <p className="text-sm font-medium text-gray-800">
                      Cast {vote.votes} votes on Subnet #{vote.subnet_id}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Voting Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Voting Activity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={votingData}>
                <defs>
                  <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="votes"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fill="url(#colorVotes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Referral Network */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Referral Network</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100">
                <p className="text-sm text-indigo-600 font-medium">Referrals Given</p>
                <p className="text-3xl font-bold text-indigo-900 mt-2">
                  {queen.referrals_given.length}
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
                <p className="text-sm text-purple-600 font-medium">Referrals Received</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">
                  {queen.referrals_received.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          onClick={onClose}
        >
          ×
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default QueenProfileModal; 