export const getCartFromLocalStorage = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};
export const addProductToCart = (product, quantity) => {
  const cart = getCartFromLocalStorage();

  // Check if the product already exists in the cart
  const existingProductIndex = cart.findIndex(
    (item) => item.product._id === product._id
  );

  if (existingProductIndex !== -1) {
    // If product exists, update the quantity
    cart[existingProductIndex].quantity += quantity;
  } else {
    // Otherwise, add the new product
    cart.push({ product, quantity });
  }

  // Save updated cart back to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const deleteFromCard = (product) => {
  const cart = getCartFromLocalStorage();
  const newCart = cart.filter((e) => e.product._id !== product._id);
  localStorage.setItem("cart", JSON.stringify(newCart));
};
export const decrementQuantityFromCart = (product) => {
  const cart = getCartFromLocalStorage();
  const existingProductIndex = cart.findIndex(
    (item) => item.product._id === product._id
  );
  if (existingProductIndex !== -1) {
    const cartItem = cart[existingProductIndex];
    if (cartItem.quantity > 1) {
      cart[existingProductIndex].quantity--;
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      deleteFromCard(cartItem.product);
    }
  }
};
