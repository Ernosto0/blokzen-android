# Google Play yayın öncesi: kod tarafı yapılacaklar

Play Console'a ilk yüklemeden önce kod tarafında yapılması gerekenler. Öncelik sırasına göre:

- 🔴 **Engel**: yapılmazsa Play yüklemeyi kabul etmez.
- 🟠 **Kesin düzeltilmeli**: yükleme geçer ama kullanıcı deneyimi ya da kalıcı bir karar etkilenir.
- 🟡 **Cihazda doğrulanmalı**: kod değişikliği gerekebilir, önce gerçek cihazda denenmeli.
- 🟢 **Yayından sonra da olur**.

✅ yapıldı, ◐ kısmen, ⏸ bilerek ertelendi. Play Console tarafındaki işler (kapalı test, formlar, mağaza görselleri) en altta ayrıca listelendi.

---

## ✅ 1. Hedef API seviyesini 36'ya çıkar (yapıldı, CI'da doğrulanacak)

**Neden:** 31 Ağustos 2026'dan beri yeni uygulamalar ve güncellemeler API 36'yı (Android 16) hedeflemek zorunda. Proje 35'teydi.

**Yapılanlar:**
- [x] Capacitor 7 → 8.5.3 (`core`, `android`, `cli`, `haptics` 8.0.2). `package.json` ve `package-lock.json` güncellendi.
- [x] `npx cap migrate` yarım kaldı (Gradle wrapper ve `variables.gradle` adımları hata verdi). Kalanı CLI'ın kendi Android şablonundan (`node_modules/@capacitor/cli/assets/android-template.tar.gz`) alındı:
  - [variables.gradle](android/variables.gradle): `minSdk 24`, `compileSdk 36`, `targetSdk 36`, androidx sürümleri Capacitor 8'e göre.
  - [android/build.gradle](android/build.gradle): AGP 8.13.0, google-services 4.4.4.
  - Gradle wrapper 8.11.1 → 8.14.3 (`gradle-wrapper.properties`, `gradle-wrapper.jar`, `gradlew`, `gradlew.bat`).
  - [AndroidManifest.xml](android/app/src/main/AndroidManifest.xml): `configChanges` listesine `density` eklendi (migrate yaptı).
- [x] `minSdkVersion` 23 → 24 oldu (Capacitor 8 şartı). Android 6 cihazlar artık desteklenmiyor; 9. maddeye bak.
- [x] CI'daki Java 21 ([android.yml](.github/workflows/android.yml)) Capacitor 8'in şartıyla aynı, değişiklik gerekmedi.
- [x] Web build ve 262 Playwright testi geçti.

**Doğrulanmadı:** Bu makinede Java ve Android SDK yok, bu yüzden Gradle derlemesi yerelde çalıştırılmadı. İlk gerçek doğrulama push sonrası CI'da `assembleDebug` olacak. Başarısız olursa hata büyük ihtimalle Gradle/AGP uyumundadır.

**Edge-to-edge (API 36'da zorunlu, kapatılamıyor):**
- Capacitor 8'in `SystemBars` eklentisi bunu yönetiyor (`insetsHandling`, varsayılan `css`). Oyun zaten `viewport-fit=cover` ve `env(safe-area-inset-*)` kullandığı için ([main.css:32-36](src/styles/main.css#L32-L36), [main.css:207](src/styles/main.css#L207), [main.css:434](src/styles/main.css#L434)) yerleşim için kod değişikliği gerekmedi.
- [x] **Durum çubuğu simgeleri:** Varsayılan stil temayı değil telefonun gece modunu izliyor. Oysa açık renkli temalar var (`light: true`, örn. Pamuk Bulutlar), yani sabit bir değer de yanlış olurdu. Yeni [systembars.js](src/platform/systembars.js) tema değişince stili ayarlıyor, [switching.js](src/themes/switching.js) içinden çağrılıyor. Koyu tema → açık simgeler, açık tema → koyu simgeler. Web'de etkisiz.
- [ ] **Cihazda doğrula:** Android 15/16 cihaz veya emülatörde (a) üst skor çubuğu ve alt tepsi sistem çubuklarının altında kalmıyor, (b) en az bir açık tema (Pamuk Bulutlar) ve bir koyu temada durum çubuğu simgeleri okunuyor.

**Geniş ekranlarda yön kilidi yok sayılıyor** (600dp ve üzeri). [MainActivity.java](android/app/src/main/java/com/cinaraksoy/blokzen/MainActivity.java) zaten tabletlerde kilitlemiyor, telefonlarda portre kilidi çalışmaya devam eder. Değişiklik gerekmez ama tablette yatay düzen test edilmeli (13. madde).

---

## ✅ 2. İmzalı release AAB üret (kod hazır, anahtar senden bekleniyor)

> **Durum:** [build.gradle](android/app/build.gradle) imza ayarı, `versionName` (package.json'dan) ve `versionCode` (CI çalıştırma numarasından) eklendi; `.gitignore` anahtar dosyalarını kapsıyor. Yeni [release.yml](.github/workflows/release.yml) etiket (`v1.0.0`) ya da elle tetiklemeyle imzalı `.aab` üretir; anahtar yoksa net bir hatayla durur. Android derlemesi bu makinede çalıştırılamadı, ilk deneme CI'da olacak.
>
> **Senin yapacakların:**
> 1. `keytool -genkey -v -keystore blokzen-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload` ile upload anahtarını oluştur ve iki ayrı güvenli yerde yedekle.
> 2. GitHub → Settings → Secrets → Actions altına dört secret ekle: `BLOKZEN_KEYSTORE_B64` (`base64 -w0 blokzen-upload.jks`), `BLOKZEN_KEYSTORE_PASSWORD`, `BLOKZEN_KEY_ALIAS`, `BLOKZEN_KEY_PASSWORD`.
> 3. `package.json` içindeki `version`'ı yükselt, `git tag v<sürüm> && git push --tags`.
>
> Not: `versionCode`, release iş akışının kendi çalıştırma sayısıdır (1'den başlar). Play'e yüklenen her sürümde artar, ama Actions'ta iş akışını silip yeniden oluşturursan sayaç sıfırlanır.

**Neden:** Play sadece release anahtarıyla imzalanmış AAB kabul ediyor. Şu an CI `assembleDebug` ile debug imzalı bir APK üretiyor. [build.gradle](android/app/build.gradle) içinde `signingConfig` yok.

**Yapılacaklar:**
- [ ] Upload keystore oluştur. Repoya **koyma**; `.gitignore` zaten `*.jks` kapsamıyor, onu da ekle.
  ```sh
  keytool -genkey -v -keystore blokzen-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
  ```
  Keystore'u ve şifreleri en az iki ayrı güvenli yerde yedekle. Play App Signing açıkken upload anahtarı kaybolursa sıfırlanabilir, ama süreç uzun sürüyor.
- [ ] [android/app/build.gradle](android/app/build.gradle) içine imza ayarını ekle. Değerler ortam değişkenlerinden veya `android/keystore.properties` dosyasından okunsun (bu dosya `.gitignore`'a eklenmeli):
  ```groovy
  def ksFile = rootProject.file('keystore.properties')
  def ks = new Properties()
  if (ksFile.exists()) ks.load(new FileInputStream(ksFile))

  android {
      signingConfigs {
          release {
              storeFile file(ks['storeFile'] ?: System.getenv('BLOKZEN_KEYSTORE') ?: 'missing.jks')
              storePassword ks['storePassword'] ?: System.getenv('BLOKZEN_KEYSTORE_PASSWORD')
              keyAlias ks['keyAlias'] ?: System.getenv('BLOKZEN_KEY_ALIAS')
              keyPassword ks['keyPassword'] ?: System.getenv('BLOKZEN_KEY_PASSWORD')
          }
      }
      buildTypes {
          release {
              signingConfig signingConfigs.release
              minifyEnabled false
              proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
          }
      }
  }
  ```
- [ ] **versionCode otomatik artsın.** Şu an [build.gradle](android/app/build.gradle) içinde `versionCode 1` sabit. Play aynı versionCode'u ikinci kez kabul etmiyor. CI'da run numarasından üretmek en kolayı:
  ```groovy
  versionCode (System.getenv('GITHUB_RUN_NUMBER') ?: '1').toInteger()
  versionName "1.0.0"
  ```
  `versionName`'i [package.json](package.json) içindeki `version` ile aynı tut. Bir kaynaktan okumak daha iyi olur (7. madde ekranda da gösteriyor).
- [ ] CI'a bir release işi ekle ([android.yml](.github/workflows/android.yml)):
  - Keystore'u base64 olarak bir GitHub Secret'a koy (`BLOKZEN_KEYSTORE_B64`) ve şifreler için ayrı secret'lar tanımla.
  - Adım: secret'tan keystore'u çöz, sonra `./gradlew bundleRelease --no-daemon` çalıştır.
  - Çıktı: `android/app/build/outputs/bundle/release/app-release.aab`. Bunu artifact olarak yükle.
  - Bu işi her push'ta değil, tag'de (`v*`) ya da `workflow_dispatch` ile çalıştır.
  - İsteğe bağlı: `r0adkll/upload-google-play` action'ı ile doğrudan dahili test kanalına yükle.
- [ ] Mevcut debug APK işi kalabilir. Ama repo herkese açıksa, her push'ta "latest" sürüm olarak public APK yayınlanması Play sürümüyle karışabilir; bunu gözden geçir.
- [ ] `.gitignore` dosyasına `*.jks`, `*.keystore` ve `android/keystore.properties` ekle.

---

## ✅ 3. İkon ve açılış ekranını değiştir (yapıldı, görsel onayın bekleniyor)

> **Durum:** Oyunun kendi menü logosundan (5×3 blok) üretildi. Kaynaklar ve üretici betik [assets/](assets/) altında (`node assets/make-assets.mjs`, sonra `npx capacitor-assets generate --android ...`). Üretilenler: uyumlu (adaptive) ve eski ikonlar, koyu (`#1a1330`) açılış ekranı, Android 12+ sistem açılış ekranı ayarı ve `windowBackground` (beyaz parlama yok). Mağaza için [play-store-icon-512.png](assets/play-store-icon-512.png) ve [play-feature-graphic-1024x500.png](assets/play-feature-graphic-1024x500.png) hazır.
>
> **Senin kararın:** Bu bir başlangıç tasarımı. Kendi logon varsa `assets/icon-*.png` dosyalarını değiştirip aynı komutu çalıştırman yeter. Cihazda ikonun ve açılış ekranının görünüşüne bak (özellikle yuvarlak ikon maskesinde).

**Neden:** [mipmap-*/ic_launcher*.png](android/app/src/main/res/), [drawable-v24/ic_launcher_foreground.xml](android/app/src/main/res/drawable-v24/ic_launcher_foreground.xml) ve [drawable*/splash.png](android/app/src/main/res/drawable/splash.png) hâlâ Capacitor'un varsayılan mavi "X" logosu. Splash ayrıca **beyaz**, oyunun arka planı ise `#1a1330` ([capacitor.config.json](capacitor.config.json)). Bu yüzden açılışta beyaz bir parlama oluyor.

**Yapılacaklar:**
- [ ] 1024×1024 kaynak ikon hazırla. Adaptive icon için ön plan ve arka plan ayrı katmanlar olmalı; ön plan, ortadaki 66dp'lik güvenli alanın içinde kalmalı.
- [ ] Splash için ortada logo olan koyu (`#1a1330`) bir görsel hazırla.
- [ ] `@capacitor/assets` ile tüm boyutları üret:
  ```sh
  npm i -D @capacitor/assets
  # assets/icon-only.png, assets/icon-foreground.png, assets/icon-background.png, assets/splash.png, assets/splash-dark.png
  npx capacitor-assets generate --android --iconBackgroundColor '#1a1330' --splashBackgroundColor '#1a1330'
  ```
- [ ] [values/ic_launcher_background.xml](android/app/src/main/res/values/ic_launcher_background.xml) içindeki rengi kontrol et.
- [ ] Android 12+ sistem splash'i (`Theme.SplashScreen`) sadece ikonu ve arka plan rengini kullanıyor. [styles.xml](android/app/src/main/res/values/styles.xml) içindeki `AppTheme.NoActionBarLaunch` stiline `windowSplashScreenBackground` ve `windowSplashScreenAnimatedIcon` ekle, yoksa yeni cihazlarda yine beyaz görünür:
  ```xml
  <style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">
      <item name="windowSplashScreenBackground">#1a1330</item>
      <item name="windowSplashScreenAnimatedIcon">@mipmap/ic_launcher_foreground</item>
      <item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>
      <item name="android:background">@drawable/splash</item>
  </style>
  ```
- [ ] [styles.xml](android/app/src/main/res/values/styles.xml) içindeki `AppTheme.NoActionBar` stiline `android:windowBackground` olarak `#1a1330` ver. Böylece WebView yüklenene kadar beyaz ekran görünmez.
- [ ] Mağaza için de üret: 512×512 PNG ikon (32-bit, alfa kanallı) ve 1024×500 öne çıkan görsel.

---

## ✅ 4. Android geri tuşunu destekle (yapıldı)

> **Durum:** `@capacitor/app` eklendi. Eskiden sadece klavye Escape tuşu için olan mantık ortak [back.js](src/ui/back.js) içindeki `goBack()` fonksiyonuna taşındı; Escape ve Android geri tuşu aynı yolu izler: eğitim → açık pencere → (bekleyen yeniden başlat onayı) → oyundan menüye. Ana menüdeyken geri tuşu uygulamayı arka plana atar ([backbutton.js](src/platform/backbutton.js)). Escape ve geri adımı için Playwright testi eklendi. Android 13+ öngörülü geri hareketi için manifest bayrağı eklenmedi; Capacitor'un geri tuşu işleyicisi onunla çalışıyor ama **cihazda geri hareketini dene**.

**Neden:** `@capacitor/app` kurulu değil. Bu yüzden geri tuşu (ya da geri hareketi) her durumda uygulamayı arka plana atıyor; açık pencere kapanmıyor, menüye dönülmüyor. Android kullanıcısının ilk fark edeceği hata bu.

**Beklenen davranış, sırasıyla:**
1. Parça sürükleniyorsa hiçbir şey yapma (`state.drag`).
2. Açık bir pencere varsa onu kapat:
   - `#info` için `closeInfo()` ([info.js:91](src/ui/info.js#L91))
   - `#settings` için `closeSettings()` ([settings.js:38](src/ui/settings.js#L38))
   - `#levels` için `closeLevels()` ([levels.js:58](src/ui/levels.js#L58))
   - `#gallery` için `closeGallery()` ([gallery.js:107](src/ui/gallery.js#L107)). Bu fonksiyon şu an export edilmiyor, export et.
3. Eğitim açıksa: `endTutorial()` ([tutorial.js:91](src/ui/tutorial.js#L91)) çağrılsın mı yoksa yok mu sayılsın, karar ver.
4. Oyun ekranındaysa (oyun bitti kartı dahil) menüyü aç: `openMenu()` ([menu.js:49](src/ui/menu.js#L49)).
5. Menüdeyse uygulamayı küçült: `App.minimizeApp()`. `exitApp()` yerine bu daha iyi, çünkü Android'in beklediği davranış bu ve oyun bellekte kalıyor.

**Yapılacaklar:**
- [ ] `npm i @capacitor/app` ve ardından `npx cap sync android`.
- [ ] Yeni bir dosya ekle: `src/platform/backbutton.js`. Bunu [main.js](src/main.js) içinde ekran modüllerinden sonra import et.
  ```js
  import { App } from '@capacitor/app';
  import { $ } from '../ui/dom.js';
  import { state } from '../core/state.js';
  import { menuOpen, openMenu } from '../ui/menu.js';
  import { closeInfo } from '../ui/info.js';
  import { closeSettings } from '../ui/settings.js';
  import { closeLevels } from '../ui/levels.js';
  import { closeGallery } from '../ui/gallery.js';

  /* ---------- Android back button: close the top dialog, then go to the menu, then leave ---------- */
  const DIALOGS = [['gallery', closeGallery], ['settings', closeSettings], ['levels', closeLevels], ['info', closeInfo]];
  App.addListener('backButton', () => {
    if (state.drag) return;
    for (const [id, close] of DIALOGS) if (!$(id).hidden) { close(); return; }
    if (!menuOpen) { openMenu(); return; }
    App.minimizeApp();
  });
  ```
  Web'de `backButton` olayı hiç tetiklenmez, bu yüzden tarayıcıda ve testlerde zararsız.
- [ ] Menüde bir onay penceresi açıkken (`resetConfirm`, [menu.js](src/ui/menu.js)) geri tuşu önce onu kapatsın.
- [ ] Android 13+ öngörülü geri hareketi (predictive back) için manifest'teki `<application>` etiketine `android:enableOnBackInvokedCallback="true"` eklemeyi değerlendir. Capacitor 8 sürüm notlarında bu konuda ne önerildiğine bak.

---

## ✅ 5. Geliştirici modunu yayın sürümünden çıkar (yapıldı)

> **Durum:** `VITE_DEV_TOOLS` bayrağı eklendi ([state.js](src/core/state.js)); `.env.development` ve `.env.test` açık, Play build'inde yok. Üretim paketinde menü başlığı dinleyicisi gerçekten yok (doğrulandı), eski kayıtlardaki `blokzen.dev` de etkisiz. Testler ayrı `dist-test` klasörüne derleniyor, böylece `dist/` (Play build'i) dev araçsız kalıyor. Test amaçlı debug APK'sı ([android.yml](.github/workflows/android.yml)) bilerek bayrağı açık derlenir, telefonda tema denemek için.

**Neden:** Menü başlığına 7 kez dokununca tüm temalar açılıyor ([devmode.js](src/ui/devmode.js)). Üstelik 3. dokunuştan itibaren "Geliştirici modu için N dokunuş" yazısı görünüyor, yani kullanıcı bunu kendiliğinden bulur. İlerleme sayılmaya devam etse de temaların kilidini açma motivasyonu ortadan kalkar. İleride temalar satılırsa bu doğrudan gelir kaybı demek.

**Dikkat:** Playwright testleri üretim build'i (`vite preview`) üzerinde çalışıyor ve `blokzen.dev: true` ile başlıyor ([tests/helpers.js:27](tests/helpers.js#L27)). "Her temayı oyna" testleri buna bağlı. Bu yüzden sadece `import.meta.env.DEV` ile kapatmak testleri bozar. Ayrı bir build bayrağı gerekiyor.

**Yapılacaklar:**
- [ ] Bir bayrak tanımla. Örneğin `VITE_DEV_TOOLS`: `.env.development` dosyasında `1` olsun, test build'inde de `1` verilsin, Play build'inde verilmesin.
  ```js
  // core/state.js
  export const DEV_TOOLS = import.meta.env.VITE_DEV_TOOLS === '1';
  ```
- [ ] [devmode.js](src/ui/devmode.js) içindeki `menuTitle` tıklama dinleyicisini `if (DEV_TOOLS)` içine al.
- [ ] [boot.js:42](src/boot.js#L42) satırını `state.devMode = DEV_TOOLS && !!store.get(DEV_KEY);` yap. Böylece eski bir kayıtta `blokzen.dev: true` kalmışsa yayın sürümünde etkisiz olur.
- [ ] [playwright.config.js](playwright.config.js) içindeki `cmd` değerini `VITE_DEV_TOOLS=1 npm run build && ...` yap. Windows'ta da çalışması için `cross-env` kullan ya da Vite'ın `--mode test` seçeneğiyle `.env.test` dosyası kullan.
- [ ] CI'daki Play build'inin bayraksız yapıldığından emin ol (`npm run build`, sonra `cap sync`). Testler ayrı build kullandığı için test adımı ile AAB adımı **aynı `dist/`'i paylaşmamalı**. Testlerden sonra `npm run build` yeniden çalıştırılmalı.
- [ ] Yayın build'inde `optDev` ayarı ([index.html](src/index.html) içindeki `#devGroup`) zaten `hidden` kalıyor. Ayrıca bir şey gerekmez.

---

## ✅ 6. Arka plana geçince sesi durdur (yapıldı)

> **Durum:** Uygulama gizlenince `Sfx.suspend()`, geri gelince `Sfx.unlock()` ([boot.js](src/boot.js), [sfx.js](src/audio/sfx.js)). Sürükleme ortasında arka plana geçmeyi cihazda dene.

**Neden:** `AudioContext` uygulama arka plana geçtiğinde askıya alınmıyor. Döngüdeki sesler (gök gürültüsü, dalga; [sfx.js:153-156](src/audio/sfx.js#L153-L156)) süreleri dolana kadar arka planda çalmaya devam edebilir. Ayrıca açık kalan ses bağlamı pil tüketiyor.

**Yapılacaklar:**
- [ ] [sfx.js](src/audio/sfx.js) içine ya da [boot.js](src/boot.js) içindeki mevcut `visibilitychange` dinleyicisinin yanına ekle:
  ```js
  document.addEventListener('visibilitychange', () => {
    if (!Sfx.ctx) return;
    if (document.hidden) Sfx.ctx.suspend().catch(() => {});
    else Sfx.ctx.resume().catch(() => {});
  });
  ```
- [ ] Ön plana dönüşte `resume()` gesture olmadan çalışmayabilir. Mevcut `Sfx.unlock()` zaten ilk dokunuşta bağlamı devam ettiriyor, bu yeterli.
- [ ] Arka plana geçerken oyunun da kaydedildiğinden emin ol. `save()` her hamlede çağrılıyor ([flow.js:68-71](src/game/flow.js#L68-L71)), ama sürükleme ortasında arka plana geçilirse parça tepsiye dönmeli. Bunu cihazda dene.

---

## ◐ 7. Ayarlara "Hakkında" bölümü ekle (sürüm yapıldı, linkler senin girdinle tamamlanacak)

> **Durum:** Ayarlarda sürüm satırı var (package.json'dan, test ediliyor), İngilizce çevirileri eklendi. Gizlilik politikası ve iletişim satırları [links.js](src/core/links.js) içindeki `PRIVACY_URL` ve `CONTACT_EMAIL` boş olduğu için **gizli**. Sahte değer gömmedim.
>
> **Senin yapacakların:** Gizlilik politikası sayfasını yayınla (GitHub Pages yeter), URL'yi ve iletişim e-postasını `links.js` içine yaz. Aynı URL'yi Play Console'a da gireceksin. Dış linklerin sistem tarayıcısında açıldığını cihazda doğrula.

**Neden:** Play bunu şart koşmuyor. Ama gizlilik politikası linki, iletişim adresi ve sürüm numarası destek taleplerinde ve kullanıcı yorumlarına cevap verirken çok işe yarar.

**Yapılacaklar:**
- [ ] [index.html](src/index.html) içinde `#settings` alt kısmına yeni bir `set-group` ekle: "Hakkında", sürüm (örn. `Blokzen 1.0.0`), "Gizlilik politikası" linki, "İletişim" (mailto).
- [ ] Sürümü [vite.config.js](vite.config.js) içinde `define: { __APP_VERSION__: JSON.stringify(pkg.version) }` ile build'e göm.
- [ ] Dış linkler WebView içinde açılmamalı, sistem tarayıcısına gitmeli. `@capacitor/browser` kullan ya da Capacitor'un dış URL davranışını cihazda dene.
- [ ] Yeni metinleri [i18n/en.js](src/i18n/en.js) dosyasına ekle ve `npm run check:i18n` çalıştır.

---

## ⏸ 8. INTERNET iznini kaldır (yayın build'inde): bilerek yapılmadı

> **Durum:** Yapılmadı. Capacitor WebView'i uygulama dosyalarını yerel adresten sunuyor ve izni kaldırmak yerelde doğrulanamıyor (bu makinede Android SDK yok). Yanlış çıkarsa uygulama açılışta boş ekranda kalabilir ve bunu ancak imzalı sürümü cihazda deneyince görürsün. Kazancı küçük: Veri Güvenliği formu izne değil, verinin toplanıp toplanmadığına bakar. Bunu ancak bir cihazda release build'iyle deneyip çalıştığını görürsen yap.

**Neden:** Oyun hiçbir ağ isteği yapmıyor (fontlar da yerel). [AndroidManifest.xml](android/app/src/main/AndroidManifest.xml) içinde `INTERNET` izni var çünkü Capacitor ekliyor ve canlı yenileme (live reload) için gerekiyor. Yayın build'inden kaldırmak, Veri Güvenliği formundaki "veri toplanmıyor" beyanını tutarlı kılar.

**Yapılacaklar:**
- [ ] `android/app/src/release/AndroidManifest.xml` dosyasını oluştur:
  ```xml
  <manifest xmlns:android="http://schemas.android.com/apk/res/android"
      xmlns:tools="http://schemas.android.com/tools">
      <uses-permission android:name="android.permission.INTERNET" tools:node="remove" />
  </manifest>
  ```
- [ ] 7. maddedeki dış linkler (gizlilik politikası) sistem tarayıcısında açıldığı için bu izin olmadan da çalışır. Bunu doğrula.
- [ ] Reklam veya analitik eklenecekse (bkz. en alttaki "Para kazanma modeli") bu maddeyi atla.

---

## 🟡 9. Eski WebView sürümleri

> **Durum:** `minSdkVersion` Capacitor 8 ile 24'e çıktı (Android 7). Bu seviyedeki cihazlarda WebView Play Store'dan güncellenir, risk azaldı. Yine de Android 7/8 emülatörde bir kez aç ve oyunun başladığını gör. Yedek hata mesajı eklenmedi.

**Neden:** `minSdkVersion = 23` (Android 6) destekleniyor. Ama Vite 7 varsayılan olarak Chrome 107+ için derliyor, kod da `Object.hasOwn` (Chrome 93+, [boot.js:69](src/boot.js#L69)) gibi yeni API'ler kullanıyor. WebView'i güncellenmemiş bir cihazda oyun beyaz ekranda kalabilir.

**Yapılacaklar (birini seç):**
- [ ] **Kolay yol:** `minSdkVersion`'ı 26 ya da 28'e çıkar. Bu cihazların neredeyse hepsinde WebView Play Store'dan güncelleniyor. Capacitor 8 zaten yükseltiyor olabilir. Play Console'daki cihaz kataloğundan kaç cihaz kaybedildiğine bak.
- [ ] **Zor yol:** [vite.config.js](vite.config.js) içinde `build.target` değerini düşür ve `@vitejs/plugin-legacy` ekle. Sonra Android 7/8 emülatörde, varsayılan (güncellenmemiş) WebView ile dene.
- [ ] Her iki durumda da, [index.html](src/index.html) içinde modül yüklenemezse "Lütfen Android System WebView'i güncelleyin" diyen küçük bir yedek mesaj göstermeyi düşün.

---

## 🟡 10. Sistem yazı boyutu

**Neden:** Android'de "Yazı boyutu" en büyüğe alınınca WebView metinleri ölçeklenebiliyor ve düzen bozulabiliyor (menü kartları, HUD).

**Yapılacaklar:**
- [ ] Cihazda en büyük yazı boyutu ve en büyük ekran ölçeğiyle dene.
- [ ] Bozuluyorsa [MainActivity.java](android/app/src/main/java/com/cinaraksoy/blokzen/MainActivity.java) içinde `onCreate` sonrasında `bridge.getWebView().getSettings().setTextZoom(100)` çağır. Bu erişilebilirliği azaltır; alternatif olarak düzeni esnek hale getirebilirsin.

---

## 🟡 11. Performans ve pil

**Neden:** Çok sayıda tema parçacık ve ortam animasyonu kullanıyor. Testler sadece masaüstü Chromium'da çalışıyor.

**Yapılacaklar:**
- [ ] Düşük donanımlı bir cihazda (2-3 GB RAM) birkaç ağır temayla FPS'e bak. `chrome://inspect` ile WebView'e bağlanıp Performance kaydı al.
- [ ] Menü açıkken ya da oyun bittiğinde `requestAnimationFrame` döngüsü boşa çiziyor mu, kontrol et ([render.js:196](src/render/render.js#L196) bazı durumları zaten atlıyor).
- [ ] "Düşük efekt modu" düşük donanımda otomatik açılsın mı? Örneğin `navigator.deviceMemory <= 2` ise. Karar ver.
- [ ] 10 dakikalık oyun boyunca pil tüketimini ve ısınmayı not et.

---

## 🟡 12. Sonucu paylaşma

**Neden:** "Sonucu kopyala" butonu ([levels.js:65-70](src/ui/levels.js#L65-L70)) panoya kopyalıyor. Android WebView'de `navigator.clipboard` her zaman çalışmayabilir. Ayrıca mobilde kullanıcı genelde paylaşım menüsü bekler.

**Yapılacaklar:**
- [ ] Cihazda kopyalamanın çalıştığını doğrula.
- [ ] İsteğe bağlı: `@capacitor/share` ile native paylaşım menüsünü aç, panoya kopyalamayı yedek olarak bırak.

---

## 🟡 13. Tablette yatay düzen

**Neden:** Tablet ekranlarında döndürme açık ([MainActivity.java](android/app/src/main/java/com/cinaraksoy/blokzen/MainActivity.java)). API 36'da zaten kilitlenemiyor. Play, tablet destekleyen uygulamalar için tablet ekran görüntüsü de istiyor.

**Yapılacaklar:**
- [ ] Tablet emülatörlerinde (7" ve 10") dikey/yatay geçişlerde ve oyunun ortasında döndürürken düzeni ve sürükle-bırak hizasını kontrol et.
- [ ] Katlanabilir cihaz emülatöründe katlama/açma sırasında oyunun kaybolmadığını doğrula.

---

## 🟢 14. Yayından sonra da yapılabilir

- [ ] **Bulut kayıt:** İlerleme sadece `localStorage`'da duruyor ([store.js](src/core/store.js)). `allowBackup="true"` olduğu için Android Otomatik Yedekleme WebView verisini kısmen geri getirebilir, ama bunu cihaz değiştirerek doğrula. Kalıcı çözüm Play Games Services ile Saved Games.
- [ ] **Uygulama içi değerlendirme:** `@capacitor-community/in-app-review` ile birkaç başarılı oyundan sonra puan iste.
- [ ] **JS hata görünürlüğü:** Play Console Android Vitals sadece native çökmeleri gösteriyor, WebView içindeki JS hatalarını göstermiyor. Bir hata raporlama aracı eklenirse Veri Güvenliği formu da güncellenmeli.
- [ ] **Şablon dosyalar:** `com/getcapacitor/myapp` altındaki örnek testler ([ExampleInstrumentedTest.java](android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java), [ExampleUnitTest.java](android/app/src/test/java/com/getcapacitor/myapp/ExampleUnitTest.java)) silinebilir.

---

## Kod dışı ama yayını bekleten işler

Bunlar kod değil ama takvimi belirliyor. Kod işleriyle paralel yürütülmeli.

- [ ] **Kapalı test: 12 test kullanıcısı, 14 gün.** Kişisel geliştirici hesaplarında production'dan önce zorunlu. Takvimdeki en uzun kalem bu, en başta başlatılmalı. Testlere ilk imzalı AAB (2. madde) ile başlanabilir; sonraki düzeltmeler aynı kanala güncelleme olarak yüklenir.
- [ ] **Para kazanma modeli:** Ücretsiz yayınlanan bir uygulama sonradan ücretliye çevrilemiyor. Reklam gelecekse AdMob, GDPR onay ekranı (UMP) ve Veri Güvenliği formu güncellemesi gerekecek. İlk yüklemeden önce karar verilmeli.
- [ ] **Gizlilik politikası:** Herkese açık bir URL olmalı. GitHub Pages yeterli.
- [ ] **Play Console formları:** Veri Güvenliği, İçerik derecelendirmesi (IARC), Hedef kitle (13 yaş altı seçilirse Aileler politikası devreye girer), Reklam beyanı, Uygulama erişimi.
- [ ] **Mağaza sayfası (TR + EN):** Kısa açıklama (80 karakter), tam açıklama (4000 karakter), 512×512 ikon, 1024×500 öne çıkan görsel, telefon ekran görüntüleri (en az 2), 7" ve 10" tablet ekran görüntüleri.
- [ ] **Uygulama kimliği:** `com.cinaraksoy.blokzen` ilk yüklemeden sonra değiştirilemez. Son kez onayla.
