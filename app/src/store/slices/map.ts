import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkLocation, getMapAction, getMaps, reset } from "../../actions";
import { Map, MapData } from "../../models";

interface InitialState {
    maps?: Map[];
    map?: MapData;

}

const initialState: InitialState = {

}

export const getGameMaps = createAsyncThunk("map/getMaps", async (slug: string) => {
    const result = await getMaps(slug);
    return result;
});

interface GetMapProps {
    slug: string;
    mapSlug: string;
}

export const getGameMap = createAsyncThunk("map/getMap", async ({ slug }: GetMapProps) => {
    const result = await getMapAction(slug);
    return result;
});

interface toggleLocationProps {
    slug: string;
    id: number;
}
export const toggleLocation = createAsyncThunk("map/toggleLocation", async ({ id, slug }: toggleLocationProps) => {
    return await checkLocation(slug, id);
});

export const resetMap = createAsyncThunk("map/reset", async (slug: string) => {
    return await reset(slug);
})

const mapSlice = createSlice({
    name: "map",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(resetMap.fulfilled, (state, action) => {
            state.map = action.payload;
        })
        builder.addCase(getGameMaps.pending, (state) => {
            state.maps = undefined;
            state.map = undefined;
        });
        builder.addCase(getGameMaps.fulfilled, (state, action) => {
            state.maps = action.payload;
        });
        builder.addCase(getGameMap.fulfilled, (state, action) => {
            state.map = action.payload;
        });
        builder.addCase(toggleLocation.pending, (state, action) => {
            const location = state.map?.locations.find(x => x.id === action.meta.arg.id);
            if (location) location.checked = !location.checked;
        });
        builder.addCase(toggleLocation.rejected, (state, action) => {
            const location = state.map?.locations.find(x => x.id === action.meta.arg.id);
            if (location) location.checked = !location.checked;
        });
    },
});
export default mapSlice.reducer;