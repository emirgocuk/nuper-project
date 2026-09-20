# Product Context: Nuper Citadel

## 1. Neden Bu Proje Var? (Pazar & Mühendislik İhtiyacı)
Savunma sanayiinde (ASELSAN, ROKETSAN, BAYKAR, TUSAŞ, STM ve tedarikçi ekosistemi) geliştirilen donanımların sahaya çıkabilmesi için en zorlu aşama **Çevresel Kalifikasyon Testleri**dir.
Bir parçanın CAD modelinin çizilmesi bazen birkaç gün sürerken, o parçanın MIL-STD-810H standartlarına göre test senaryolarının çıkarılması, FEA modellerinin doğru sınır şartlarıyla koşturulması ve ETP (Environmental Test Plan) dokümanlarının yazılması **haftalar hatta aylar** almaktadır.

### Mühendisin Karşılaştığı Tipik Engel Zinciri:
1. **Standart Enformasyon Aşırı Yükü:** MIL-STD-810H 1.088 sayfadır. Sadece Titreşim (Metot 514.8) altında onlarca kategori, ek eğriler, katsayı hesapları ve dipnotlar bulunur. Genç veya orta kıdemli mühendislerin bu standartta doğru alt başlığı bulup doğru formülü çıkarması ciddi bir hata kaynağıdır.
2. **FEA Kurulumunda Kör Uçuş:** ANSYS Random Vibration veya Simcenter NX Response Simulation ortamlarında bir PSD (Power Spectral Density) analizi kurarken:
   - Hangi frekansta kaç $g^2/\text{Hz}$ girilecek?
   - Log-log interpolasyon nasıl yapılacak?
   - Hangi sönümleme oranı ($\zeta = 0.02$ mi, $0.05$ mi?) varsayılacak?
   - Efektif kütle katılımı (%85 kuralı) için kaç mod çözülmeli?
   Bu sorular cevapsız kaldığında yapılan simülasyon gerçekliği yansıtmaz.
3. **Akredite Laboratuvarda Patlama Riski:** Test günlüğü 5.000$ - 15.000$ olan sarsıcı (shaker) ve iklimlendirme odası testlerinde, parça rezonansa girip kırıldığında ya da aşırı ısındığında:
   - Test durur,
   - Şirket aylar sonrasına yeni test randevusu almak zorunda kalır,
   - Proje teslim tarihi ve ceza koşulları devreye girer.
4. **Gizlilik / Air-gap Duvarı:** Donanım modelleri ve askeri teknik şartnameler asla buluta (OpenAI, Anthropic, Google Cloud) taşınamaz. Mühendisin elinde yerel çalışan bir yapay zekâ asistanı bulunmamaktadır.

---

## 2. Nuper Citadel Nasıl Çalışır? (Kullanıcı Deneyimi & İş Akışı)

### Hedef Kullanıcı Profili (Personas)
- **Mekanik Tasarım Mühendisi:** Parçanın CAD modelini çizen, kütle ve CoG limitlerini bilmek isteyen mühendis.
- **Yapısal Analiz (FEA) Mühendisi:** Parçanın titreşim, şok ve termal stres analizlerini ANSYS / Simcenter NX / Nastran üzerinde koşan uzman.
- **Test ve Kalifikasyon Mühendisi:** ETP ve test kabul raporlarını hazırlayan, test merkezinde testi bizzat takip eden mühendis.
- **Proje Teknik Yöneticisi:** Riskleri önceden görüp test randevusu öncesi "Geçer / Kalır" öngörüsü isteyen karar verici.

### Kullanıcı Deneyimi Adımları (Happy Path)
1. **Giriş:** Mühendis masaüstü uygulamasını açar (Tauri shell - tamamen çevrimdışı).
2. **Sürükle-Bırak:** 3D STEP dosyasını arayüze bırakır (`payload_bracket.step`).
3. **Malzeme & Görev Profili Seçimi:**
   - Malzeme: `Alüminyum 6061-T6` (Akma: 275 MPa, Yoğunluk: $2700\text{ kg/m}^3$)
   - Platform: `Taktik İHA Kanat Altı Podu`
   - Test Türü: `MIL-STD-810H Metot 514.8 Kategori 14 Titreşim + Metot 501.7 Sıcaklık`
4. **Milisaniyelik Analiz:**
   - Ekranda 3D model döner, kütle (0.385 kg), CoG noktası, montaj deliklerinin yayılımı gösterilir.
   - Deterministik kurallar çalışır: Frekans aralığı 20-2000 Hz, $7.7\text{ }g_{\text{rms}}$, eksen başına 1 saat süresi hesaplanır.
5. **FEA Paketini İndir:**
   - Tek tıkla `mil810h_vibration_profile.csv` (Simcenter NX / ANSYS formatında) ve sınır şartı rehberi indirilir.
6. **İki Yönlü Geri Besleme (Opsiyonel ama Güçlü):**
   - Mühendis FEA sonucunu (Örn: 1. Doğal Frekans: 340 Hz, 3-Sigma Stres: 142 MPa) sisteme girer.
   - Sistem rezonans riskini kontrol eder ($340\text{ Hz} \gg 150\text{ Hz}$ pik bölgesi, Güvenlik Faktörü = $275 / 142 = 1.93 \rightarrow \text{UYGUN}$).
7. **Resmi ETP Üretimi:**
   - Yerel LLM, askeri formatta test planını (PDF/A4) üretir.
   - Mühendis gerekirse arayüzde bir cümleyi düzenler; bu düzenleme yerel veritabanında modelin adaptasyonu için saklanır.

---

## 3. Başarı Ölçütleri ve Hedefler
- **Hız:** Bir STEP modelinin analiz edilip PSD tablosunun üretilmesi < 5 saniye.
- **Güvenilirlik:** Deterministik formüllerde %100 doğruluk (sıfır yapay zekâ halüsinasyonu).
- **Gizlilik:** Ağ trafiği testi yapıldığında sıfır bayt dışarıya veri çıkışı (air-gapped doğrulaması).
- **Zaman Tasarrufu:** Test hazırlık süresinin 2 haftadan 30 dakikaya indirilmesi.
