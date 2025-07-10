import { combineReducers, configureStore } from '@reduxjs/toolkit'
import sessionStorage from 'redux-persist/lib/storage/session'
import persistReducer from 'redux-persist/lib/persistReducer'
import persistStore from 'redux-persist/lib/persistStore'
import userSlice  from './redux/UserSlice'
const rootReducer = combineReducers({
    user: userSlice
})
const persistConfig = {
    key: 'root',
    storage: sessionStorage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({serializableCheck:false })
})

export const persistor = persistStore(store)