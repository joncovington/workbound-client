import { createSlice } from "@reduxjs/toolkit";


const messagesSlice = createSlice({
  name: "messages",
  initialState: [],
  reducers: {
    addMessage: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (message, type, header = null ) => {
          return {
            payload: {
              message,
              header,
              type
            },
        }
      }

    },
    removeMessage: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
  },
});

export const { addMessage, removeMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
