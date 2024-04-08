import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getGamesAction } from "../../actions";


export const getGames = createAsyncThunk("games/getAll", async () => {
    const result = await getGamesAction();
    return result;
})


interface InitialState {
    games?: string[]
}
const initialState: InitialState = {

}
const gamesSlice = createSlice({
    initialState,
    name: "games",
    reducers: () => ({

    }),
    extraReducers(builder) {
        builder.addCase(getGames.fulfilled, (state, action) => {
            state.games = action.payload;
        })
    },
});

export default gamesSlice.reducer;