import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../Dashboard/AdminDashboard.css";
import "./AdminProducts.css";

// Dedicated backend for the Admin Products page (separate from the main
// storefront backend, which keeps handling Search/New Arrivals/etc as-is).
const API_BASE = "https://dashboard-backend-beta-orpin.vercel.app/api/products";
const STORAGE_KEY = "shopco_admin_products";
// Ids (raw backend _id, no "api-" prefix) that were deleted locally, so the
// background API-merge effect never resurrects them after a refresh.
const DELETED_KEY = "shopco_admin_deleted_ids";

// Collapses "ghost duplicates": if a product was added locally (id
// "local-...") and its POST to the backend hadn't confirmed yet, a page
// refresh could pull the same product back in from the API with a
// different id ("api-..."), showing it twice. This merges any pair that
// shares the same name+price into a single entry, preferring the real
// backend id when one exists.
function dedupeProducts(list) {
  const seen = new Map();
  const order = [];
  list.forEach((p) => {
    const key = `${(p.name || "").trim().toLowerCase()}|${(p.price || "").trim()}`;
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, p);
      order.push(key);
    } else if (existing.id.startsWith("local-") && !p.id.startsWith("local-")) {
      // Keep the synced (api-/default-) version over the pending local one.
      seen.set(key, p);
    }
  });
  return order.map((key) => seen.get(key));
}

function loadDeletedIds() {
  try {
    const saved = localStorage.getItem(DELETED_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveDeletedIds(set) {
  try {
    localStorage.setItem(DELETED_KEY, JSON.stringify([...set]));
  } catch (err) {
    console.error("Could not save deleted ids:", err);
  }
}

// Shrinks + re-encodes an image file so the base64 we store/send stays well
// under typical server body-size limits (fixes the 413 on add).
function compressImageFile(file, maxDim = 700, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (width > height && width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else if (height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
    img.src = objectUrl;
  });
}

// Always-available starting list, so the table is never empty even if
// localStorage is empty and the API can't be reached.
const defaultProducts = [
  { id: "default-1", name: "Classic Denim Jacket", detail: "Casual everyday jacket.", price: "Rs. 4,500", image: "" },
  { id: "default-2", name: "Slim Fit Formal Shirt", detail: "Crisp formal wear.", price: "Rs. 2,800", image: "" },
  { id: "default-3", name: "Gym Performance Tee", detail: "Breathable workout tee.", price: "Rs. 1,600", image: "" },
  { id: "default-4", name: "Party Sequin Top", detail: "Statement party piece.", price: "Rs. 5,200", image: "" },
];

function loadStoredProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    return Array.isArray(parsed) && parsed.length > 0
      ? dedupeProducts(parsed)
      : defaultProducts;
  } catch (err) {
    console.error("Could not read saved products, using defaults:", err);
    return defaultProducts;
  }
}

function saveStoredProducts(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Could not save products locally:", err);
  }
}

// Normalize whatever shape the API returns. Returns null for anything
// unusable so a bad item can never crash the page.
function normalizeApiProduct(item) {
  const rawId = item?._id || item?.id;
  if (!rawId) return null;
  return {
    id: `api-${rawId}`,
    name: item.name || item.title || "Untitled product",
    detail: item.description || item.detail || "",
    price: typeof item.price === "number" ? `$${item.price}` : item.price || "",
    image: item.image || item.imageUrl || "",
  };
}

function AdminProducts() {
  const [products, setProducts] = useState(() => loadStoredProducts());
  const [query, setQuery] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", detail: "", price: "", image: "" });
  const [error, setError] = useState("");

  // Whatever is currently on screen is always the source of truth for
  // next time the dashboard is opened.
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  // Best-effort: pull extra products in from the API in the background.
  // This only ADDS new items — it can never wipe out what's already
  // showing, so a slow/unreachable API can't leave the table empty.
  useEffect(() => {
    let cancelled = false;

    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data?.products || [];
        const apiProducts = list.map(normalizeApiProduct).filter(Boolean);
        if (apiProducts.length === 0) return;

        const deletedIds = loadDeletedIds();

        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const merged = [...prev];
          const toAppend = [];

          apiProducts.forEach((apiP) => {
            const rawId = apiP.id.replace(/^api-/, "");
            if (deletedIds.has(rawId) || existingIds.has(apiP.id)) return;

            // If this product is still sitting locally under a temporary
            // "local-" id (its POST hadn't confirmed yet), upgrade that
            // entry to the real backend id instead of adding a duplicate.
            const pendingIndex = merged.findIndex(
              (p) =>
                p.id.startsWith("local-") &&
                p.name === apiP.name &&
                p.price === apiP.price
            );
            if (pendingIndex !== -1) {
              merged[pendingIndex] = { ...merged[pendingIndex], id: apiP.id };
            } else {
              toAppend.push(apiP);
            }
          });

          return dedupeProducts(toAppend.length > 0 ? [...merged, ...toAppend] : merged);
        });
      })
      .catch((err) => {
        console.warn("Products API not reachable right now, showing saved products only:", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = products.filter((p) =>
    (p.name || "").toLowerCase().includes(query.toLowerCase())
  );

  function handleDelete(id) {
    console.log("Remove product clicked:", id);
    try {
      // Remove from the visible list immediately.
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product removed.");

      // If this product came from the backend, delete it there too so it
      // doesn't get pulled back in by the background sync on next load.
      if (id.startsWith("api-")) {
        const rawId = id.replace(/^api-/, "");

        const deletedIds = loadDeletedIds();
        deletedIds.add(rawId);
        saveDeletedIds(deletedIds);

        fetch(`${API_BASE}/${rawId}`, { method: "DELETE" }).catch((err) =>
          console.warn("Could not delete product on the server:", err)
        );
      }
    } catch (err) {
      console.error("Remove product failed:", err);
      toast.error("Something went wrong removing the product — check the console.");
    }
  }

  function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFile(file)
      .then((dataUrl) => setForm((f) => ({ ...f, image: dataUrl })))
      .catch((err) => {
        console.error("Could not process image, falling back to raw file:", err);
        const reader = new FileReader();
        reader.onload = () => setForm((f) => ({ ...f, image: reader.result }));
        reader.readAsDataURL(file);
      });
  }

  function handleAdd(e) {
    e.preventDefault();
    console.log("Add product submit fired:", form);

    try {
      const name = (form.name || "").trim();
      const price = (form.price || "").trim() || "Rs. 0";
      const detail = (form.detail || "").trim();

      if (!name) {
        setError("Product name is required.");
        toast.error("Product name is required.");
        return;
      }

      const newProduct = {
        id: `local-${Date.now()}`,
        name,
        detail,
        price,
        image: form.image,
      };

      // Update the UI immediately — this never waits on the network.
      setProducts((prev) => [newProduct, ...prev]);

      setForm({ name: "", detail: "", price: "", image: "" });
      setError("");
      setFormOpen(false);
      toast.success("Product added!");

      // Best-effort sync to the backend; the product is already saved
      // locally either way, so this can't block the add. If it succeeds,
      // swap in the real backend id so a later Remove can delete it there
      // too (instead of only ever removing it locally).
      fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.detail,
          price: newProduct.price,
          image: newProduct.image,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            if (res.status === 413) {
              toast.warn("Saved here, but the image was too large for the server — try a smaller picture next time.");
            } else {
              toast.warn("Saved here, but couldn't sync to the server (it'll only show on this device).");
            }
            return;
          }
          const saved = await res.json().catch(() => null);
          const savedId = saved?._id || saved?.id;
          if (savedId) {
            setProducts((prev) =>
              prev.map((p) => (p.id === newProduct.id ? { ...p, id: `api-${savedId}` } : p))
            );
          }
        })
        .catch((err) => {
          console.warn("Could not sync new product to API:", err);
          toast.warn("Saved here, but couldn't reach the server (it'll only show on this device).");
        });
    } catch (err) {
      console.error("Add product failed:", err);
      toast.error("Something went wrong adding the product — check the console.");
    }
  }

  return (
    <div className="admin-card">
      <div className="admin-toolbar">
        <input
          className="admin-search-input"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="admin-btn" onClick={() => setFormOpen((v) => !v)}>
          {formOpen ? "Cancel" : "+ Add product"}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleAdd} className="add-product-form">
          <div className="add-product-image">
            {form.image ? (
              <img src={form.image} alt="Preview" />
            ) : (
              <span>No image</span>
            )}
            <label className="add-product-upload">
              Choose picture
              <input type="file" accept="image/*" onChange={handleImageFile} hidden />
            </label>
          </div>

          <div className="add-product-fields">
            <input
              className="admin-search-input"
              placeholder="Product name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <textarea
              className="admin-search-input"
              placeholder="Product detail / description"
              rows={3}
              value={form.detail}
              onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))}
            />
            <input
              className="admin-search-input"
              placeholder="Price e.g. Rs. 3,000"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />
            <button type="submit" className="admin-btn">
              Add product
            </button>
            {error && <p className="checkout-error">{error}</p>}
          </div>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Detail</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id}>
              <td>
                {p.image ? (
                  <img src={p.image} alt={p.name} className="admin-product-thumb" />
                ) : (
                  <div className="admin-product-thumb admin-product-thumb--empty" />
                )}
              </td>
              <td>{p.name}</td>
              <td className="admin-product-detail">{p.detail || "—"}</td>
              <td>{p.price}</td>
              <td>
                <button
                  className="admin-btn admin-btn--ghost"
                  onClick={() => handleDelete(p.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProducts;
