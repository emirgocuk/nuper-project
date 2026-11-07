# 📋 NUPER ORTHO — CMM OPERATÖR KURULUM FÖYÜ (SETUP SHEET)

- **Parça Adı:** `GOBEK BAGI OLUGU_AB`
- **CAD Modeli:** `D:\Projects\nuper-project\nuper_ortho\test_assets\KPT - 3051 Gobek Bagı Olugu\GOBEK BAGI OLUGU_AB.stp`
- **Malzeme ve Sıcaklık:** Aluminum 7075-T6 (20.0 °C)
- **Emniyet Protokolü:** AS9100 Rev D & ISO 1502 Yakut Bilye Koruma Baypası

## 3. 📐 Manuel Ön-Hizalama Adımları (MODE/MAN - Kaba Sıfır Alma)
CMM operatörü parçayı tablaya bağladıktan sonra joystick ile sırasıyla aşağıdaki 6 noktaya dokunur:
1. **Primer Düzlem (Datum A - 3 Dokunuş):** Parçanın üst işlenmiş yüzeyine Z ekseninde 3 köşeden temas edilir.
2. **Sekonder Doğru (Datum B - 2 Dokunuş):** Parçanın ön referans kenarına Y ekseninde 2 noktadan temas edilir.
3. **Tersiyer Nokta (Datum C - 1 Dokunuş):** Parçanın sol referans kenarına X ekseninde 1 noktadan temas edilir.
> ℹ️ *Bu 6 dokunuş tamamlandığında tezgah otomatik olarak `MODE/AUTO, PROG` CNC çevrimine geçer.*

## 4. 🔩 Prob Baypas Unsur Tablosu (Manuel Mastar Denetimi)
### 🛠️ Manuel Mastar Doğrulama Listesi (Operator Setup Sheet)

| No | Unsur Adı | Diş Tanımı | Kullanılacak Mastar | Standart / Sınıf | Derinlik | Koruma Notu |
|:--:|:---|:---|:---|:---|:--:|:---|
| 1 | `BORE_2` | **M2x0.40** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 174.6 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 2 | `BORE_4` | **M4x0.70** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 3 | `BORE_4` | **M4x0.70** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 4 | `BORE_6` | **M6x1.00** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 5 | `BORE_2` | **M2x0.40** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 6 | `BORE_6` | **M6x1.00** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 7 | `BORE_2` | **M2x0.40** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 25.8 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 8 | `BORE_2` | **M2x0.45** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 9 | `BORE_2` | **M2x0.40** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 10 | `BORE_4` | **M4x0.70** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 11 | `BORE_10` | **M10x1.50** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 56.7 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 12 | `BORE_3` | **M3x0.50** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 13 | `BORE_4` | **M4x0.70** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 14 | `BORE_4` | **M4x0.70** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 15 | `BORE_10` | **M10x1.50** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 55.7 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 16 | `BORE_2` | **M2x0.40** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 39.6 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 17 | `BORE_2` | **M2x0.40** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 100.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 18 | `BORE_10` | **M10x1.50** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 55.7 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 19 | `BORE_2` | **M2x0.40** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 20 | `BORE_2` | **M2x0.40** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 174.6 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 21 | `BORE_2` | **M2x0.45** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 22 | `BORE_3` | **M4x0.70** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 23 | `BORE_4` | **M4x0.70** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 24 | `BORE_4` | **M4x0.70** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 25 | `BORE_21` | **M24x3.00** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 26 | `BORE_2` | **M2x0.45** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 27 | `BORE_2` | **M2x0.40** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 25.8 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 28 | `BORE_2` | **M2x0.45** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 29 | `BORE_4` | **M4x0.70** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 30 | `BORE_4` | **M4x0.70** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 10.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 31 | `BORE_2` | **M2x0.40** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 39.6 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 32 | `BORE_10` | **M10x1.50** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 56.7 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |
| 33 | `BORE_2` | **M2x0.40** | Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge) | ISO 1502 / DIN 13 (6H) | 100.0 mm | CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır. |


### 🔒 Saha Operatörü Kontrol İmzası
- [ ] Parça fikstüre rijit bağlandı, titreşim ve esneme kontrol edildi.
- [ ] Tablodaki tüm dişli delikler ve toleranslı pimler manuel mastarlarla teyit edildi.
- [ ] Datum A/B/C yüzeylerinde çapak ve talaş temizliği yapıldı.
- [ ] CMM sıcaklığı 20.0 ± 1.0 °C aralığında stabilize edildi.

**Operatör Sicil / İmza:** _________________________    **Kalite Onay:** _________________________    **Tarih:** 2026-09-27
