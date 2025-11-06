import { configureStore } from '@reduxjs/toolkit';
import playersReducer from './slices/playersSlice';
import partiesReducer from './slices/partiesSlice';
import gameReducer from './slices/gameSlice';
import leaderboardReducer from './slices/leaderboardSlice';

export const store = configureStore({
  reducer: {
    players: playersReducer,
    parties: partiesReducer,
    game: gameReducer,
    leaderboard: leaderboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
