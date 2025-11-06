import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  avatar: string;
  score: number;
  wins: number;
  rank: number;
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaderboardState = {
  entries: [],
  loading: false,
  error: null,
};

// Mock data - replace with your API endpoint
const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', playerName: 'Rio Dash', avatar: '🚀', score: 4500, wins: 45, rank: 1 },
  { id: '2', playerName: 'Kai Thunder', avatar: '⚔️', score: 3500, wins: 35, rank: 2 },
  { id: '3', playerName: 'Alex Storm', avatar: '⚡', score: 2300, wins: 23, rank: 3 },
  { id: '4', playerName: 'Maya Swift', avatar: '🌟', score: 1800, wins: 18, rank: 4 },
  { id: '5', playerName: 'Luna Grace', avatar: '🌙', score: 1200, wins: 12, rank: 5 },
];

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async () => {
    // Replace with your API endpoint
    // const response = await fetch('YOUR_API_ENDPOINT/leaderboard');
    // const data = await response.json();
    // return data;
    
    return new Promise<LeaderboardEntry[]>((resolve) => {
      setTimeout(() => resolve(mockLeaderboard), 500);
    });
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch leaderboard';
      });
  },
});

export default leaderboardSlice.reducer;
