
// ==========================================
// 1. KONFIGURASI DAN KONSTANTA
// ==========================================

// Menentukan nama penyimpanan keranjang belanja di LocalStorage
const CART_KEY = "stepup_cart";

// Menentukan nama penyimpanan pesanan terakhir di LocalStorage
const ORDER_KEY = "stepup_last_order";

// Menentukan biaya pengiriman sebesar Rp15.000
const SHIPPING_COST = 15000;


// ==========================================
// 2. FUNGSI FORMAT HARGA RUPIAH
// ==========================================

// Fungsi untuk mengubah angka menjadi format mata uang Rupiah
function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",       // Menentukan format sebagai mata uang
    currency: "IDR",         // Menggunakan mata uang Rupiah
    maximumFractionDigits: 0 // Menghilangkan angka desimal
  }).format(amount);
}


// ==========================================
// 3. FUNGSI MENGAMBIL DATA KERANJANG
// ==========================================

// Mengambil data keranjang belanja dari LocalStorage
function getCart() {
  try {
    // Mengambil data berdasarkan CART_KEY lalu mengubah JSON menjadi array
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    // Jika data gagal dibaca, kembalikan array kosong
    return [];
  }
}


// ==========================================
// 4. FUNGSI MENYIMPAN DATA KERANJANG
// ==========================================

// Menyimpan perubahan keranjang belanja ke LocalStorage
function saveCart(cart) {
  // Mengubah data array menjadi JSON sebelum disimpan
  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  // Memperbarui jumlah barang yang tampil pada ikon keranjang
  updateCartCount();
}


// ==========================================
// 5. FUNGSI MEMPERBARUI JUMLAH KERANJANG
// ==========================================

// Menghitung total seluruh barang yang ada di keranjang
function updateCartCount() {
  // Mengambil data keranjang dan menjumlahkan quantity setiap barang
  const totalItems = getCart().reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  // Mengambil semua elemen HTML yang memiliki atribut data-cart-count
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    // Menampilkan jumlah barang pada elemen HTML tersebut
    el.textContent = totalItems;
  });
}


// ==========================================
// 6. FUNGSI MENAMBAHKAN PRODUK KE KERANJANG
// ==========================================

// Fungsi ini menerima ID produk dan ukuran sepatu yang dipilih
function addToCart(productId, size) {

  // Mencari produk berdasarkan ID dari data produk
  const product = products.find(item => item.id === Number(productId));

  // Jika produk tidak ditemukan atau ukuran belum dipilih, hentikan fungsi
  if (!product || !size) return;

  // Mengambil data keranjang yang sudah tersimpan
  const cart = getCart();

  // Memeriksa apakah produk dengan ukuran yang sama sudah ada di keranjang
  const existing = cart.find(item =>
    item.id === product.id && item.size === Number(size)
  );

  // Jika produk dan ukurannya sudah ada, jumlah barang ditambah satu
  if (existing) {
    existing.quantity += 1;
  } else {
    // Jika belum ada, tambahkan produk baru ke dalam array keranjang
    cart.push({
      id: product.id,
      size: Number(size),
      quantity: 1
    });
  }

  // Menyimpan perubahan data keranjang
  saveCart(cart);

  // Menampilkan pemberitahuan bahwa produk berhasil ditambahkan
  showToast(`${product.name} ukuran ${size} ditambahkan ke keranjang.`);
}


// ==========================================
// 7. FUNGSI MENAMPILKAN NOTIFIKASI
// ==========================================

// Menampilkan pesan sementara ketika pengguna melakukan tindakan
function showToast(message) {

  // Mengambil elemen HTML dengan ID toast
  const toast = document.getElementById("toast");

  // Jika elemen toast tidak ditemukan, hentikan fungsi
  if (!toast) return;

  // Mengubah isi teks notifikasi sesuai pesan yang diterima
  toast.textContent = message;

  // Menambahkan class show agar notifikasi terlihat
  toast.classList.add("show");

  // Menghapus timer notifikasi sebelumnya jika masih berjalan
  clearTimeout(window.toastTimer);

  // Menghilangkan notifikasi secara otomatis setelah 2.600 milidetik
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}


// ==========================================
// 8. FUNGSI MEMBUAT TAMPILAN KARTU PRODUK
// ==========================================

// Menghasilkan struktur HTML untuk menampilkan satu produk
function productCard(product) {
  return `
    <article class="product-card">

      <!-- Bagian gambar produk yang dapat diklik untuk membuka katalog -->
      <a class="product-image-wrap"
         href="produk.html"
         aria-label="Lihat katalog ${product.name}">

        <!-- Menampilkan label produk jika produk memiliki badge -->
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}

        <!-- Menampilkan gambar dan nama produk -->
        <img src="${product.image}"
             alt="${product.name}"
             loading="lazy">

        <!-- Ikon panah pada gambar produk -->
        <span class="image-arrow">↗</span>
      </a>

      <!-- Bagian informasi produk -->
      <div class="product-info">

        <!-- Menampilkan merek dan kategori produk -->
        <div class="product-meta">
          <span>${product.brand}</span>
          <span>${product.category}</span>
        </div>

        <!-- Menampilkan nama produk -->
        <h3>${product.name}</h3>

        <!-- Bagian harga dan tautan untuk memilih produk -->
        <div class="product-bottom">
          <div>

            <!-- Menampilkan harga produk dalam format Rupiah -->
            <strong>${formatRupiah(product.price)}</strong>

            <!-- Menampilkan harga lama jika tersedia -->
            ${product.oldPrice ? `<del>${formatRupiah(product.oldPrice)}</del>` : ""}
          </div>

          <!-- Tautan menuju halaman katalog untuk memilih produk -->
          <a class="add-link"
             href="produk.html"
             aria-label="Pilih ${product.name}">＋</a>
        </div>
      </div>
    </article>`;
}


// ==========================================
// 9. FUNGSI MENU NAVIGASI MOBILE
// ==========================================

// Mengatur tombol menu navigasi pada tampilan perangkat mobile
function setupMobileMenu() {

  // Mengambil elemen tombol menu
  const toggle = document.querySelector(".menu-toggle");

  // Mengambil elemen navigasi utama
  const nav = document.querySelector(".main-nav");

  // Jika tombol atau navigasi tidak ditemukan, hentikan fungsi
  if (!toggle || !nav) return;

  // Menjalankan perintah ketika tombol menu diklik
  toggle.addEventListener("click", () => {

    // Menambahkan atau menghapus class nav-open pada navigasi
    const opened = nav.classList.toggle("nav-open");

    // Memperbarui atribut aria-expanded sesuai kondisi menu
    toggle.setAttribute("aria-expanded", String(opened));
  });
}


// ==========================================
// 10. MENJALANKAN FUNGSI SETELAH HTML DIMUAT
// ==========================================

// DOMContentLoaded berjalan setelah struktur HTML selesai dimuat
document.addEventListener("DOMContentLoaded", () => {

  // Memperbarui jumlah barang pada ikon keranjang
  updateCartCount();

  // Mengaktifkan fungsi menu navigasi mobile
  setupMobileMenu();
});
