import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";

import games from "./slices/games";
import map from "./slices/map";
import filters from "./slices/filters";
import pointer from "./slices/pointer";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ["filters"]
}

const reducer = persistReducer(persistConfig, combineReducers({
    games, map, filters, pointer
}));

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;