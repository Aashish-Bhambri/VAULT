import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedPlatform: null,
    selectedGenre: null,
    selectQuery: '',
    ordering: '',
    selectedDates: null,
    categoryTitle: 'New and trending',
    activeNavItem: 'home',
    games: []
};

export const gameSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {
        setPlatform: (state, action) => {
            state.selectedPlatform = action.payload;
            state.activeNavItem = action.payload ? `platform-${action.payload}` : 'home';
        },
        setGenre: (state, action) => {
            state.selectedGenre = action.payload;
            state.activeNavItem = action.payload ? `genre-${action.payload}` : 'home';
        },
        setSearchQuery: (state, action) => {
            state.selectQuery = action.payload;
        },
        setOrdering: (state, action) => {
            state.ordering = action.payload;
        },
        setCategory: (state, action) => {
            const { title, ordering = '', dates = null, navItem = 'home', platform = null, genre = null } = action.payload;
            state.categoryTitle = title || 'New and trending';
            state.ordering = ordering;
            state.selectedDates = dates;
            state.activeNavItem = navItem;
            state.selectedPlatform = platform;
            state.selectedGenre = genre;
        },
        resetFilters: (state) => {
            state.selectedPlatform = null;
            state.selectedGenre = null;
            state.selectQuery = '';
            state.ordering = '';
            state.selectedDates = null;
            state.categoryTitle = 'New and trending';
            state.activeNavItem = 'home';
        },
    }
});

export const { setPlatform, setGenre, setSearchQuery, setOrdering, setCategory, resetFilters } = gameSlice.actions;
export default gameSlice.reducer;
