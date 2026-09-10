// Shared cart helper used across product cards, product detail page, and the cart page.
// Keeps the same localStorage schema the app already uses ("cart" key + "cartUpdated" event).

export function addToCart(product, { size, color, quantity = 1 } = {}) {
  if (!product) return;

  const productId = product.id || product._id;
  const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

  const resolvedSize = size || (product.sizes && product.sizes[0]) || "Standard";
  const resolvedColor = color || (product.colors && product.colors[0]) || "Default";

  const existingIndex = existingCart.findIndex(
    (item) =>
      String(item.id) === String(productId) &&
      item.size === resolvedSize &&
      item.color === resolvedColor
  );

  if (existingIndex > -1) {
    existingCart[existingIndex].quantity += quantity;
  } else {
    existingCart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      size: resolvedSize,
      color: resolvedColor,
      quantity,
    });
  }

  localStorage.setItem("cart", JSON.stringify(existingCart));
  window.dispatchEvent(new Event("cartUpdated"));
}
