import { createSlice, createAction } from "@reduxjs/toolkit";


const messagesSlice = createSlice({
  name: "messages",
  initialState: [{'message': 'test', 'header': 'testing header', 'type': 'positive'}],
  reducers: {
    addMessage: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (message, header, type) => {
        return {
          'message': message,
          'header': header,
          'type': type
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
