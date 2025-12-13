// Mock database layer - Replace with actual database (MongoDB, PostgreSQL, etc.)
// This provides a simple in-memory store for demonstration

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string; // Should be hashed in production
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  images: Array<{ url: string; alt: string }>;
  variants?: Array<{ name: string; value: string; stock: number; sku: string }>;
  stock: number;
  tags: string[];
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Order {
  id: string;
  userId: string;
  items: Array<{
    product: string;
    quantity: number;
    price: number;
    variant?: { name: string; value: string };
  }>;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    landmark?: string;
  };
  deliveryZone?: { zone: string; cost: number };
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Booking {
  id: string;
  userId: string;
  service: string;
  artist: { type: string; name: string };
  location: string;
  appointmentDate: string;
  timeSlot: { start: string; end: string };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Simple in-memory database
export const db = {
  users: new Map<string, User>(),
  categories: new Map<string, Category>(),
  products: new Map<string, Product>(),
  orders: new Map<string, Order>(),
  bookings: new Map<string, Booking>(),
};

// Utility functions for generating IDs
export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// User operations
export const createUser = (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
  const id = generateId();
  const newUser: User = { ...user, id, createdAt: new Date(), updatedAt: new Date() };
  db.users.set(id, newUser);
  return newUser;
};

export const getUserById = (id: string): User | null => {
  return db.users.get(id) || null;
};

export const getUserByEmail = (email: string): User | null => {
  for (const user of db.users.values()) {
    if (user.email === email) return user;
  }
  return null;
};

export const updateUser = (id: string, updates: Partial<User>): User | null => {
  const user = db.users.get(id);
  if (!user) return null;
  const updated = { ...user, ...updates, updatedAt: new Date() };
  db.users.set(id, updated);
  return updated;
};

// Category operations
export const createCategory = (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category => {
  const id = generateId();
  const newCategory: Category = { ...category, id, createdAt: new Date(), updatedAt: new Date() };
  db.categories.set(id, newCategory);
  return newCategory;
};

export const getAllCategories = (): Category[] => {
  return Array.from(db.categories.values());
};

export const getCategoryById = (id: string): Category | null => {
  return db.categories.get(id) || null;
};

export const updateCategory = (id: string, updates: Partial<Category>): Category | null => {
  const category = db.categories.get(id);
  if (!category) return null;
  const updated = { ...category, ...updates, updatedAt: new Date() };
  db.categories.set(id, updated);
  return updated;
};

// Product operations
export const createProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
  const id = generateId();
  const newProduct: Product = { ...product, id, createdAt: new Date(), updatedAt: new Date() };
  db.products.set(id, newProduct);
  return newProduct;
};

export const getAllProducts = (page = 1, limit = 12, category?: string, search?: string, sort = '-createdAt'): { products: Product[]; total: number } => {
  let products = Array.from(db.products.values());

  if (category) {
    products = products.filter(p => p.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(searchLower) || p.tags.some(t => t.toLowerCase().includes(searchLower)));
  }

  // Sorting
  if (sort === '-createdAt') {
    products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } else if (sort === 'createdAt') {
    products.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  const total = products.length;
  const start = (page - 1) * limit;
  const paginatedProducts = products.slice(start, start + limit);

  return { products: paginatedProducts, total };
};

export const getProductById = (id: string): Product | null => {
  return db.products.get(id) || null;
};

export const getFeaturedProducts = (): Product[] => {
  return Array.from(db.products.values()).filter(p => p.isFeatured);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return Array.from(db.products.values()).filter(p => p.category === categoryId);
};

export const updateProduct = (id: string, updates: Partial<Product>): Product | null => {
  const product = db.products.get(id);
  if (!product) return null;
  const updated = { ...product, ...updates, updatedAt: new Date() };
  db.products.set(id, updated);
  return updated;
};

export const deleteProduct = (id: string): boolean => {
  return db.products.delete(id);
};

// Order operations
export const createOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order => {
  const id = generateId();
  const newOrder: Order = { ...order, id, status: 'pending', createdAt: new Date(), updatedAt: new Date() };
  db.orders.set(id, newOrder);
  return newOrder;
};

export const getUserOrders = (userId: string): Order[] => {
  return Array.from(db.orders.values()).filter(o => o.userId === userId);
};

export const getOrderById = (id: string): Order | null => {
  return db.orders.get(id) || null;
};

export const getAllOrders = (page = 1, limit = 20, status?: string): { orders: Order[]; total: number } => {
  let orders = Array.from(db.orders.values());

  if (status) {
    orders = orders.filter(o => o.status === status);
  }

  orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const total = orders.length;
  const start = (page - 1) * limit;
  const paginatedOrders = orders.slice(start, start + limit);

  return { orders: paginatedOrders, total };
};

export const updateOrder = (id: string, updates: Partial<Order>): Order | null => {
  const order = db.orders.get(id);
  if (!order) return null;
  const updated = { ...order, ...updates, updatedAt: new Date() };
  db.orders.set(id, updated);
  return updated;
};

// Booking operations
export const createBooking = (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Booking => {
  const id = generateId();
  const newBooking: Booking = { ...booking, id, status: 'pending', createdAt: new Date(), updatedAt: new Date() };
  db.bookings.set(id, newBooking);
  return newBooking;
};

export const getUserBookings = (userId: string): Booking[] => {
  return Array.from(db.bookings.values()).filter(b => b.userId === userId);
};

export const getBookingById = (id: string): Booking | null => {
  return db.bookings.get(id) || null;
};

export const updateBooking = (id: string, updates: Partial<Booking>): Booking | null => {
  const booking = db.bookings.get(id);
  if (!booking) return null;
  const updated = { ...booking, ...updates, updatedAt: new Date() };
  db.bookings.set(id, updated);
  return updated;
};

export const checkAvailability = (date: string, location: string, artistType: string): boolean => {
  // Simple availability check - can be enhanced with more complex logic
  const bookingsOnDate = Array.from(db.bookings.values()).filter(
    b => b.appointmentDate === date && b.location === location && b.artist.type === artistType && b.status !== 'cancelled'
  );
  return bookingsOnDate.length < 5; // Limit 5 bookings per day per artist per location
};
