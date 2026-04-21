# Frontend Tasarım Kararları

## Genel Yapı

Nuxt 3 ile sayfa bazlı routing, Pinia ile state yönetimi, Tailwind CSS ile styling. Bileşenler küçük ve odaklı tutuldu — her şey bir sayfa componentine doldurmak yerine `EmptyState`, `LoadingSpinner`, `ConfirmModal`, `StageBadge`, `PageHeader` gibi küçük parçalara bölündü.

## State Yönetimi

Üç ana Pinia store var: `auth`, `agents`, `transactions`. Sayfa componentleri store'a bağlanıyor, doğrudan API çağırmıyor. Tüm HTTP çağrıları `utils/api.ts` üzerinden geçiyor — token ekleme, 401 yönetimi ve hata parse etme tek yerde.

## Layout Yapısı

- `layouts/default.vue` — giriş yapmış kullanıcılar için, siyah sidebar + beyaz içerik
- `layouts/auth.vue` — login sayfası için, siyah arka plan

Sidebar masaüstünde sabit, tablet/mobilde hamburger menüyle açılıp kapanıyor. Responsive breakpoint olarak Tailwind'in `lg` değeri (1024px) kullanıldı.

## i18n

Türkçe ve İngilizce destekleniyor. Tarayıcı dili Türkçe ise TR, diğer her şey için EN açılıyor. Seçim cookie'ye kaydedildiği için sonraki girişlerde aynı dil devam ediyor.

## Tasarım

[iceberg.com.tr](https://iceberg.com.tr) sitesinden ilham alındı. Siyah sidebar, beyaz içerik alanı ve `#E6007E` primary renk doğrudan siteden geldi. Font olarak League Spartan kullanıldı (Google Fonts).

## Bildirimler

Hata bildirimleri için `vue-sonner` kullanıldı. Tüm toast çağrıları sayfa componentlerinden yapılıyor, `app.vue`'da `<Toaster>` bir kez tanımlandı.
