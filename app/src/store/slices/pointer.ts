import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMapPointers } from "../../actions";

type pinterType = {
    width: number;
    height: number;
    x: number;
    y: number;
    pixelRatio: number;
}
interface InitialState {
    pointers?: Record<string, pinterType>
}

const initialState: InitialState = {

}

export const getPointers = createAsyncThunk("pointer/getAll", async (slug: string) => {
    return await getMapPointers(slug);
})

const pointerSlice = createSlice({
    name: "pointer",
    initialState,
    reducers: ({}),
    extraReducers(builder) {
        builder.addCase(getPointers.fulfilled, (state, action) => {
            state.pointers = action.payload;
        });
        builder.addCase(getPointers.pending, (state) => {
            state.pointers = undefined
        })
    },
});


export default pointerSlice.reducer;