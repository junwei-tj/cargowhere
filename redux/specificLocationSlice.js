import { createSlice } from '@reduxjs/toolkit';

// initial state points to NTU
initialState = {
  latlng: {
    latitude: 1.3483099,
    longitude: 103.680946,
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