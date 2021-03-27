import {createSlice} from '@reduxjs/toolkit';

const availabilitySlice = createSlice({
  name: 'availability',
  initialState: {availabilityData: []},
  reducers: {
    setAvailability: (state, action) => {
      state.availabilityData = action.payload;
    },
  },
});

// export action creators
export const {setAvailability} = availabilitySlice.actions;

// export reducers
export default availabilitySlice.reducer;
