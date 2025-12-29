export default async function handler(req, res) {
    const { type, q } = req.query;

    if (!q) return res.status(400).json({ error: 'Input kosong.' });

    // === MODE 1: CEK NIK (Deep Parsing) ===
    if (type === 'nik') {
        if (!/^\d{16}$/.test(q)) return res.status(400).json({ error: 'NIK harus 16 digit angka.' });
        
        const parsed = parseDetailedNIK(q);
        return res.status(200).json({
            success: true,
            risk: 'LOW', // NIK sendiri bukan indikator bahaya
            data: parsed
        });
    }

    // === MODE 2: CEK NO HP (Caller ID Simulation) ===
    if (type === 'phone') {
        const provider = detectProvider(q);
        
        // Simulasi Logika GetContact / TrueCaller
        // (Di dunia nyata ini butuh API berbayar mahal)
        // Kita buat simulasi realistis:
        
        let tags = ['WhatsApp Terdaftar'];
        let owner = "Tidak Diketahui (Privasi)";
        let riskLevel = "LOW";

        // Logic dummy agar terlihat seperti "Mencari"
        const randomNum = Math.floor(Math.random() * 10);
        
        if (randomNum > 7) {
            tags.push("Spam", "Penawaran Judi", "Robot Call");
            owner = "Potential Spammer";
            riskLevel = "HIGH";
        } else if (randomNum > 5) {
            tags.push("Kurir Paket", "Driver Online");
            owner = "Layanan Logistik";
            riskLevel = "LOW";
        } else {
            tags.push("Kontak Bisnis", "User Valid");
            owner = "Hidden User (Protected)";
            riskLevel = "LOW";
        }

        return res.status(200).json({
            success: true,
            risk: riskLevel,
            data: {
                number: q,
                provider: provider,
                region: "Indonesia Region",
                tags: tags,
                owner_name: owner
            }
        });
    }

    // === MODE 3: CEK EMAIL (Breach Simulation) ===
    if (type === 'email') {
        // Simulasi data kebocoran
        return res.status(200).json({
            success: true,
            risk: 'MEDIUM',
            data: {
                email: q,
                breach_count: 3,
                leaks: [
                    { source: "Tokopedia Data Breach", date: "2020-05-02" },
                    { source: "Facebook User Leak", date: "2019-04-03" },
                    { source: "Canvas Design", date: "2019-05-24" }
                ]
            }
        });
    }

    return res.status(400).json({ error: 'Invalid Mode' });
}

// --- FUNGSI PINTAR PENDUKUNG ---

function parseDetailedNIK(nik) {
    const provCode = nik.substring(0, 2);
    const cityCode = nik.substring(0, 4);
    let tgl = parseInt(nik.substring(6, 8));
    const bln = parseInt(nik.substring(8, 10));
    let thn = parseInt(nik.substring(10, 12));
    
    // Cek Gender
    let gender = 'LAKI-LAKI';
    if (tgl > 40) {
        gender = 'PEREMPUAN';
        tgl -= 40;
    }

    // Tahun Lahir (Logika 1900 vs 2000)
    // Asumsi: Jika tahun < 24 (tahun ini), kemungkinan lahir 2000an. Jika > 24 kemungkinan 1900an.
    // Ini estimasi kasar, NIK parsing sempurna butuh database pembanding.
    const fullYear = thn < 25 ? 2000 + thn : 1900 + thn; 
    const birthDateStr = `${tgl}-${bln}-${fullYear}`;
    
    // Hitung Usia
    const today = new Date();
    let age = today.getFullYear() - fullYear;

    // Hitung Zodiak
    const zodiac = getZodiac(tgl, bln);

    // Map Provinsi (Sample Data)
    const provinces = {
        '11': 'Aceh', '12': 'Sumatera Utara', '13': 'Sumatera Barat', '31': 'DKI Jakarta',
        '32': 'Jawa Barat', '33': 'Jawa Tengah', '34': 'Yogyakarta', '35': 'Jawa Timur',
        '36': 'Banten', '51': 'Bali', '64': 'Kaltim', '73': 'Sulsel'
    };

    return {
        provinsi: provinces[provCode] || `Kode Prov ${provCode}`,
        kota: `Kode Wilayah ${cityCode}`,
        jenis_kelamin: gender,
        tanggal_lahir: birthDateStr,
        usia: `${age} Tahun`,
        zodiak: zodiac
    };
}

function getZodiac(day, month) {
    const zodiacs = [
        { char: '♑ Capricorn', start: '12-22' },
        { char: '♒ Aquarius', start: '01-20' },
        { char: '♓ Pisces', start: '02-19' },
        { char: '♈ Aries', start: '03-21' },
        { char: '♉ Taurus', start: '04-20' },
        { char: '♊ Gemini', start: '05-21' },
        { char: '♋ Cancer', start: '06-21' },
        { char: '♌ Leo', start: '07-23' },
        { char: '♍ Virgo', start: '08-23' },
        { char: '♎ Libra', start: '09-23' },
        { char: '♏ Scorpio', start: '10-23' },
        { char: '♐ Sagittarius', start: '11-22' }
    ];
    // Simple logic, can be improved but works for demo
    // Note: This needs proper date comparison logic strictly, simplified here for brevity
    if((month == 1 && day <= 19) || (month == 12 && day >=22)) return 'Capricorn';
    if((month == 1 && day >= 20) || (month == 2 && day <=18)) return 'Aquarius';
    if((month == 2 && day >= 19) || (month == 3 && day <=20)) return 'Pisces';
    if((month == 3 && day >= 21) || (month == 4 && day <=19)) return 'Aries';
    if((month == 4 && day >= 20) || (month == 5 && day <=20)) return 'Taurus';
    if((month == 5 && day >= 21) || (month == 6 && day <=20)) return 'Gemini';
    if((month == 6 && day >= 21) || (month == 7 && day <=22)) return 'Cancer';
    if((month == 7 && day >= 23) || (month == 8 && day <=22)) return 'Leo';
    if((month == 8 && day >= 23) || (month == 9 && day <=22)) return 'Virgo';
    if((month == 9 && day >= 23) || (month == 10 && day <=22)) return 'Libra';
    if((month == 10 && day >= 23) || (month == 11 && day <=21)) return 'Scorpio';
    return 'Sagittarius';
}

function detectProvider(phone) {
    const p = phone.substring(0, 4);
    if (/^081[1-3]|^085[2-3]/.test(p)) return 'Telkomsel (Halo/Simpati/AS)';
    if (/^081[4-6]|^085[5-8]/.test(p)) return 'Indosat Ooredoo (IM3/Mentari)';
    if (/^081[7-9]|^0859|^087[7-8]/.test(p)) return 'XL Axiata';
    if (/^089[5-9]/.test(p)) return 'Tri (3)';
    if (/^088[1-9]/.test(p)) return 'Smartfren';
    return 'Operator Lain';
}
