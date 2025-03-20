import { configureStore, combineReducers } from "@reduxjs/toolkit"
import userReducer from "./user/userSlice"
import paymentReducer from "./user/paymentSlice" // Import paymentReducer vào store
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"

const rootReducer = combineReducers({
  user: userReducer,
  payment: paymentReducer, // Thêm paymentReducer vào rootReducer
})

const persistConfig = {
  key: "root",
  storage,
  version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  // to prevent possible errors
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)
