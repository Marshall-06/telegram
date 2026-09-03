# Telegram Bot Komut Listesi

## Kullanici Komutlari

| Komut | Aciklama | Akis |
|-------|----------|------|
| `/start` | Hos geldin mesaji ve ana menu | Kullanici kaydi olusturulur/guncellenir |
| `/about` | Proje tanitimi ve calisma prensibi | Statik bilgi mesaji |
| `/balance` | Guncel bakiye | Toplam + cekilebilir bakiye gosterilir |
| `/deposit` | Para yatirma talebi | Tutar sorulur → referans kodu uretilir |
| `/withdraw` | Para cekme talebi | Cuzdan sorulur → tutar sorulur → kuyruga eklenir |
| `/history` | Son 10 islem | Ledger kayitlari listelenir |
| `/help` | Komut listesi | Yardim menusu |
| `/cancel` | Devam eden islemi iptal | Deposit/withdraw akisini sonlandirir |

## Admin Komutlari

| Komut | Aciklama |
|-------|----------|
| `/admin_cekimler` | Bekleyen tum cekim taleplerini listeler (cuzdan + tutar) |
| `/admin_cekim_tamam ID` | Gonderimi yaptiktan sonra bakiyeyi dusurur, kullaniciya bildirir |
| `/admin_cekim_iptal ID` | Talebi iptal eder, bakiye degismez |

Admin erisimi `ADMIN_TELEGRAM_IDS` env ile tanimlanir (virgulle ayrilmis Telegram ID'ler).

## Cekim Akisi

1. Kullanici `/withdraw` ile talep olusturur
2. Bakiye hemen dusulmez; tutar **bekleyen cekim** olarak rezerve edilir
3. Cekilebilir bakiye = toplam bakiye - bekleyen cekimler
4. Belirlenen gunlerde size otomatik liste gelir
5. Siz WebMoney'den manuel gonderim yaparsiniz
6. `/admin_cekim_tamam ID` ile bakiyeyi dusersiniz

## Klavye Kisayollari

| Buton | Esdeger Komut |
|-------|---------------|
| Bakiye | `/balance` |
| Yatirim | `/deposit` |
| Cekim | `/withdraw` |
| Gecmis | `/history` |
| Proje | `/about` |
| Yardim | `/help` |
| Iptal | `/cancel` |

## Is Kurallari (env)

| Ayar | Varsayilan | Aciklama |
|------|------------|----------|
| `MIN_DEPOSIT` | 10 | Minimum yatirim tutari |
| `MIN_WITHDRAW` | 10 | Minimum cekim tutari |
| `WITHDRAW_DAYS` | 1,15 | Cekim islem gunleri (ayin gunleri) |
| `WITHDRAW_NOTIFY_HOUR` | 9 | Cekim gunu listesinin gonderilecegi saat |
| `ADMIN_TELEGRAM_IDS` | - | Yonetici Telegram ID'leri |
| `MONTHLY_PROFIT_RATE` | 5 | Aylik sabit kar orani (%) |

## Ornek Admin Listesi

```
CEKIM LISTESI (2 talep)
Toplam: 250.00 WMZ

1. ID: abc12345
   Kullanici: @ahmet (Ahmet Yilmaz)
   Cuzdan: Z123456789012
   Tutar: 100.00 WMZ
   Talep: 28.08.2026
   Planlanan: 01.09.2026
```

Gonderim sonrasi: `/admin_cekim_tamam abc12345`

## Aylik Kar Dagitimi

- Her ayin 1'inde saat 09:00'da otomatik calisir
- Aktif kullanicilarin bakiyesine sabit oran uygulanir
