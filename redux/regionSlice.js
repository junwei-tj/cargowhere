import { createSlice } from '@reduxjs/toolkit';

// initial state points to NTU
initialState = {
  latitude: 1.3483099,
  longitude: 103.680946,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
}

const regionSlice = createSlice({
  name: "region",
  initialState,
  reducers: {
    setRegion(state, action) {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.latitudeDelta = action.payload.latitudeDelta;
      state.longitudeDelta = action.payload.longitudeDelta;
    },
    setLatlng(state, action) {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    }
  }
})

// export action creators
export const { setRegion, setLatlng } = regionSlice.actions;

// export reducers
export default regionSlice.reducer;