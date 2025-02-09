"use client";
import { Provider } from "react-redux";
import { store } from "./store";

// import { PersistGate } from "redux-persist/integration/react";
export function StoreProvider({ children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
