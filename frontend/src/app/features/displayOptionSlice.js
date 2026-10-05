import { createSlice } from "@reduxjs/toolkit";

export const displayOptionSlice = createSlice({
    name: 'display',
    initialState: {
        isGroup: true,
        isSingle: false
    },
    reducers: {
        setGroup: (state) => {
            state.isGroup = true;
            state.isSingle = false;
        },
        setSingle: (state) => {
            state.isSingle = true;
            state.isGroup = false;
        }
    }
})

export const{setGroup,setSingle}=displayOptionSlice.actions;

export default displayOptionSlice.reducer;