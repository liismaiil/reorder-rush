import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  level: number;
  wins: number;
  losses: number;
  isOnline: boolean;
}

interface PlayersState {
  players: Player[];
  selectedOpponent: Player | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlayersState = {
  players: [],
  selectedOpponent: null,
  loading: false,
  error: null,
};

// Mock data - replace with your API endpoint
const mockPlayers: Player[] = [
  { id: '1', name: 'Alex Storm', avatar: '⚡', level: 15, wins: 23, losses: 5, isOnline: true },
  { id: '2', name: 'Maya Swift', avatar: '🌟', level: 12, wins: 18, losses: 7, isOnline: true },
  { id: '3', name: 'Rio Dash', avatar: '🚀', level: 20, wins: 45, losses: 10, isOnline: false },
  { id: '4', name: 'Luna Grace', avatar: '🌙', level: 8, wins: 12, losses: 8, isOnline: true },
  { id: '5', name: 'Kai Thunder', avatar: '⚔️', level: 18, wins: 35, losses: 15, isOnline: true },
];

export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async () => {
    // Replace with your API endpoint
    // const response = await fetch('YOUR_API_ENDPOINT/players');
    // const data = await response.json();
    // return data;
    
    return new Promise<Player[]>((resolve) => {
      setTimeout(() => resolve(mockPlayers), 500);
    });
  }
);

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    selectOpponent: (state, action: PayloadAction<Player>) => {
      state.selectedOpponent = action.payload;
    },
    clearOpponent: (state) => {
      state.selectedOpponent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.players = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch players';
      });
  },
});

export const { selectOpponent, clearOpponent } = playersSlice.actions;
export default playersSlice.reducer;
