const API_KEY = 'fd41bb0df8a2406abff005370b6db75a';
const API_URL = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${API_KEY}`;
const haberlerAlani = document.getElementById('haberler-alani');

const state = {
    articles: [],
    favorites: JSON.parse(localStorage.getItem('haber_favorileri')) || [],
    loading: false,
    error: null
};

async function haberleriGetir() {
    state.loading = true;
    state.error = null;
    render();

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`API hatası: ${response.status}`);
        const data = await response.json();
        state.articles = data.articles || [];
    } catch (error) {
        state.error = error.message;
    } finally {
        state.loading = false;
        render();
    }
}

// --- JAVA BACKEND BAĞLANTILI FAVORİ FONKSİYONU ---
async function favoriToggle(url) {
    const index = state.favorites.findIndex(f => f.url === url);
    const haber = state.articles.find(a => a.url === url);

    if (index === -1) {
        // 1. Durum: Favorilere Ekle
        state.favorites.push(haber);
        
        // Java API'ye Kaydet (Stateful yapmak için)
        try {
            await fetch('http://localhost:8080/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: haber.title,
                    url: haber.url,
                    urlToImage: haber.urlToImage,
                    description: haber.description
                })
            });
        } catch (err) { console.error("DB Kayıt Hatası:", err); }

    } else {
        // 2. Durum: Favorilerden Çıkar
        state.favorites.splice(index, 1);
        // İstersen buraya DELETE isteği de ekleyebilirsin
    }

    localStorage.setItem('haber_favorileri', JSON.stringify(state.favorites));
    render();
}

function render() {
    haberlerAlani.innerHTML = '';
    if (state.loading) { haberlerAlani.innerHTML = '<p class="mesaj">Yükleniyor...</p>'; return; }
    if (state.error) { haberlerAlani.innerHTML = `<p class="hata">Hata: ${state.error}</p>`; return; }

    state.articles.forEach(haber => {
        const isFav = state.favorites.some(f => f.url === haber.url);
        const haberKarti = haberKartiOlustur(haber, isFav);
        haberlerAlani.appendChild(haberKarti);
    });
}

function haberKartiOlustur(haber, isFav) {
    const kartDiv = document.createElement('div');
    kartDiv.classList.add('haber-karti');

    kartDiv.innerHTML = `
        <img src="${haber.urlToImage || 'https://via.placeholder.com/300x200'}" alt="${haber.title}">
        <div class="haber-icerik">
            <h2>${haber.title || 'Başlık Yok'}</h2>
            <p>${haber.description ? haber.description.substring(0, 100) + '...' : 'Açıklama yok.'}</p>
            <div class="butonlar" style="display: flex; gap: 10px; margin-top: 10px;">
                <a href="${haber.url}" target="_blank" class="haberi-oku" style="background-color: #28a745; color: white; padding: 8px 15px; border-radius: 5px; text-decoration: none; flex-grow: 1; text-align: center;">Haberi Oku →</a>
                <button onclick="favoriToggle('${haber.url}')" style="background: none; border: 1px solid #ddd; cursor: pointer; padding: 5px 10px; border-radius: 5px; font-size: 1.2rem;">
                    ${isFav ? '❤️' : '🤍'}
                </button>
            </div>
        </div>
    `;
    return kartDiv;
}

haberleriGetir();
