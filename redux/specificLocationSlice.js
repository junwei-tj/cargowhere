import { createSlice } from '@reduxjs/toolkit';

// initial state points to some unknown place to "hide it"
initialState = {
  latlng: {
    latitude: 1.3050899559220615, 
    longitude: 103.83203936914883,
  },
  title: 'Orchard',
}

const specificLocationSlice = createSlice({
  name: "specificLocation",
  initialState,
  reducers: {
    setSpecificLocation(state, action) {
      state.latlng.latitude = action.payload.latlng.latitude;
      state.latlng.longitude = action.payload.latlng.longitude;
      state.title = action.payload.title;
    }
  }
})

// export action creators
export const { setSpecificLocation } = specificLocationSlice.actions;

// export reducers
export default specificLocationSlice.reducer;