import { createSlice } from '@reduxjs/toolkit';

// initial state points to pioneer MRT
initialState = {
  latlng: {
    latitude: 1.3378270431723034,
    longitude: 103.69738744021137,
  },
  title: 'Nanyang Technological University',
  active: true,
}

const specificLocationSlice = createSlice({
  name: "specificLocation",
  initialState,
  reducers: {
    setSpecificLocation(state, action) {
      state.latlng.latitude = action.payload.latlng.latitude;
      state.latlng.longitude = action.payload.latlng.longitude;
      state.title = action.payload.title;
      state.active = action.payload.active;
    }
  }
})

// export action creators
export const { setSpecificLocation } = specificLocationSlice.actions;

// export reducers
export default specificLocationSlice.reducer;