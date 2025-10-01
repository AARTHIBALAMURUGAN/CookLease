import React, { createContext, useState ,useEffect} from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
 const addToCart = (product) => {
  setCart((prevCart) => {
    const existing = prevCart.find((item) => item._id === product._id);

    if (existing) {
      if (existing.quantity < product.stock) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 } // Spread important
            : item
        );
      } else {
        return prevCart;
      }
    } else {
      // <-- Add quantity here
      return [...prevCart, { ...product, quantity: 1, stock: product.stock }];
    }
  });
};





  // Increase quantity
 // Increase quantity
const increaseQuantity = (id) => {
  setCart((prevCart) =>
    prevCart.map((item) =>
      item._id === id && item.quantity < item.stock
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  );
};


  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };
// Remove product from cart
const removeFromCart = (id) => {
  setCart(prevCart => prevCart.filter(item => item._id !== id));
};

  return (
    <CartContext.Provider
      value={{ cart, addToCart, setCart,increaseQuantity, decreaseQuantity,removeFromCart}}
    >
      {children}
    </CartContext.Provider>
  );
};
