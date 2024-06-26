import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
    categories: number[];
    checked: boolean;
}
const initialState: InitialState = {
    categories: [],
    checked: false
}
const filters = createSlice({
    name: "filters",
    initialState,
    reducers: (s) => ({
        toggleCategories: (state, { payload: { hide, ids } }: PayloadAction<{ hide: boolean, ids: number[] }>) => {
            hide ?
                state.categories = state.categories.concat(ids)
                :
                state.categories = state.categories.filter(x => !ids.some(c => c === x));
        },
        toggleCategory: (state, action: PayloadAction<number>) => {
            if (state.categories.some(x => x === action.payload))
                state.categories = state.categories.filter(x => x !== action.payload);
            else
                state.categories.push(action.payload);
        },
        toggleChecked: (state) => {
            state.checked = !state.checked
        },
        clearAllFilters: (state) => {
            state.categories = [];
        },
        addListOfFilters: (state, action: PayloadAction<number[]>) => {
            state.categories = action.payload;
        }
    })
});

export const { clearAllFilters, addListOfFilters, toggleCategory, toggleChecked, toggleCategories } = filters.actions;
export default filters.reducer;