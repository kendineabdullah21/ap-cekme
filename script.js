const API_KEY = 'fd41bb0df8a2406abff005370b6db75a';
// News API'den Türkiye'deki güncel manşetleri çekiyoruz
const API_URL = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${API_KEY}`;
const haberlerAlani = document.getElementById('haberler-alani');

// API'dan haberleri çeken ana fonksiyon
async function haberleriGetir() {
    try {
        // Yükleniyor mesajını temizle
        haberlerAlani.innerHTML = ''; 

        const response = await fetch(API_URL);
        
        // Hata kontrolü: Eğer yanıt başarılı değilse hata fırlat
        if (!response.ok) {
            throw new Error(`API hatası: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        // Haberlerin varlığını kontrol et
        if (data.articles && data.articles.length > 0) {
            data.articles.forEach(haber => {
                const haberKarti = haberKartiOlustur(haber);
                haberlerAlani.appendChild(haberKarti);
            });
        } else {
            haberlerAlani.innerHTML = '<p class="hata">Haber bulunamadı.</p>';
        }

    } catch (error) {
        console.error("Haberler çekilirken bir hata oluştu:", error);
        haberlerAlani.innerHTML = `<p class="hata">Veri çekme hatası: ${error.message}</p>`;
    }
}

// Tek bir haber için HTML kartı oluşturan fonksiyon
function haberKartiOlustur(haber) {
    const kartDiv = document.createElement('div');
    kartDiv.classList.add('haber-karti');

    // Başlık
    const baslik = document.createElement('h2');
    baslik.textContent = haber.title || 'Başlık Yok';

    // Resim (Varsa)
    const resim = document.createElement('img');
    resim.src = haber.urlToImage || 'https://via.placeholder.com/300x200?text=Resim+Yok'; 
    resim.alt = haber.title;

    // Açıklama
    const aciklama = document.createElement('p');
    aciklama.textContent = haber.description || 'Açıklama mevcut değil.';

    // Kaynağa Git Butonu
    const link = document.createElement('a');
    link.href = haber.url;
    link.textContent = 'Haberi Oku →';
    link.target = '_blank';
    link.classList.add('oku-butonu');

    // Oluşturulan elementleri kartın içine ekle
    kartDiv.appendChild(resim);
    kartDiv.appendChild(baslik);
    kartDiv.appendChild(aciklama);
    kartDiv.appendChild(link);

    return kartDiv;
}

// Tek bir haber için HTML kartı oluşturan fonksiyon
function haberKartiOlustur(haber) {
    const kartDiv = document.createElement('div');
    kartDiv.classList.add('haber-karti');

    // Resim (Varsa)
    const resim = document.createElement('img');
    resim.src = haber.urlToImage || 'https://via.placeholder.com/300x200?text=Resim+Yok'; 
    resim.alt = haber.title;

    // Yeni: İçerik için ayrı bir div oluşturuyoruz
    const icerikDiv = document.createElement('div');
    icerikDiv.classList.add('haber-icerik');

    // Başlık
    const baslik = document.createElement('h2');
    baslik.textContent = haber.title || 'Başlık Yok';

    // Açıklama
    const aciklama = document.createElement('p');
    aciklama.textContent = haber.description || 'Açıklama mevcut değil.';

    // Kaynağa Git Butonu
    const link = document.createElement('a');
    link.href = haber.url;
    link.textContent = 'Haberi Oku →';
    link.target = '_blank';
    link.classList.add('oku-butonu');

    // Oluşturulan elementleri içerik div'in içine ekle
    icerikDiv.appendChild(baslik);
    icerikDiv.appendChild(aciklama);
    icerikDiv.appendChild(link);

    // Ana kartın içine resmi ve içerik div'i ekle
    kartDiv.appendChild(resim);
    kartDiv.appendChild(icerikDiv);

    return kartDiv;
}
// Diğer kodlar (haberleriGetir() ve API_KEY) aynı kalmalıdır. 
// Fonksiyonu sayfa yüklendiğinde çalıştır
haberleriGetir();
