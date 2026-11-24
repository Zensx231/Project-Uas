
/*
  Menunggu seluruh struktur HTML selesai dimuat
  sebelum JavaScript menjalankan fungsinya.
*/
document.addEventListener("DOMContentLoaded", () => {

  // Mengambil elemen HTML berdasarkan ID masing-masing.
  const grid = document.getElementById("catalog-products"); // Tempat menampilkan kartu produk.
  const searchInput = document.getElementById("search-input"); // Input pencarian produk.
  const categoryFilter = document.getElementById("category-filter"); // Pilihan filter kategori.
  const sortFilter = document.getElementById("sort-filter"); // Pilihan pengurutan produk.
  const resultCount = document.getElementById("product-result-count"); // Informasi jumlah produk.
  const emptyState = document.getElementById("no-products"); // Tampilan ketika produk tidak ditemukan.


  // ==========================================
  // 1. FUNGSI UNTUK MENAMPILKAN PRODUK
  // ==========================================

  // Fungsi ini digunakan untuk mencari, menyaring,
  // mengurutkan, dan menampilkan produk pada halaman katalog.
  function renderProducts() {

    // Mengambil kata kunci pencarian.
    // trim() menghapus spasi di awal dan akhir.
    // toLowerCase() mengubah teks menjadi huruf kecil
    // agar pencarian tidak membedakan huruf besar dan kecil.
    const keyword = searchInput.value.trim().toLowerCase();

    // Mengambil kategori yang dipilih pengguna.
    const category = categoryFilter.value;

    // ==========================================
    // 2. FILTER PRODUK
    // ==========================================

    // filter() digunakan untuk menyaring produk
    // berdasarkan kata kunci dan kategori.
    let filtered = products.filter(product => {

      // Memeriksa apakah nama atau merek produk
      // mengandung kata kunci yang dimasukkan pengguna.
      const matchesKeyword =
        product.name.toLowerCase().includes(keyword) ||
        product.brand.toLowerCase().includes(keyword);

      // Memeriksa apakah kategori produk sesuai
      // dengan kategori yang dipilih pengguna.
      // Jika memilih "Semua", seluruh kategori ditampilkan.
      const matchesCategory =
        category === "Semua" || product.category === category;

      // Produk ditampilkan jika kedua kondisi terpenuhi.
      return matchesKeyword && matchesCategory;
    });


    // ==========================================
    // 3. SELECTION / PENGURUTAN PRODUK
    // ==========================================

    // switch digunakan untuk menentukan pengurutan
    // berdasarkan pilihan yang dipilih pengguna.
    switch (sortFilter.value) {

      // Mengurutkan harga dari yang paling rendah.
      case "low":
        filtered.sort((a, b) => a.price - b.price);
        break;

      // Mengurutkan harga dari yang paling tinggi.
      case "high":
        filtered.sort((a, b) => b.price - a.price);
        break;

      // Mengurutkan nama produk berdasarkan abjad A-Z.
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;

      // Jika tidak ada pilihan khusus,
      // produk diurutkan berdasarkan ID terkecil.
      default:
        filtered.sort((a, b) => a.id - b.id);
    }


    // ==========================================
    // 4. MENAMPILKAN KARTU PRODUK
    // ==========================================

    // map() digunakan untuk mengubah setiap data produk
    // menjadi elemen HTML berupa kartu produk.
    // join("") menggabungkan seluruh HTML menjadi satu string.
    grid.innerHTML = filtered.map(product => `

      <!-- Elemen utama kartu produk -->
      <article class="product-card catalog-card">

        <!-- Bagian gambar produk -->
        <div class="product-image-wrap">

          <!--
            Jika produk memiliki badge, tampilkan badge.
            Jika tidak memiliki badge, bagian ini dikosongkan.
          -->
          ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}

          <!-- Menampilkan gambar dan nama produk -->
          <!-- loading="lazy" membuat gambar dimuat saat diperlukan -->
          <img src="${product.image}" alt="${product.name}" loading="lazy">

        </div>

        <!-- Bagian informasi produk -->
        <div class="product-info">

          <!-- Menampilkan merek dan kategori produk -->
          <div class="product-meta">
            <span>${product.brand}</span>
            <span>${product.category}</span>
          </div>

          <!-- Menampilkan nama produk -->
          <h3>${product.name}</h3>

          <!-- Menampilkan deskripsi produk -->
          <p class="product-description">${product.description}</p>

          <!-- Bagian informasi harga produk -->
          <div class="product-bottom">
            <div>

              <!-- Menampilkan harga jual menggunakan format Rupiah -->
              <strong>${formatRupiah(product.price)}</strong>

              <!--
                Jika terdapat harga lama, tampilkan harga lama
                dengan format coretan.
              -->
              ${product.oldPrice ? `<del>${formatRupiah(product.oldPrice)}</del>` : ""}

            </div>
          </div>

          <!-- ====================================== -->
          <!-- 5. PILIH UKURAN DAN TAMBAH KE KERANJANG -->
          <!-- ====================================== -->

          <div class="purchase-controls">

            <!-- Pilihan ukuran sepatu -->
            <label class="size-select">
              Ukuran

              <!--
                Menampilkan pilihan ukuran berdasarkan data produk.
                data-product-id digunakan untuk menghubungkan
                pilihan ukuran dengan produk yang sesuai.
              -->
              <select class="size-choice" data-product-id="${product.id}">

                <!--
                  map() digunakan untuk menampilkan setiap ukuran
                  yang tersedia pada produk.
                -->
                ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join("")}

              </select>
            </label>

            <!-- Tombol untuk menambahkan produk ke keranjang -->
            <!-- data-product-id menyimpan ID produk -->
            <button
              class="button button-dark add-cart-button"
              data-product-id="${product.id}"
              type="button"
            >
              ＋ Keranjang
            </button>

          </div>
        </div>
      </article>

    `).join("");


    // ==========================================
    // 6. MEMPERBARUI INFORMASI HASIL PENCARIAN
    // ==========================================

    // Menampilkan jumlah produk yang sesuai dengan filter
    // dibandingkan dengan jumlah seluruh produk.
    resultCount.textContent =
      `Menampilkan ${filtered.length} dari ${products.length} produk`;

    // Jika tidak ada produk, tampilkan pesan produk tidak ditemukan.
    // Jika ada produk, sembunyikan pesan tersebut.
    emptyState.classList.toggle("hidden", filtered.length !== 0);

    // Jika tidak ada produk, sembunyikan area katalog.
    // Jika ada produk, tampilkan area katalog.
    grid.classList.toggle("hidden", filtered.length === 0);
  }


  // ==========================================
  // 7. EVENT LISTENER PENCARIAN DAN FILTER
  // ==========================================

  // Menjalankan renderProducts setiap kali pengguna
  // mengetik atau mengubah kata kunci pencarian.
  searchInput.addEventListener("input", renderProducts);

  // Menjalankan renderProducts ketika kategori berubah.
  categoryFilter.addEventListener("change", renderProducts);

  // Menjalankan renderProducts ketika pilihan pengurutan berubah.
  sortFilter.addEventListener("change", renderProducts);


  // ==========================================
  // 8. EVENT DELEGATION TOMBOL KERANJANG
  // ==========================================

  // Event delegation digunakan untuk menangani klik tombol
  // pada kartu produk yang dibuat secara dinamis.
  grid.addEventListener("click", event => {

    // Mencari tombol tambah keranjang yang menjadi target klik
    // atau elemen induk terdekat yang memiliki class tersebut.
    const button = event.target.closest(".add-cart-button");

    // Jika yang diklik bukan tombol tambah keranjang,
    // hentikan proses.
    if (!button) return;

    // Mengambil ID produk dari atribut data-product-id.
    const productId = button.dataset.productId;

    // Mencari pilihan ukuran yang sesuai dengan ID produk.
    const sizeSelect = grid.querySelector(
      `.size-choice[data-product-id="${productId}"]`
    );

    // Memanggil fungsi addToCart() dari app.js
    // untuk memasukkan produk dan ukuran yang dipilih
    // ke dalam keranjang belanja.
    addToCart(productId, sizeSelect.value);

    // Mengubah tulisan tombol setelah produk ditambahkan.
    button.textContent = "✓ Ditambahkan";

    // Menambahkan class button-success untuk mengubah tampilan tombol.
    button.classList.add("button-success");

    // Setelah 1200 milidetik (1,2 detik),
    // tulisan tombol dikembalikan seperti semula.
    setTimeout(() => {

      // Mengembalikan tulisan tombol.
      button.innerHTML = "＋ Keranjang";

      // Menghapus class button-success.
      button.classList.remove("button-success");

    }, 1200);
  });


  // ==========================================
  // 9. PENGGUNAAN LIBRARY JQUERY
  // ==========================================

  // Memeriksa apakah library jQuery tersedia pada halaman.
  if (window.jQuery) {

    // Menggunakan jQuery untuk mendeteksi perubahan kategori.
    $("#category-filter").on("change", function () {

      // stop(true, true) menghentikan animasi sebelumnya
      // dan menyelesaikan animasi yang sedang berjalan.
      //
      // hide() menyembunyikan kartu produk.
      // fadeIn(220) menampilkan kembali kartu dengan
      // efek transparansi selama 220 milidetik.
      $(".catalog-card").stop(true, true).hide().fadeIn(220);

    });
  }


  // ==========================================
  // 10. MENAMPILKAN PRODUK SAAT HALAMAN DIBUKA
  // ==========================================

  // Memanggil fungsi renderProducts() pertama kali
  // agar seluruh produk langsung ditampilkan
  // ketika halaman katalog selesai dimuat.
  renderProducts();

});
