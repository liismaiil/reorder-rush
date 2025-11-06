import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Party {
  id: string;
  name: string;
  players: string[];
  status: 'waiting' | 'playing' | 'finished';
  createdAt: string;
  type: 'solo' | 'versus';
}

interface PartiesState {
  parties: Party[];
  activeParty: Party | null;
  loading: boolean;
  error: string | null;
}

const initialState: PartiesState = {
  parties: [],
  activeParty: null,
  loading: false,
  error: null,
};

// Mock data - replace with your API endpoint
const mockParties: Party[] = [
  { id: '1', name: 'Quick Challenge', players: ['Alex Storm', 'Maya Swift'], status: 'playing', createdAt: new Date().toISOString(), type: 'versus' },
  { id: '2', name: 'Solo Sprint', players: ['Rio Dash'], status: 'playing', createdAt: new Date().toISOString(), type: 'solo' },
  { id: '3', name: 'Battle Royale', players: ['Luna Grace', 'Kai Thunder'], status: 'waiting', createdAt: new Date().toISOString(), type: 'versus' },
  { id: '4', name: 'Speed Run', players: ['Alex Storm'], status: 'finished', createdAt: new Date().toISOString(), type: 'solo' },
];

export const fetchParties = createAsyncThunk(
  'parties/fetchParties',
  async () => {
    // Replace with your API endpoint
    // const response = await fetch('YOUR_API_ENDPOINT/parties');
    // const data = await response.json();
    // return data;
    
    return new Promise<Party[]>((resolve) => {
      setTimeout(() => resolve(mockParties), 500);
    });
  }
);

export const createParty = createAsyncThunk(
  'parties/createParty',
  async (partyData: { name: string; type: 'solo' | 'versus'; opponent?: string }) => {
    // Replace with your API endpoint
    // const response = await fetch('YOUR_API_ENDPOINT/parties', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(partyData),
    // });
    // const data = await response.json();
    // return data;
    
    const newParty: Party = {
      id: Math.random().toString(36).substr(2, 9),
      name: partyData.name,
      players: partyData.type === 'solo' ? ['You'] : ['You', partyData.opponent || 'Unknown'],
      status: 'waiting',
      createdAt: new Date().toISOString(),
      type: partyData.type,
    };
    
    return new Promise<Party>((resolve) => {
      setTimeout(() => resolve(newParty), 300);
    });
  }
);

const partiesSlice = createSlice({
  name: 'parties',
  initialState,
  reducers: {
    setActiveParty: (state, action: PayloadAction<Party>) => {
      state.activeParty = action.payload;
    },
    clearActiveParty: (state) => {
      state.activeParty = null;
    },
    updatePartyStatus: (state, action: PayloadAction<{ id: string; status: Party['status'] }>) => {
      const party = state.parties.find(p => p.id === action.payload.id);
      if (party) {
        party.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParties.fulfilled, (state, action) => {
        state.loading = false;
        state.parties = action.payload;
      })
      .addCase(fetchParties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch parties';
      })
      .addCase(createParty.fulfilled, (state, action) => {
        state.parties.unshift(action.payload);
        state.activeParty = action.payload;
      });
  },
});

export const { setActiveParty, clearActiveParty, updatePartyStatus } = partiesSlice.actions;
export default partiesSlice.reducer;
