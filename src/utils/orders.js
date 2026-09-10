// Shared "orders" store. Since there's no real backend for orders yet, this
// lives in localStorage (this browser only) — but it makes Cart -> Checkout ->
// Admin Orders/Customers a genuinely connected flow instead of static samples.

function readOrders() {
  try {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
  window.dispatchEvent(new Event("ordersUpdated"));
}

export function getOrders() {
  return readOrders();
}

export function placeOrder({ name, email, address }, items, total) {
  const orders = readOrders();
  const order = {
    id: `#SHP-${1000 + orders.length + 1}`,
    customerName: name,
    customerEmail: email,
    address,
    items,
    total,
    status: "Pending",
    date: new Date().toISOString(),
  };
  writeOrders([order, ...orders]);
  return order;
}

export function updateOrderStatus(id, status) {
  const updated = readOrders().map((o) => (o.id === id ? { ...o, status } : o));
  writeOrders(updated);
}

function readCustomerProfiles() {
  try {
    const saved = localStorage.getItem("customerProfiles");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCustomer({ name, email, phone = "", address = "" }) {
  const profiles = readCustomerProfiles();
  const normalizedEmail = email.trim().toLowerCase();
  const existingIndex = profiles.findIndex(
    (customer) => customer.email.toLowerCase() === normalizedEmail
  );
  const profile = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    address: address.trim(),
    orders: 0,
    joined: new Date().toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
  };

  if (existingIndex > -1) {
    profiles[existingIndex] = { ...profiles[existingIndex], ...profile };
  } else {
    profiles.unshift(profile);
  }

  localStorage.setItem("customerProfiles", JSON.stringify(profiles));
  window.dispatchEvent(new Event("ordersUpdated"));
  return profile;
}

function readManualCustomers() {
  try {
    const saved = localStorage.getItem("manualCustomers");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function addManualCustomer({ name, email }) {
  const list = readManualCustomers();
  const entry = {
    name,
    email,
    orders: 0,
    joined: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
  };
  const updated = [...list, entry];
  localStorage.setItem("manualCustomers", JSON.stringify(updated));
  window.dispatchEvent(new Event("ordersUpdated"));
  return entry;
}

// Combines customers derived from real orders with manually-added ones,
// so the Customers page reflects real checkouts automatically.
export function getCustomers() {
  const orders = readOrders();
  const map = new Map();

  orders.forEach((o) => {
    const key = (o.customerEmail || o.customerName || "").toLowerCase();
    if (!key) return;
    if (!map.has(key)) {
      map.set(key, {
        name: o.customerName,
        email: o.customerEmail,
        orders: 0,
        firstDate: o.date,
      });
    }
    const entry = map.get(key);
    entry.orders += 1;
    if (new Date(o.date) < new Date(entry.firstDate)) {
      entry.firstDate = o.date;
    }
  });

  const fromOrders = Array.from(map.values()).map((c) => ({
    name: c.name,
    email: c.email,
    orders: c.orders,
    joined: new Date(c.firstDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
  }));

  const combined = new Map(
    fromOrders.map((customer) => [customer.email.toLowerCase(), customer])
  );
  [...readCustomerProfiles(), ...readManualCustomers()].forEach((customer) => {
    const key = (customer.email || customer.name || "").toLowerCase();
    if (!key) return;
    if (!combined.has(key)) {
      combined.set(key, customer);
    } else if ((customer.orders || 0) > (combined.get(key).orders || 0)) {
      combined.set(key, { ...combined.get(key), ...customer });
    }
  });

  return Array.from(combined.values());
}
