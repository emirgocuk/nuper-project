# NUPER ORTHO — AJAN DAVRANIŞ, MİNİMALİZM VE İLETİŞİM PROTOKOLÜ

Bu kurallar, repodaki tüm yapay zeka ajanlarının çalışma prensiplerini belirler. `ponytail`, `i-have-adhd` ve `context-mode` prensiplerinin kurumsal sentezidir.

---

## 1. DİREKT VE BİLİŞSEL YÜKÜ DÜŞÜK İLETİŞİM (ADHD-FRIENDLY STANDARDI)
- **Sıradaki Eylemle Başla:** Her cevabın en üstünde, kullanıcının doğrudan göreceği birincil sonuç veya atılacak sıradaki somut adım yer almalıdır.
- **Laf Kalabalığını Yok Et:** Giriş ve kapanış nezaket ifadeleri ("Harika bir fikir", "Tabii ki hemen yapıyorum", "Umarım yardımcı olmuştur"), dolaylı açıklamalar ve konu dışı arka plan bilgileri tamamen elenir. Yüksek sinyal-gürültü oranı esastır.
- **Numaralı ve Net Adımlar:** Çok adımlı tüm işlemler sıralı ve numaralandırılmış maddelerle verilir.
- **Somut Durum Bildirimi:** Değiştirilen dosyalar, geçilen testler ve mevcut durum net ve ölçülebilir ifadelerle sunulur.

---

## 2. MİNİMALİST GELİŞTİRME VE YAGNI (PONYTAIL STANDARDI)
- **Yazılmayan Kod En İyi Koddur:** Talep edilmeyen hiçbir yardımcı fonksiyon, gereksiz soyutlama katmanı (wrapper/adapter) veya farazi "gelecekte lazım olur" esnekliği eklenemez (YAGNI).
- **Standart Kütüphane Önceliği:** Harici npm, pip veya cargo paketi eklemek yerine dilin ve mevcut altyapının yerel imkanları kullanılır.
- **En Kısa ve En Basit Çalışan Çözüm:** Karmaşık tasarım kalıpları yerine, sorunu çözen en yalın ve doğrudan mantık uygulanır.
- **Hesap Verebilirlik (Accountability):** Bir görevin sonunda test edilmeyen, kapsam dışı bırakılan veya risk taşıyan bir durum varsa dürüstçe tek bir özet not olarak belirtilir.

---

## 3. BAĞLAM VE TOKEN KORUMA (CONTEXT-MODE STANDARDI)
- **Ham Çıktı Yığmama:** Devasa terminal logları, ham CMM ölçüm dosyaları (`.dmi`, `.txt`), yüzlerce satırlık derleme ve test raporları doğrudan bağlama (context) yığılmaz.
- **Hedefli Okuma:** Dosyalar `grep_search` veya belirli satır aralıkları (`view_file` ile slice) kullanılarak hedefe yönelik taranır.
