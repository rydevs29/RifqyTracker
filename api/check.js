// File: pages/api/check.js
// Ini berjalan di sisi server Vercel (Serverless Function)

export default async function handler(req, res) {
  // 1. Ambil email dari request frontend
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email wajib diisi' });
  }

  // 2. Daftar service yang mau dicek
  // (Di dunia nyata, ini butuh teknik scraping canggih atau API key khusus)
  const services = [
    { name: 'Adobe', url: 'https://adobe.com', method: 'check_adobe_api' },
    { name: 'Spotify', url: 'https://spotify.com', method: 'check_spotify_signup' },
    { name: 'Twitter', url: 'https://twitter.com', method: 'check_twitter_lookup' }
  ];

  const foundAccounts = [];

  // 3. Simulasi proses pengecekan (Logic detektifnya disini)
  // Contoh: Kita pura-pura cek ke database
  
  // LOGIKA DUMMY:
  // Anggap saja semua email "gmail" terdaftar di Spotify
  if (email.includes('@gmail.com')) {
      foundAccounts.push({
          service: 'Spotify',
          status: 'REGISTERED',
          icon: 'fa-brands fa-spotify'
      });
      foundAccounts.push({
          service: 'Adobe',
          status: 'REGISTERED',
          icon: 'fa-brands fa-adobe'
      });
  }

  // 4. Kirim hasil balik ke Frontend (index.html)
  res.status(200).json({
    target: email,
    total_found: foundAccounts.length,
    results: foundAccounts
  });
}
