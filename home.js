
// ==========================================
// MENAMPILKAN PRODUK UNGGULAN DI HALAMAN HOME
// ==========================================

// Menunggu sampai seluruh struktur HTML selesai dimuat
document.addEventListener("DOMContentLoaded", () => {

  // Mengambil elemen HTML yang memiliki ID featured-products
  const featured = document.getElementById("featured-products");

  // Memeriksa apakah elemen featured-products ditemukan
  if (featured) {

    // Mengambil 4 produk pertama dari array products menggunakan slice(0, 4)
    // map(productCard) mengubah setiap data produk menjadi tampilan HTML
    // join("") menggabungkan seluruh hasil HTML menjadi satu string
    featured.innerHTML = products.slice(0, 4).map(productCard).join("");

  }
});
