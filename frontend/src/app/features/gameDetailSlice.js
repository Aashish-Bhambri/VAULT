import { createSlice } from "@reduxjs/toolkit";

export const gameDetailSlice = createSlice({
    name: 'gameDetail',
    initialState: {
        gameID: ''

    },
    reducers: {
        setGameId:(state,action)=>{
            state.gameID= action.payload;
        }
    }
})

export const{setGameId} =gameDetailSlice.actions;
export default gameDetailSlice.reducer