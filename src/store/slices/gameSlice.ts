import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Sentence {
  id: string;
  words: string[];
  correctOrder: number[];
  currentOrder: number[];
}

interface GameState {
  currentSentence: Sentence | null;
  score: number;
  timeRemaining: number;
  isPlaying: boolean;
  completedSentences: number;
}

const initialState: GameState = {
  currentSentence: null,
  score: 0,
  timeRemaining: 60,
  isPlaying: false,
  completedSentences: 0,
};

// Mock sentences - replace with your API data
const mockSentences = [
  { words: ['The', 'quick', 'brown', 'fox', 'jumps'], correctOrder: [0, 1, 2, 3, 4] },
  { words: ['over', 'the', 'lazy', 'dog'], correctOrder: [0, 1, 2, 3] },
  { words: ['I', 'love', 'playing', 'word', 'games'], correctOrder: [0, 1, 2, 3, 4] },
];

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state) => {
      state.isPlaying = true;
      state.score = 0;
      state.timeRemaining = 60;
      state.completedSentences = 0;
      // Generate random sentence
      const sentence = mockSentences[Math.floor(Math.random() * mockSentences.length)];
      const shuffled = [...sentence.correctOrder].sort(() => Math.random() - 0.5);
      state.currentSentence = {
        id: Math.random().toString(36).substr(2, 9),
        words: sentence.words,
        correctOrder: sentence.correctOrder,
        currentOrder: shuffled,
      };
    },
    endGame: (state) => {
      state.isPlaying = false;
      state.currentSentence = null;
    },
    updateWordOrder: (state, action: PayloadAction<number[]>) => {
      if (state.currentSentence) {
        state.currentSentence.currentOrder = action.payload;
      }
    },
    checkAnswer: (state) => {
      if (state.currentSentence) {
        const isCorrect = JSON.stringify(state.currentSentence.currentOrder) === 
                         JSON.stringify(state.currentSentence.correctOrder);
        
        if (isCorrect) {
          state.score += 100;
          state.completedSentences += 1;
          // Load next sentence
          const sentence = mockSentences[Math.floor(Math.random() * mockSentences.length)];
          const shuffled = [...sentence.correctOrder].sort(() => Math.random() - 0.5);
          state.currentSentence = {
            id: Math.random().toString(36).substr(2, 9),
            words: sentence.words,
            correctOrder: sentence.correctOrder,
            currentOrder: shuffled,
          };
        }
      }
    },
    decrementTime: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      } else {
        state.isPlaying = false;
      }
    },
  },
});

export const { startGame, endGame, updateWordOrder, checkAnswer, decrementTime } = gameSlice.actions;
export default gameSlice.reducer;
