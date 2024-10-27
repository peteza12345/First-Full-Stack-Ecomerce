import { createSlice } from '@reduxjs/toolkit';
// import { produce } from 'immer';

const initialState = {
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.user = action.payload
      // console.log('userdetail', action.payload);
    }
  },
})
// const initialState = {
//   user: null,
//   isLoading: false,
//   error: null,
// };

// export const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     setUserDetails: (state, action) => {
//       // Optional: use Immer for immutability
//       produce(state, (draft) => {
//         draft.user = action.payload;
//         draft.isLoading = false;
//         draft.error = null;
//       });
//     },
//     setUserDetailsLoading: (state) => {
//       state.isLoading = true;
//       state.error = null;
//     },
//     setUserDetailsError: (state, action) => {
//       state.isLoading = false;
//       state.error = action.payload;
//     },
//   },
// });

// export const { setUserDetails, setUserDetailsLoading, setUserDetailsError } = userSlice.actions

// export default userSlice.reducer;

// Action creators are generated for each case reducer function
export const { setUserDetails } = userSlice.actions

export default userSlice.reducer