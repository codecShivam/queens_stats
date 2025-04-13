export interface Queen {
  id: number;
  wallet_address: string;
  username: string;
  dp_link: string;
  total_staking: number;
  total_votes: number;
  votes_casted: number;
  subnet_earnings: number;
  staking_earnings: number;
  created_at: string;
  updated_at: string;
  referral_code: string;
  voting_history: VotingHistory[];
  staking_rewards: StakingReward[];
  subnet_rewards: SubnetReward[];
  referrals_received: Referral[];
  referrals_given: Referral[];
}

export interface Subnet {
  id: number;
  name: string;
  desc?: string;
  template_id: number;
  dp_link?: string;
  socials?: any;
  data_sections?: any;
  votes: number;
  earnings: number;
  user_id: number;
  user_wallet: string;
  created_at: string;
  updated_at: string;
}

export interface StakingRewardHistory {
  id: number;
  user_id: number;
  rewards: number;
  votes_casted: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface SubnetRewardHistory {
  id: number;
  subnet_id: number;
  user_id: number;
  rewards: number;
  votes: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Vote {
  id: number;
  user_id: number;
  subnet_id: number;
  votes: number;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  referrer_id?: number;
  referee_id?: number;
  created_at: string;
}

export interface Timeline {
  id: number;
  title: string;
  description: string;
  subnet_id: number;
  created_at: string;
  updated_at: string;
}

export interface QueenStats {
  total_queens: number;
  total_staked: number;
  total_earnings: number;
  avg_stake: number;
  avg_earnings: number;
  total_votes: number;
  avg_votes: number;
}

export interface VotingHistory {
  subnet_id: number;
  votes: number;
  created_at: string;
}

export interface StakingReward {
  rewards: number;
  votes_casted: number;
  date: string;
}

export interface SubnetReward {
  subnet_id: number;
  name: string;
  rewards: number;
  votes: number;
  date: string;
}

export interface DashboardData {
  queens: Queen[];
  stats: QueenStats;
} 