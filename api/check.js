export default async function handler(req, res) {
    const { type, q } = req.query;

    if (!q) return res.status(400).json({ error: 'Data tidak boleh kosong.' });

    // === 1. LOGIKA CEK NIK (KTP) ===
    if (type === 'nik') {
        if (q.length !== 16) return res.status(400).json({ error: 'Format NIK Salah (Harus 16 Digit)' });
        
        const data = parseNIK(q);
        return res.status(200).json({
            success: true,
            type: 'nik',
            data: data
        });
    }

    // === 2. LOGIKA CEK NO HP ===
    if (type === 'phone') {
        const provider = detectProvider(q);
        return res.status(200).json({
            success: true,
            type: 'phone',
            data: {
                number: q,
                provider: provider,
                region: 'Indonesia (GSM)',
                whatsapp: true // Simulasi: Anggap selalu ada WA
            }
        });
    }

    // === 3. LOGIKA CEK EMAIL ===
    if (type === 'email') {
        // Di sini kamu bisa ganti dengan fetch ke API 'HaveIBeenPwned' jika punya Key
        // Ini adalah simulasi hasil agar UI terlihat bekerja
        const domain = q.split('@')[1];
        const dummyResults = [
            { name: 'Spotify', icon: 'fa-brands fa-spotify' },
            { name: 'Adobe', icon: 'fa-brands fa-adobe' },
            { name: 'Gravatar', icon: 'fa-solid fa-user-circle' },
            { name: 'Twitter (X)', icon: 'fa-brands fa-x-twitter' }
        ];

        return res.status(200).json({
            success: true,
            type: 'email',
            data: {
                email: q,
                valid_mx: true,
                platforms: dummyResults
            }
        });
    }

    return res.status(400).json({ error: 'Tipe pencarian tidak valid.' });
}

// --- HELPER FUNCTIONS (LOGIKA PINTAR) ---

function parseNIK(nik) {
    const kodeProvinsi = nik.substring(0, 2);
    const kodeKota = nik.substring(0, 4); // Digunakan untuk deteksi lebih detail jika punya databasenya
    const tgl = parseInt(nik.substring(6, 8));
    const bln = nik.substring(8, 10);
    const thn = nik.substring(10, 12);
    const urut = nik.substring(12, 16);

    // Cek Gender
    let gender = 'LAKI-LAKI';
    let tanggalLahir = tgl;
    if (tgl > 40) {
        gender = 'PEREMPUAN';
        tanggalLahir = tgl - 40;
    }

    // Format Tanggal
    const fullYear = parseInt(thn) > 50 ? `19${thn}` : `20${thn}`; // Estimasi abad
    const formattedDate = `${tanggalLahir}-${bln}-${fullYear}`;

    // Map Kode Provinsi (Hanya sebagian contoh, bisa dilengkapi)
    const provinces = {
        '11': 'Aceh', '12': 'Sumatera Utara', '13': 'Sumatera Barat', '14': 'Riau',
        '31': 'DKI Jakarta', '32': 'Jawa Barat', '33': 'Jawa Tengah', '34': 'DI Yogyakarta',
        '35': 'Jawa Timur', '36': 'Banten', '51': 'Bali', '64': 'Kalimantan Timur',
        '73': 'Sulawesi Selatan'
    };

    const provName = provinces[kodeProvinsi] || 'Provinsi Tidak Diketahui (Code: ' + kodeProvinsi + ')';

    return {
        provinsi: provName,
        kota: `Area Kode ${kodeKota}`,
        jenis_kelamin: gender,
        tanggal_lahir: formattedDate,
        nomor_urut: urut
    };
}

function detectProvider(phone) {
    // Cek 4 digit pertama
    const prefix = phone.substring(0, 4);
    if (/^081[1-3]/.test(prefix) || /^085[2-3]/.test(prefix)) return 'Telkomsel';
    if (/^081[4-6]/.test(prefix) || /^085[5-8]/.test(prefix)) return 'Indosat Ooredoo';
    if (/^081[7-9]/.test(prefix) || /^0859/.test(prefix) || /^087[7-8]/.test(prefix)) return 'XL Axiata';
    if (/^089[5-9]/.test(prefix)) return 'Tri (3)';
    if (/^088[1-9]/.test(prefix)) return 'Smartfren';
    return 'Operator Lain / Tidak Diketahui';
}
