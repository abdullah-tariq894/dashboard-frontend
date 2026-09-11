// Bridges the Admin dashboard's product backend into the public storefront
// (New Arrivals, Shop, Product Detail) WITHOUT touching the existing
// storefront backend (dashboard-backend-beta-orpin) or how AdminProducts.jsx works.
// Admin products are fetched from their own API and merged in, tagged with
// an "admin-" id prefix so Product Detail knows which backend to ask when
// someone opens one.

const ADMIN_API_BASE = "https://dashboard-backend-beta-orpin.vercel.app/api/products";
const ADMIN_ID_PREFIX = "admin-";

// "Rs. 4,500" / "$45" / 45 -> 4500 / 45 / 45 — a plain number, since the
// storefront cards/detail page always render price as `${product.price}`
// and cart math (Cart.jsx, cart.js) does price * quantity.
function parsePriceNumber(price) {
  if (typeof price === "number" && !Number.isNaN(price)) return price;
  const digits = String(price ?? "").replace(/[^0-9.]/g, "");
  const num = parseFloat(digits);
  return Number.isNaN(num) ? 0 : num;
}

// Shapes a raw admin-backend product into the same fields New Arrivals /
// Shop / Product Detail already expect from the main backend.
export function normalizeAdminProduct(item) {
  const rawId = item?._id || item?.id;
  if (!rawId) return null;

  const image = item.image || item.imageUrl || "";
  return {
    id: `${ADMIN_ID_PREFIX}${rawId}`,
    _id: `${ADMIN_ID_PREFIX}${rawId}`,
    name: item.name || item.title || "Untitled product",
    description: item.description || item.detail || "",
    price: parsePriceNumber(item.price),
    image,
    gallery: [image, image, image].filter(Boolean),
    rating: item.rating || 5,
    // No size/color/dress-style metadata comes from the Admin dashboard
    // (its "Add product" form only takes name/detail/price/image), so these
    // stay undefined on purpose — Shop.jsx treats admin-sourced products as
    // always matching the sidebar filters instead of hiding them.
    source: "admin",
  };
}

// Fetches every admin-added product, already normalized. Never throws —
// resolves to [] on any failure so a down/unreachable admin API can never
// break the storefront.
export async function fetchAdminProducts() {
  try {
    const res = await fetch(ADMIN_API_BASE);
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : data?.products || [];
    return list.map(normalizeAdminProduct).filter(Boolean);
  } catch (err) {
    console.warn(
      "Admin products backend not reachable, storefront will just show the main catalog:",
      err
    );
    return [];
  }
}

export function isAdminProductId(id) {
  return typeof id === "string" && id.startsWith(ADMIN_ID_PREFIX);
}

// Looks up a single admin product by the (prefixed) id used across the
// storefront. Tries a direct GET first, falls back to scanning the full
// list in case the admin backend has no single-item route.
export async function fetchAdminProductById(prefixedId) {
  const rawId = String(prefixedId).replace(ADMIN_ID_PREFIX, "");

  try {
    const res = await fetch(`${ADMIN_API_BASE}/${rawId}`);
    if (res.ok) {
      const item = await res.json();
      const normalized = normalizeAdminProduct(item?.product || item);
      if (normalized) return normalized;
    }
  } catch (err) {
    console.warn("Direct admin product lookup failed, falling back to list scan:", err);
  }

  const all = await fetchAdminProducts();
  return all.find((p) => p.id === prefixedId) || null;
}
