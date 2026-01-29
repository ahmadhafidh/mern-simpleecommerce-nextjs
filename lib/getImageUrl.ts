
export const getImageUrl = (url: string) => {
  if (!url) return "/placeholder.png"; // fallback kalau kosong

  // kalau ada host localhost → ganti ke domain API kamu
  if (url.startsWith("http://127.0.0.1:5025")) {
    return url.replace(
      "http://127.0.0.1:5025",
      "https://api-mern-simpleecommerce.idkoding.com"
    );
  }

  return url;
};