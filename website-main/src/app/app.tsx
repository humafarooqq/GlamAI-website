"use client";
import Cart from "@/components/Cart";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { store } from "@/redux/store";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

const App = ({ children }: { children: React.ReactNode }) => {
  const [showCart, setShowCart] = useState(false);
  return (
    <Provider store={store}>
      <NavBar setShowCart={setShowCart} />
      {showCart && <Cart setShowCart={setShowCart} />}
      {children}
      <Toaster position="bottom-center" />
      <Footer />
    </Provider>
  );
};

export default App;
