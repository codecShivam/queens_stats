'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { Queen, QueenStats } from './types';
import { ChartBarIcon, UserGroupIcon, CurrencyDollarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import QueenProfileModal from './components/QueenProfileModal';
import type { HTMLAttributes } from 'react';

// Define proper types for motion components
type MotionDivProps = HTMLMotionProps<"div">;
type MotionTrProps = HTMLMotionProps<"tr">;

// Create properly typed components
const MotionDiv = motion.div;
const MotionTr = motion.tr;

const styles = {
  container: {
    minHeight: '100vh',
    padding: '2rem',
    background: 'linear-gradient(to bottom right, rgb(249, 250, 251), rgb(219, 234, 254))'
  },
  card: {
    position: 'relative' as const,
    overflow: 'hidden',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  tableRow: {
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transformOrigin: 'center',
    backgroundColor: 'transparent'
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const tableRowVariants = {
  initial: { backgroundColor: "rgba(255, 255, 255, 0)" },
  hover: { 
    backgroundColor: "rgba(249, 250, 251, 0.8)",
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

// Update the table row styles
const tableRowStyle = `
  .queen-row {
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
    background-color: transparent;
  }
  
  .queen-row:hover {
    background-color: rgba(249, 250, 251, 0.95);
    transform: scale(1.01);
  }
`;

// Define proper types for motion components
type StatCardProps = {
  title: string;
  value: string;
  icon: any;
  color: string;
  gradient: string;
};

const StatCard = ({ title, value, icon: Icon, color, gradient }: { title: string; value: string; icon: any; color: string; gradient: string }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '1rem',
      padding: '1.5rem',
      background: gradient,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      color: 'white'
    }}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 }}
  >
    <div style={{ position: 'relative', zIndex: 10 }}>
      <p style={{ 
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '0.875rem',
        fontWeight: 500
      }}>{title}</p>
      <p style={{ 
        fontSize: '1.875rem',
        fontWeight: 'bold',
        marginTop: '0.5rem'
      }}>{value}</p>
    </div>
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      marginTop: '-1rem',
      marginRight: '-1rem',
      width: '6rem',
      height: '6rem',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '9999px'
    }} />
  </motion.div>
);

export default function Home() {
  const [queens, setQueens] = useState<Queen[]>([]);
  const [stats, setStats] = useState<QueenStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQueen, setSelectedQueen] = useState<Queen | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/queens');
        if (!response.ok) {
          const staticResponse = await fetch('/queens_data.json');
          const staticData = await staticResponse.json();
          setQueens(staticData.queens.slice(0, 100)); // Limit to 100 queens
          setStats({
            total_queens: staticData.total_queens,
            total_staked: staticData.statistics.total_staked_amount,
            total_earnings: staticData.statistics.total_earnings,
            avg_stake: staticData.statistics.average_stake_per_queen,
            avg_earnings: staticData.statistics.average_earnings_per_queen,
            total_votes: staticData.queens.slice(0, 100).reduce((sum: number, queen: Queen) => sum + queen.total_votes, 0),
            avg_votes: staticData.queens.slice(0, 100).reduce((sum: number, queen: Queen) => sum + queen.total_votes, 0) / Math.min(100, staticData.queens.length)
          });
        } else {
          const data = await response.json();
          setQueens(data.queens);
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, rgb(238, 242, 255), rgb(219, 234, 254))'
      }}>
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity }
          }}
          style={{
            width: '4rem',
            height: '4rem',
            border: '4px solid rgb(99, 102, 241)',
            borderTopColor: 'transparent',
            borderRadius: '9999px'
          }}
        />
      </div>
    );
  }

  if (!stats) {
    return <div className="p-8 text-center text-gray-600">No data available</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        minHeight: '100vh',
        padding: '2rem',
        background: 'linear-gradient(to bottom right, rgb(249, 250, 251), rgb(219, 234, 254))'
      }}
    >
      <motion.div 
        variants={itemVariants}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}
      >
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, rgb(79, 70, 229), rgb(147, 51, 234))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Queens Dashboard
        </h1>
        <div style={{ fontSize: '0.875rem', color: 'rgb(107, 114, 128)' }}>
          Last updated: {format(new Date(), 'PPP')}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Queens"
          value={stats.total_queens.toString()}
          icon={UserGroupIcon}
          color="text-blue-100"
          gradient="linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235))"
        />
        <StatCard
          title="Total Staked"
          value={`${stats.total_staked.toLocaleString()} GP`}
          icon={ChartBarIcon}
          color="text-purple-100"
          gradient="linear-gradient(135deg, rgb(147, 51, 234), rgb(126, 34, 206))"
        />
        <StatCard
          title="Total Earnings"
          value={`${stats.total_earnings.toLocaleString()} GP`}
          icon={CurrencyDollarIcon}
          color="text-emerald-100"
          gradient="linear-gradient(135deg, rgb(16, 185, 129), rgb(5, 150, 105))"
        />
        <StatCard
          title="Average Stake"
          value={`${stats.avg_stake.toLocaleString()} GP`}
          icon={TrophyIcon}
          color="text-indigo-100"
          gradient="linear-gradient(135deg, rgb(99, 102, 241), rgb(79, 70, 229))"
        />
      </div>

      {/* Queens Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Queens List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Queen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Staked</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Votes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {queens.map((queen) => (
                <tr
                  key={queen.id}
                  onClick={() => setSelectedQueen(queen)}
                  style={styles.tableRow}
                  className="hover:bg-gray-50 hover:scale-[1.01]"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative">
                        <img 
                          className="h-10 w-10 rounded-lg object-cover ring-2 ring-gray-100" 
                          src={queen.dp_link} 
                          alt="" 
                        />
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{queen.username}</div>
                        <div className="text-xs text-gray-500 font-mono">{queen.wallet_address.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{queen.total_staking.toLocaleString()} GP</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{queen.total_votes.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {(queen.staking_earnings + queen.subnet_earnings).toLocaleString()} GP
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{format(new Date(queen.created_at), 'MMM dd, yyyy')}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Queen Profile Modal */}
      <AnimatePresence>
        {selectedQueen && (
          <QueenProfileModal
            queen={selectedQueen}
            onClose={() => setSelectedQueen(null)}
          />
        )}
      </AnimatePresence>

      {/* System Stats */}
      <motion.div
        variants={itemVariants}
        style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgb(243, 244, 246)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgb(31, 41, 55)' }}>
            System Statistics
          </h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              padding: '1.5rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(to bottom right, rgb(238, 242, 255), rgb(224, 231, 255))',
              border: '1px solid rgb(199, 210, 254)'
            }}
          >
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgb(79, 70, 229)' }}>
              Average Stake per Queen
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'rgb(55, 48, 163)', marginTop: '0.5rem' }}>
              {stats.avg_stake?.toLocaleString()} GP
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              padding: '1.5rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(to bottom right, rgb(245, 243, 255), rgb(237, 233, 254))',
              border: '1px solid rgb(221, 214, 254)'
            }}
          >
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgb(124, 58, 237)' }}>
              Average Votes per Queen
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'rgb(109, 40, 217)', marginTop: '0.5rem' }}>
              {stats.avg_votes?.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              padding: '1.5rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(to bottom right, rgb(236, 253, 245), rgb(209, 250, 229))',
              border: '1px solid rgb(167, 243, 208)'
            }}
          >
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgb(16, 185, 129)' }}>
              Average Earnings per Queen
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'rgb(6, 95, 70)', marginTop: '0.5rem' }}>
              {stats.avg_earnings?.toLocaleString()} GP
            </p>
          </motion.div>
    </div>
      </motion.div>
    </motion.div>
  );
}
