"use client"
import React from 'react'
import { Provider } from 'react-redux'
import store from './src/store'
import { persistStore } from 'redux-persist';

const Template: React.FC<React.PropsWithChildren> = ({ children }) => {
    persistStore(store);
    return (
        <React.Fragment>
            <Provider store={store}>
                {children}
            </Provider>
        </React.Fragment>
    )
}

export default Template