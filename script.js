const API_KEY = 'fd41bb0df8a2406abff005370b6db75a';
const API_URL = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${API_KEY}`;
const haberlerAlani = document.getElementById('haberler-alani');

// --- 1. STATE (DURUM) NESNESİ ---
// Uygulamanın hafızası burasıdır.
const state = {
    articles: [],
    favorites: JSON.parse(localStorage.getItem('haber_favorileri')) || [], // Varsa tarayıcıdan al
    loading: false,
    error: null
};

// --- 2. VERİ ÇEKME FONKSİYONU ---
async function haberleriGetir() {
    state.loading = true;
    state.error = null;
    render(); // Yükleniyor durumunu göstermek için ilk çizim

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`API hatası: ${response.status}`);

        const data = await response.json();
        state.articles = data.articles || [];
        
    } catch (error) {
        console.error("Hata:", error);
        state.error = error.message;
    } finally {
        state.loading = false;
        render(); // Veri geldiğinde veya hata olduğunda son çizim
    }
}

// --- 3. FAVORİ EKLEME/ÇIKARMA (STATE GÜNCELLEME) ---
function favoriToggle(url) {
    const index = state.favorites.findIndex(f => f.url === url);

    if (index === -1) {
        // Favorilerde yoksa ekle
        const haber = state.articles.find(a => a.url === url);
        state.favorites.push(haber);
    } else {
        // Favorilerde varsa çıkar
        state.favorites.splice(index, 1);
    }

    // LocalStorage'a kaydet (Sayfa yenilense de gitmesin)
    localStorage.setItem('haber_favorileri', JSON.stringify(state.favorites));
    
    // Durum değişti, ekranı tekrar çiz!
    render();
}

// --- 4. RENDER (EKRANA ÇİZME) FONKSİYONU ---
function render() {
    haberlerAlani.innerHTML = '';

    // Yüklenme durumu
    if (state.loading) {
        haberlerAlani.innerHTML = '<p class="mesaj">Haberler yükleniyor...</p>';
        return;
    }

    // Hata durumu
    if (state.error) {
        haberlerAlani.innerHTML = `<p class="hata">Hata oluştu: ${state.error}</p>`;
        return;
    }

    // Haber yoksa
    if (state.articles.length === 0) {
        haberlerAlani.innerHTML = '<p class="mesaj">Haber bulunamadı.</p>';
        return;
    }

    // Haberleri listele
    state.articles.forEach(haber => {
        const isFav = state.favorites.some(f => f.url === haber.url);
        const haberKarti = haberKartiOlustur(haber, isFav);
        haberlerAlani.appendChild(haberKarti);
    });
}

// --- 5. HABER KARTI OLUŞTURUCU (HTML GENERATOR) ---
function haberKartiOlustur(haber, isFav) {
    const kartDiv = document.createElement('div');
    kartDiv.classList.add('haber-karti');

    // Favori butonunun rengini duruma göre belirle
    const favButonStili = isFav ? 'background-color: #ff4757;' : 'background-color: #747d8c;';
    const favButonMetni = isFav ? '❤️ Favorilerden Çıkar' : '🤍 Favorilere Ekle';

    kartDiv.innerHTML = `
        <img src="${haber.urlToImage || 'https://via.placeholder.com/300x200?text=Resim+Yok'}" alt="${haber.title}">
        <div class="haber-icerik">
            <h2>${haber.title || 'Başlık Yok'}</h2>
            <p>${haber.description || 'Açıklama mevcut değil.'}</p>
            <div class="butonlar">
                <a href="${haber.url}" target="_blank" class="oku-butonu">Haberi Oku →</a>
                <button onclick="favoriToggle('${haber.url}')" class="favori-butonu" style="${favButonStili}">
                    ${favButonMetni}
                </button>
            </div>
        </div>
    `;

    return kartDiv;
}

// Uygulamayı başlat
haberleriGetir();
