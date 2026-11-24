
// ==========================================
// 1. MENUNGGU HTML SELESAI DIMUAT
// ==========================================

// DOMContentLoaded memastikan seluruh struktur HTML sudah dimuat
// sebelum JavaScript menjalankan fungsi-fungsi di dalamnya.
document.addEventListener("DOMContentLoaded", () => {

  // Mengambil elemen HTML berdasarkan ID masing-masing
  const cartItems = document.getElementById("cart-items");
  const emptyCart = document.getElementById("empty-cart");
  const orderCard = document.getElementById("order-card");
  const checkoutButton = document.getElementById("checkout-button");
  const checkoutSection = document.getElementById("checkout-section");
  const checkoutForm = document.getElementById("checkout-form");
  const successSection = document.getElementById("success-section");


  // ==========================================
  // 2. FUNGSI MENGAMBIL DETAIL PRODUK KERANJANG
  // ==========================================

  // Menggabungkan data keranjang dari LocalStorage
  // dengan informasi produk dari array products.
  function cartDetails() {

    // map() digunakan untuk memproses setiap barang dalam keranjang
    return getCart().map(cartItem => {

      // Mencari informasi produk berdasarkan ID produk
      const product = products.find(item => item.id === cartItem.id);

      // Jika produk ditemukan, gabungkan data produk dengan ukuran
      // dan jumlah barang yang tersimpan di keranjang.
      // Spread operator (...product) menyalin seluruh properti produk.
      return product
        ? { ...product, size: cartItem.size, quantity: cartItem.quantity }
        : null;

    // filter(Boolean) menghapus data null jika produk tidak ditemukan
    }).filter(Boolean);
  }


  // ==========================================
  // 3. FUNGSI MENAMPILKAN DAFTAR KERANJANG
  // ==========================================

  // Mengatur tampilan produk, jumlah barang, dan total pembayaran.
  function renderCart() {

    // Mengambil detail seluruh produk dalam keranjang
    const cart = cartDetails();

    // Menghitung total jumlah barang menggunakan reduce()
    const totalQuantity = cart.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);

    // Menghitung subtotal dari harga produk dikalikan jumlah barang
    const subtotal = cart.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Mengubah data produk menjadi tampilan HTML menggunakan map()
    // Kemudian menggabungkan seluruh hasilnya menggunakan join("").
    cartItems.innerHTML = cart.map(item => `
      <article class="cart-item">

        <!-- Menampilkan gambar produk -->
        <img src="${item.image}" alt="${item.name}">

        <!-- Menampilkan informasi produk -->
        <div class="cart-item-detail">
          <span class="product-meta">${item.brand}</span>
          <h3>${item.name}</h3>
          <p>Ukuran: <strong>${item.size}</strong></p>
          <strong>${formatRupiah(item.price)}</strong>
        </div>

        <!-- Bagian untuk mengatur jumlah dan menghapus produk -->
        <div class="cart-item-actions">

          <!-- Tombol untuk mengurangi dan menambah jumlah barang -->
          <div class="quantity-control">

            <!-- Tombol mengurangi jumlah barang -->
            <button
              type="button"
              data-action="decrease"
              data-id="${item.id}"
              data-size="${item.size}"
              aria-label="Kurangi jumlah"
            >−</button>

            <!-- Menampilkan jumlah barang saat ini -->
            <span>${item.quantity}</span>

            <!-- Tombol menambah jumlah barang -->
            <button
              type="button"
              data-action="increase"
              data-id="${item.id}"
              data-size="${item.size}"
              aria-label="Tambah jumlah"
            >＋</button>

          </div>

          <!-- Tombol untuk menghapus produk dari keranjang -->
          <button
            class="remove-button"
            type="button"
            data-action="remove"
            data-id="${item.id}"
            data-size="${item.size}"
          >Hapus</button>

        </div>
      </article>
    `).join("");


    // Menampilkan atau menyembunyikan informasi keranjang kosong
    // Jika jumlah produk tidak sama dengan 0, bagian ini disembunyikan.
    emptyCart.classList.toggle("hidden", cart.length !== 0);

    // Memberikan tampilan khusus pada ringkasan jika keranjang kosong
    orderCard.classList.toggle("muted-card", cart.length === 0);

    // Menonaktifkan tombol checkout jika tidak ada produk
    checkoutButton.disabled = cart.length === 0;

    // Menampilkan total jumlah barang pada ringkasan pesanan
    document.getElementById("summary-qty").textContent =
      `${totalQuantity} item`;

    // Menampilkan subtotal dalam format Rupiah
    document.getElementById("summary-subtotal").textContent =
      formatRupiah(subtotal);

    // Menghitung total pembayaran dengan menambahkan ongkos kirim
    // Jika keranjang kosong, total pembayaran tetap Rp0.
    document.getElementById("summary-total").textContent =
      formatRupiah(cart.length ? subtotal + SHIPPING_COST : 0);
  }


  // ==========================================
  // 4. EVENT LISTENER TOMBOL KERANJANG
  // ==========================================

  // Menangani klik pada tombol tambah, kurang, dan hapus produk.
  // Event listener dipasang pada cartItems agar dapat menangani
  // tombol yang dibuat secara dinamis menggunakan innerHTML.
  cartItems.addEventListener("click", event => {

    // Mencari tombol yang diklik dan memiliki atribut data-action
    const button = event.target.closest("button[data-action]");

    // Jika yang diklik bukan tombol yang sesuai, hentikan proses
    if (!button) return;

    // Mengambil ID produk dari atribut data-id
    const id = Number(button.dataset.id);

    // Mengambil ukuran sepatu dari atribut data-size
    const size = Number(button.dataset.size);

    // Mengambil data keranjang yang tersimpan di LocalStorage
    let cart = getCart();

    // Mencari produk berdasarkan ID dan ukuran sepatu
    const item = cart.find(entry =>
      entry.id === id && entry.size === size
    );

    // Jika produk tidak ditemukan, hentikan proses
    if (!item) return;


    // Jika tombol yang diklik adalah increase, jumlah barang ditambah 1
    if (button.dataset.action === "increase") {
      item.quantity += 1;
    }

    // Jika tombol yang diklik adalah decrease, jumlah barang dikurangi 1
    if (button.dataset.action === "decrease") {
      item.quantity -= 1;
    }

    // Jika tombol hapus diklik atau jumlah barang mencapai 0,
    // produk akan dikeluarkan dari keranjang menggunakan filter().
    if (button.dataset.action === "remove" || item.quantity <= 0) {
      cart = cart.filter(entry =>
        !(entry.id === id && entry.size === size)
      );
    }

    // Menyimpan perubahan data keranjang ke LocalStorage
    saveCart(cart);

    // Memperbarui tampilan keranjang setelah perubahan
    renderCart();
  });


  // ==========================================
  // 5. EVENT LISTENER TOMBOL CHECKOUT
  // ==========================================

  // Menjalankan proses ketika pengguna menekan tombol lanjut pemesanan
  checkoutButton.addEventListener("click", () => {

    // Memeriksa apakah keranjang kosong
    // Jika kosong, proses checkout tidak dapat dilanjutkan.
    if (getCart().length === 0) return;

    // Menampilkan bagian formulir pemesanan
    checkoutSection.classList.remove("hidden");

    // Mengarahkan tampilan layar ke bagian formulir secara halus
    checkoutSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });


  // ==========================================
  // 6. FUNGSI MENAMPILKAN PESAN ERROR
  // ==========================================

  // Fungsi untuk menampilkan pesan kesalahan pada formulir.
  // Parameter id menentukan lokasi pesan, sedangkan message
  // merupakan teks kesalahan yang akan ditampilkan.
  function setError(id, message) {
    document.getElementById(id).textContent = message;
  }


  // ==========================================
  // 7. VALIDASI DAN PENGIRIMAN FORMULIR
  // ==========================================

  // Menjalankan proses ketika formulir pemesanan dikirim
  checkoutForm.addEventListener("submit", event => {

    // Mencegah halaman melakukan refresh secara otomatis
    event.preventDefault();

    // Mengambil nilai nama pelanggan dan menghapus spasi di awal/akhir
    const name = document.getElementById("customer-name").value.trim();

    // Mengambil nomor telepon pelanggan
    const phone = document.getElementById("customer-phone").value.trim();

    // Mengambil alamat pengiriman pelanggan
    const address = document.getElementById("customer-address").value.trim();

    // Mengambil metode pembayaran yang dipilih
    const payment = document.getElementById("payment-method").value;

    // Variabel untuk menentukan apakah seluruh data sudah valid
    let valid = true;


    // Mengosongkan seluruh pesan error sebelum melakukan validasi ulang
    setError("name-error", "");
    setError("phone-error", "");
    setError("address-error", "");
    setError("payment-error", "");


    // Memeriksa apakah nama memiliki minimal 3 karakter
    if (name.length < 3) {
      setError("name-error", "Nama minimal 3 karakter.");
      valid = false;
    }

    // Memeriksa format nomor telepon menggunakan Regular Expression.
    // ^08 berarti nomor harus diawali 08.
    // [0-9]{8,11} berarti diikuti 8 sampai 11 angka.
    // Total panjang nomor menjadi 10 sampai 13 digit.
    if (!/^08[0-9]{8,11}$/.test(phone)) {
      setError(
        "phone-error",
        "Gunakan nomor Indonesia yang diawali 08 (10–13 digit)."
      );
      valid = false;
    }

    // Memeriksa apakah alamat memiliki minimal 10 karakter
    if (address.length < 10) {
      setError("address-error", "Alamat minimal 10 karakter.");
      valid = false;
    }

    // Memeriksa apakah pelanggan sudah memilih metode pembayaran
    if (!payment) {
      setError("payment-error", "Silakan pilih metode pembayaran.");
      valid = false;
    }

    // Jika masih ada data yang tidak valid, proses dihentikan
    if (!valid) return;


    // ==========================================
    // 8. MEMBUAT DATA PESANAN
    // ==========================================

    // Mengambil seluruh detail produk dari keranjang
    const items = cartDetails();

    // Menghitung subtotal berdasarkan harga dan jumlah setiap produk
    const subtotal = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Membuat object order yang berisi seluruh informasi pemesanan
    const order = {

      // Membuat nomor pesanan unik berdasarkan waktu saat ini
      code: `STP-${Date.now().toString().slice(-7)}`,

      // Menyimpan nama pelanggan
      name,

      // Menyimpan nomor telepon pelanggan
      phone,

      // Menyimpan alamat pengiriman
      address,

      // Menyimpan metode pembayaran yang dipilih
      payment,

      // Menyimpan daftar produk yang dipesan
      items,

      // Menyimpan jumlah harga seluruh produk
      subtotal,

      // Menyimpan biaya pengiriman
      shipping: SHIPPING_COST,

      // Menghitung total pembayaran termasuk ongkos kirim
      total: subtotal + SHIPPING_COST,

      // Menyimpan tanggal dan waktu pemesanan dalam format Indonesia
      date: new Date().toLocaleString("id-ID")
    };


    // Menyimpan data pesanan terakhir ke LocalStorage dalam format JSON
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));

    // Menghapus data keranjang setelah pesanan berhasil dibuat
    localStorage.removeItem(CART_KEY);

    // Menampilkan bukti atau ringkasan pesanan
    renderReceipt(order);
  });


  // ==========================================
  // 9. FUNGSI MENAMPILKAN BUKTI PESANAN
  // ==========================================

  // Menerima object order yang berisi informasi pemesanan pelanggan
  function renderReceipt(order) {

    // Menyembunyikan tampilan keranjang dan ringkasan pembayaran
    document.querySelector(".cart-layout").classList.add("hidden");

    // Menyembunyikan formulir checkout
    checkoutSection.classList.add("hidden");

    // Menampilkan bagian konfirmasi pesanan berhasil
    successSection.classList.remove("hidden");


    // Menampilkan informasi pesanan ke dalam elemen receipt-content
    document.getElementById("receipt-content").innerHTML = `

      <!-- Menampilkan nomor pesanan -->
      <div class="receipt-top">
        <span>Nomor pesanan</span>
        <strong>${order.code}</strong>
      </div>

      <!-- Menampilkan nama penerima -->
      <div class="receipt-top">
        <span>Nama penerima</span>
        <strong>${order.name}</strong>
      </div>

      <!-- Menampilkan nomor telepon -->
      <div class="receipt-top">
        <span>Nomor telepon</span>
        <strong>${order.phone}</strong>
      </div>

      <!-- Menampilkan alamat pengiriman -->
      <div class="receipt-top">
        <span>Alamat</span>
        <strong>${order.address}</strong>
      </div>

      <!-- Menampilkan metode pembayaran -->
      <div class="receipt-top">
        <span>Pembayaran</span>
        <strong>${order.payment}</strong>
      </div>

      <hr>

      <!--
        Menggunakan map() untuk menampilkan seluruh produk yang dipesan.
        Setiap produk menampilkan nama, ukuran, jumlah, dan harga total.
      -->
      ${order.items.map(item => `
        <div class="receipt-top">
          <span>${item.name} · ${item.size} · ${item.quantity}x</span>
          <strong>${formatRupiah(item.price * item.quantity)}</strong>
        </div>
      `).join("")}

      <hr>

      <!-- Menampilkan subtotal produk -->
      <div class="receipt-top">
        <span>Subtotal</span>
        <strong>${formatRupiah(order.subtotal)}</strong>
      </div>

      <!-- Menampilkan ongkos kirim -->
      <div class="receipt-top">
        <span>Ongkos kirim</span>
        <strong>${formatRupiah(order.shipping)}</strong>
      </div>

      <!-- Menampilkan total akhir pembayaran -->
      <div class="receipt-total">
        <span>Total pembayaran</span>
        <strong>${formatRupiah(order.total)}</strong>
      </div>

      <!-- Menampilkan tanggal pesanan dan status pemesanan -->
      <p class="receipt-date">
        Dibuat pada ${order.date}. Status: Menunggu konfirmasi (simulasi).
      </p>
    `;


    // Memperbarui jumlah barang pada ikon keranjang
    updateCartCount();

    // Mengembalikan tampilan layar ke bagian paling atas secara halus
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  // ==========================================
  // 10. MENAMPILKAN KERANJANG SAAT HALAMAN DIBUKA
  // ==========================================

  // Memanggil renderCart() agar data keranjang langsung ditampilkan
  // ketika pengguna membuka halaman keranjang.
  renderCart();

});
