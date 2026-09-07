/**
 * Mengonversi nominal angka menjadi kalimat terbilang Rupiah dalam Bahasa Indonesia.
 * Contoh: 750000 -> "Tujuh Ratus Lima Puluh Ribu Rupiah"
 */
export function terbilangRupiah(number) {
  if (!number || isNaN(number) || number <= 0) return "";

  const angka = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];

  function convert(n) {
    if (n < 12) return angka[n];
    if (n < 20) return convert(n - 10) + " Belas";
    if (n < 100)
      return (
        convert(Math.floor(n / 10)) +
        " Puluh" +
        (n % 10 !== 0 ? " " + convert(n % 10) : "")
      );
    if (n < 200)
      return "Seratus" + (n - 100 !== 0 ? " " + convert(n - 100) : "");
    if (n < 1000)
      return (
        convert(Math.floor(n / 100)) +
        " Ratus" +
        (n % 100 !== 0 ? " " + convert(n % 100) : "")
      );
    if (n < 2000)
      return "Seribu" + (n - 1000 !== 0 ? " " + convert(n - 1000) : "");
    if (n < 1000000)
      return (
        convert(Math.floor(n / 1000)) +
        " Ribu" +
        (n % 1000 !== 0 ? " " + convert(n % 1000) : "")
      );
    if (n < 1000000000)
      return (
        convert(Math.floor(n / 1000000)) +
        " Juta" +
        (n % 1000000 !== 0 ? " " + convert(n % 1000000) : "")
      );
    if (n < 1000000000000)
      return (
        convert(Math.floor(n / 1000000000)) +
        " Miliar" +
        (n % 1000000000 !== 0 ? " " + convert(n % 1000000000) : "")
      );
    return "";
  }

  const result = convert(Math.floor(number)).trim();
  return result ? result + " Rupiah" : "";
}

/**
 * Format string atau number dengan titik pemisah ribuan Rupiah
 * Contoh: 1500000 -> "1.500.000"
 */
export function formatNumberDots(val) {
  if (val === "" || val === null || val === undefined) return "";
  const cleanStr = String(val).replace(/\D/g, "");
  if (!cleanStr) return "";
  return cleanStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
