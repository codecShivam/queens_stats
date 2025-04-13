import { NextResponse } from 'next/server';
import pool from '../../lib/db';

export async function GET() {
  try {
    const queensQuery = `
      SELECT 
        u.id,
        u.wallet_address,
        u.username,
        u.dp_link,
        u.total_staking,
        u.total_votes,
        u.staking_earnings,
        u.subnet_earnings,
        u.created_at,
        u.updated_at,
        u.referral_code,
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'subnet_id', v.subnet_id,
              'votes', v.votes,
              'created_at', v.created_at
            )
          ) FROM votes v WHERE v.user_id = u.id
          ), '[]'::json
        ) as voting_history,
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'rewards', srh.rewards,
              'votes_casted', srh.votes_casted,
              'date', srh.date
            )
          ) FROM staking_reward_history srh WHERE srh.user_id = u.id
          ), '[]'::json
        ) as staking_rewards,
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'subnet_id', s.id,
              'name', s.name,
              'rewards', srh.rewards,
              'votes', srh.votes,
              'date', srh.date
            )
          ) FROM subnet_reward_history srh 
          JOIN subnets s ON s.id = srh.subnet_id
          WHERE srh.user_id = u.id
          ), '[]'::json
        ) as subnet_rewards,
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'referrer_id', r.referrer_id,
              'created_at', r.created_at
            )
          ) FROM referrals r WHERE r.referee_id = u.id
          ), '[]'::json
        ) as referrals_received,
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'referee_id', r.referee_id,
              'created_at', r.created_at
            )
          ) FROM referrals r WHERE r.referrer_id = u.id
          ), '[]'::json
        ) as referrals_given
      FROM users u
      WHERE u.total_staking > 0
      ORDER BY u.total_staking DESC
      LIMIT 100
    `;
    
    // Fetch statistics
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT u.id) as total_queens,
        SUM(u.total_staking) as total_staked,
        SUM(u.staking_earnings + u.subnet_earnings) as total_earnings,
        ROUND(AVG(u.total_staking)::numeric, 2) as avg_stake,
        ROUND(AVG(u.staking_earnings + u.subnet_earnings)::numeric, 2) as avg_earnings,
        SUM(u.total_votes) as total_votes,
        ROUND(AVG(u.total_votes)::numeric, 2) as avg_votes
      FROM users u
      WHERE u.total_staking > 0
    `;

    const [queensResult, statsResult] = await Promise.all([
      pool.query(queensQuery),
      pool.query(statsQuery)
    ]);

    return NextResponse.json({
      queens: queensResult.rows,
      stats: statsResult.rows[0]
    });

  } catch (error) {
    console.error('Error fetching queens data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queens data' },
      { status: 500 }
    );
  }
} 