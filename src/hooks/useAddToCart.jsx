import { useState } from "react";
import { addToCart } from "../utils/cart";
import { saveCustomer } from "../utils/orders";
import CustomerDetailsModal from "../components/AddToCartModal/CustomerDetailsModal";

export function useAddToCart() {
  const [pending, setPending] = useState(null);

  const requestAddToCart = (product, options = {}) => {
    if (!product) return;
    setPending({ product, options });
  };

  const handleCustomerSubmit = (details) => {
    if (!pending) return;
    saveCustomer(details);
    addToCart(pending.product, pending.options);
    setPending(null);
  };

  const customerDetailsModal = pending ? (
    <CustomerDetailsModal
      product={pending.product}
      onClose={() => setPending(null)}
      onSubmit={handleCustomerSubmit}
    />
  ) : null;

  return { requestAddToCart, customerDetailsModal };
}