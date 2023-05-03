import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface MediaState {
  streams: MediaStream[];
}

const initialState: MediaState = {
  streams: [],
};

export const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    addStream: (state, action: PayloadAction<MediaStream>) => {
      const temp = [...state.streams].filter((item) => item.active === true);
      temp.push(action.payload);
      state.streams = temp;
    },
  },
});

export const { addStream } = mediaSlice.actions;

export default mediaSlice.reducer;
