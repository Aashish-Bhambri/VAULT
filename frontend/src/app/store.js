import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './features/gameSlice'
import displayOptionSliceReducer from './features/displayOptionSlice'
import gameDetailReducer from './features/gameDetailSlice'
import authReducer from './features/authSlice';

export default configureStore({
    reducer: {
        games: gameReducer,
        display: displayOptionSliceReducer,
        gameDetail: gameDetailReducer,
        auth: authReducer,
    }
})