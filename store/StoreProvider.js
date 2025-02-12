"use client";
import { Provider } from "react-redux";
import { store } from  "@/store/store";
import { persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";

// import { PersistGate } from "redux-persist/integration/react";
export function StoreProvider({ children }) {
  return (
    <Provider loading={null} store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
}
