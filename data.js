
// ==========================================
// DATA PRODUK STEPUP
// ==========================================

// Array products digunakan untuk menyimpan seluruh data produk sepatu.
// Setiap produk disimpan dalam bentuk object yang memiliki beberapa properti.
const products = [

  {
    // ID unik untuk membedakan setiap produk
    id: 1,

    // Nama produk sepatu
    name: "Air Motion Red",

    // Merek atau brand produk
    brand: "StepUp Sport",

    // Kategori produk
    category: "Running",

    // Harga produk saat ini
    price: 459000,

    // Harga sebelum diskon
    oldPrice: 529000,

    // Label khusus untuk produk
    badge: "BEST SELLER",

    // Warna produk
    color: "red",

    // Daftar ukuran sepatu yang tersedia
    sizes: [39,40,41,42,43],

    // URL gambar produk yang ditampilkan pada halaman website
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",

    // Deskripsi singkat mengenai produk
    description: "Sepatu running ringan dengan bantalan empuk untuk aktivitas harian."
  },

  {
    id: 2,
    name: "Cloud Street",
    brand: "Urban Walk",
    category: "Sneakers",
    price: 389000,

    // null berarti produk tidak memiliki harga lama atau diskon
    oldPrice: null,

    // Label produk yang menunjukkan bahwa produk populer
    badge: "POPULAR",

    color: "cream",
    sizes: [38,39,40,41,42],
    image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=85",
    description: "Sneakers kasual dengan desain minimalis yang mudah dipadukan."
  },

  {
    id: 3,
    name: "Classic Mono",
    brand: "Northside",
    category: "Casual",
    price: 329000,
    oldPrice: null,

    // String kosong berarti tidak ada label khusus yang ditampilkan
    badge: "",

    color: "gray",
    sizes: [39,40,41,42,43,44],
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=85",
    description: "Model klasik untuk tampilan santai dan aktivitas sehari-hari."
  },

  {
    id: 4,
    name: "Velocity Pro",
    brand: "StepUp Sport",
    category: "Running",
    price: 579000,
    oldPrice: 629000,

    // Label NEW menunjukkan produk baru
    badge: "NEW",

    color: "blue",
    sizes: [40,41,42,43,44],
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=85",
    description: "Didesain untuk mendukung gerakan aktif dengan sol yang responsif."
  },

  {
    id: 5,
    name: "Daily Canvas",
    brand: "Urban Walk",
    category: "Sneakers",
    price: 279000,
    oldPrice: null,
    badge: "",
    color: "white",
    sizes: [37,38,39,40,41,42],
    image: "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=900&q=85",
    description: "Sneakers simpel dan ringan untuk menemani rutinitas."
  },

  {
    id: 6,
    name: "Retro Court",
    brand: "Northside",
    category: "Casual",
    price: 419000,
    oldPrice: null,

    // Label LIMITED menunjukkan produk dengan label terbatas
    badge: "LIMITED",

    color: "green",
    sizes: [39,40,41,42,43],
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=85",
    description: "Sentuhan retro dengan siluet tegas dan tampilan modern."
  }

]; // Akhir dari array products
