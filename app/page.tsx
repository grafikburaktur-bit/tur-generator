"use client";

import React, { useState, useRef, useEffect } from "react";

const ICON_BASE_URL =
  "https://www.buraktur.com/AlbumMedia/ckUpload/images/icon/";

const ICON_OPTIONS = [
  { label: "✈️ Uçak", value: "airplane.png" },
  { label: "🚌 Otobüs", value: "bus.png" },
  { label: "🚢 Gemi", value: "ship.png" },
  { label: "⛵ Tekne", value: "boat.png" },
  { label: "🚆 Tren", value: "train.png" },
  { label: "🖱️ Tıklama", value: "click.png" },
  { label: "👉 Özel Tıklama", value: "pclick.png" },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

interface RouteNode {
  id: string;
  location: string;
  iconToNext: string;
}

interface DayData {
  id: number;
  type: "meeting" | "day";
  dayTitle: string;
  routes: RouteNode[];
  content: string;
  imageUrl: string;
  notes: string[]; // Çoklu önemli notlar (kırmızı kutu)
}

interface HeroData {
  duration: string;
  title: string;
  subtitle: string;
  features: string[];
  footerText: string;
  footerUrl: string;
}

const DEFAULT_INCLUDED = [
  "Türk Hava Yolları ile İstanbul - Vilnius / Helsinki - İstanbul gidiş-dönüş ekonomi sınıfı uçak bileti ve vergileri",
  "4 gece 4* otellerde konaklama",
  "4 kahvaltı ve 4 akşam yemeği",
  "Sigulda Kalesi, Turaida Kalesi, Turaida Müzesi giriş ücretleri",
  "Programda adı geçen tüm transferler",
  "Türkçe rehberlik hizmeti",
  "Seyahat sigortası",
  "Tüm yurt dışı yerel vergiler ve Türkiye KDV",
];

const DEFAULT_EXCLUDED = [
  "Schengen vizesi ve hizmet bedeli 300€ (Yeşil pasaporta vize gerekmemektedir.)",
  "Diğer şehirlerden İstanbul'a iç hat bağlantı uçuşu ücreti",
  "Öğle yemekleri ve tüm yemeklerde alınan kapalı su ve kapalı içecekler",
  "İlk gün kahvaltı, son gün akşam yemeği",
  "Yurt dışı çıkış harcı",
  "Program dışı talep edilecek turlar",
  "Otel ekstraları (oda servisleri, telefon vb.), bahşiş",
  "Programda dahil olduğu açıkça belirtilmemiş her türlü hizmet",
];

const DEFAULT_IMPORTANT_NOTES = [
  "Tur fiyatlarımız anlık olarak değişebilmektedir. Rezervasyon sırasında geçerli olan fiyat esas alınır.",
  "Turlarımızda \"ekstra tur\" adı altında hiçbir ek ücret talep edilmez.",
  "Tüm turlarımızda farz namazlarınızı kılabilmeniz ve helal yemek yiyebilmeniz için gerekli hassasiyeti göstermekteyiz.",
  "Cuma ve bayram namazlarına denk gelen turlarda; namazların camide toplu olarak kılınması gerektiği için her zaman mümkün olamamaktadır. Vakit namazlarında abdest alacak ve namaz kılacak temizlikte yer bulunamayabilir. Bu gibi durumlarda seferilik ruhsatlarından yararlanarak cem edilebilmektedir.",
  "Belirtilen otel sınıfı aynı kalmak kaydı ile isimleri değişebilir.",
  "Dernek, kurum, kuruluş ve gruplar için özel turlar düzenlemekteyiz.",
  "3'lü ve 4'lü odalarda 3. ve 4. yataklar ilave yataklardır. İlave yataklar normal yataklardan küçüktür, açılır-kapanır yatak veya kanepe olabilir.",
  "Tüm turlarımızda seyahat belgenizin (pasaport vb.) en az 6 ay (tur dönüş tarihinden itibaren) geçerlilik süresi olması gerekmektedir.",
  "Rehberimiz, acentemizin onayı ile tur programında değişiklik yapma ve hava durumuna ve/veya mücbir sebebe bağlı olarak gezi noktalarında bulunan bazı yerleri iptal etme hakkına sahiptir. Turumuza katılan tüm misafirlerimiz bunu kabul etmiş sayılır.",
  "Yeterli katılım sağlanamadığı takdirde acente tarafından tur iptal edilebilir. Böyle bir durumda son iptal bildirim tarihi gezi hareket tarihinden 5 gün öncesidir ve acenteniz tarafından iletilecektir.",
  "Vizeli turlara katılacak misafirlerimizin iptal ve iade koşullarını okuyup vizelerinin yetişeceği tura kayıt yaptırmaları gerekmektedir. Vizeden kaynaklanacak olası bir aksaklıkta şirketimizin iptal ve iade koşulları geçerli olacaktır.",
  "Şirketimiz aracılığıyla yapılan vize başvurularında şirketimizin hiçbir sorumluluğu yoktur. Vize hizmetimiz danışmanlık, randevu alımı, gerekli evrak bilgilendirmesi, evrak düzeni ve teslimi gibi hizmetleri içermektedir. Vizenin çıkmaması durumunda vize için ödenen ücretin iadesi yoktur. Tur ücretinin iadesinde iptal ve iade koşulları geçerli olacaktır.",
  "Havayolu şirketlerinde sıralı uçuş kuralı bulunmaktadır. Yolcunun herhangi bir uçuş bacağını kaçırması durumunda geri kalan tüm uçuş bacakları iptal olur. Hiçbir şekilde iptal, iade veya değişiklik yapılamaz.",
  "Turlarımızda oluşabilecek uçak saati değişikliği veya bağlantı uçuşlarında yaşanacak gecikmeler nedeniyle misafirlerimizin münferit olarak ayrı iç hat uçuşu almamalarını önemle rica ederiz. Şirketimiz tarafından yurt dışı bileti ile birlikte tek bilette düzenlenen bağlantılı iç hat uçuşu bir sonraki yurtdışı uçuşunu da kapsamaktadır. İç hat uçuşunda oluşabilecek gecikme vs. durumunda bir sonraki dış hat uçuşuna ücretsiz bilet düzenlenmektedir.",
  "Acentemiz, hava yolu ile yolcu arasında aracı kurum olup, 28.09.1955 Lahey Protokolü'ne tabidir. Tarifeli ve özel uçuşlarda rötar riski olabilir veya mevcut gezi ve uçuş öncesinde saatler değişebilir. Acentemiz, bu değişiklikleri en kısa sürede bildirmekle yükümlüdür. Yolcu saat değişme ihtimalini kabul ederek geziyi satın almıştır.",
];

const STYLE_BLOCK = `<!-- PREMIUM FONT: OUTFIT -->
<link href="https://fonts.googleapis.com" rel="preconnect" />
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect" />
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&amp;display=swap" rel="stylesheet" />
<style type="text/css">
.bt-tourday, .bt-tourday * { font-family: 'Outfit', sans-serif !important; box-sizing: border-box; }
.bt-tourday { color: #0f172a; line-height: normal; text-align: left !important; margin: 0 !important; padding: 0 !important; }
.bt-tour-main-container { width: 100%; max-width: 900px; margin: 0 auto; padding: 20px 10px; }
.bt-tour-container { width: 100%; max-width: 900px; margin: 0 auto; padding: 12px 20px !important; }
.bt-tour-hero-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 32px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.08); position: relative; margin-bottom: 36px; }
[data-bt-brand-only][hidden] { display: none !important; }
.bt-tour-res-section { background: linear-gradient(135deg, #1ea1be 0%, #003e70 100%); border-radius: 24px; padding: 24px; margin-bottom: 32px; text-align: center; box-shadow: 0 10px 20px rgba(2, 6, 23, 0.15); }
.bt-tour-res-section p { color: rgba(255, 255, 255, 0.85); font-size: 15px !important; margin: 0 0 16px 0 !important; font-weight: 300; }
.bt-tour-btn-group { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.bt-tour-btn { padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px; }
.bt-tour-btn-wa { background: #22c55e; color: white; }
.bt-tour-btn-cc { background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.1); }
.bt-tour-tag { display: inline-block; padding: 4px 12px; background: #eff6ff; color: #2563eb; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
.bt-tour-title { font-size: 40px; font-weight: 800; color: #0f172a; margin-bottom: 6px; line-height: 1.1; }
.bt-tour-subtitle { font-size: 18px; color: #64748b; margin-bottom: 24px; font-weight: 400; }
.bt-tour-divider { height: 1px; background: #f1f5f9; margin-bottom: 24px; }
.bt-tour-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.bt-tour-item { background: #ffffff; border: 1px solid #f1f5f9; border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 12px; }
.bt-tour-item-text { font-size: 13.5px; font-weight: 600; color: #334155; }
.bt-tour-footer-meta { margin-top: 32px; display: flex; align-items: center; justify-content: center; border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center; }
.bt-tour-footer-link { opacity: 0.5; font-size: 12px; text-decoration: none; color: inherit; }

/* GÜN / BULUŞMA BLOK YAPISI - KARTLAR ARASI FERAH BOŞLUK */
.bt-tourday .bt-day-item {
  margin-bottom: 36px !important;
}
.bt-tourday .bt-day-item:last-child {
  margin-bottom: 0 !important;
}

/* HEADER & BADGES */
.bt-tourday .bt-tour-header, .bt-tourday .bt-tour-header *, .bt-tourday .bt-tour-header *::before, .bt-tourday .bt-tour-header *::after {
  box-sizing: border-box !important; margin: 0 !important; padding: 0 !important; border: none !important;
  line-height: 1.2 !important; font-size: 15px !important; font-family: 'Outfit', sans-serif !important;
  letter-spacing: normal !important; text-transform: none !important; vertical-align: baseline !important;
  min-height: 0 !important; max-height: none !important;
}
.bt-tourday .bt-tour-header { display: flex !important; align-items: center !important; justify-content: flex-start !important; flex-wrap: wrap !important; gap: 16px !important; margin-bottom: 20px !important; }
.bt-tourday .bt-tour-header .bt-day-badge {
  font-size: 15px !important; font-weight: 800 !important; color: #ffffff !important; background-color: #06b8de !important;
  padding: 6px 16px !important; border-radius: 8px !important; line-height: 1.2 !important; white-space: nowrap !important;
  flex-shrink: 0 !important; display: inline-flex !important; align-items: center !important; justify-content: center !important;
  height: 34px !important; max-height: 34px !important;
}
.bt-tourday .bt-day-badge.bulusma { background-color: #06b8de !important; }
.bt-tourday .bt-tour-route {
  display: inline-flex !important; align-items: center !important; gap: 10px !important; padding: 6px 16px !important;
  border-radius: 8px !important; background: #f1f5f9 !important; font-size: 15px !important; line-height: 1.2 !important;
  color: #334155 !important; font-weight: 500 !important; flex-wrap: wrap !important; height: 34px !important; max-height: 34px !important;
  align-self: center !important; overflow: hidden !important;
}
.bt-tourday .bt-tour-route .stop { font-weight: 700 !important; color: #0f172a !important; line-height: 1.2 !important; }
.bt-tourday .bt-tour-route img { width: 18px !important; height: 18px !important; display: inline-block !important; vertical-align: middle !important; margin: 0 4px !important; }

/* KART */
.bt-tourday .bt-tour-card {
  background: #ffffff; border-radius: 24px; padding: 28px;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.1);
  margin-bottom: 14px !important;
  border: 1px solid #f1f5f9;
}
.bt-tourday .bt-meeting-card { border-left: none; }
.bt-tourday .bt-tour-text p, .bt-tourday .bt-tour-container p, .bt-tourday .bt-tour-container li, .bt-tourday .bt-tour-container span { overflow-wrap: break-word !important; word-wrap: break-word !important; word-break: break-word !important; }
.bt-tourday .bt-tour-text p { margin: 0 0 16px; font-size: 16px; color: #334155; line-height: 1.7; text-align: justify !important; text-justify: inter-word !important; }
.bt-tourday .bt-tour-text p:last-child { margin-bottom: 0; }
.bt-tourday .bt-tour-text strong, .bt-tourday .bt-tour-text b { color: #0f172a; font-weight: 700; }

/* GÖRSEL */
.bt-tourday .bt-tour-image {
  width: 100%; height: auto; max-height: 450px; border-radius: 20px;
  overflow: hidden; box-shadow: 0 14px 30px rgba(15, 23, 42, 0.15);
  margin-bottom: 14px !important;
}
.bt-tourday .bt-tour-image img { width: 100%; height: 100%; display: block; object-fit: cover; }

/* GÜN ALTI NOT / ÖNEMLİ (KIRMIZI KUTU) */
.bt-tourday .bt-day-note {
  margin-top: 10px !important;
  margin-bottom: 10px !important;
  padding: 12px 16px;
  border-radius: 12px;
  background: #fff7f7;
  border-left: 4px solid #dc2626;
  color: #dc2626;
  font-size: 13px;
  line-height: 1.6;
}
.bt-tourday .bt-day-note:last-child {
  margin-bottom: 0 !important;
}
.bt-tourday .bt-day-note strong { color: #dc2626; }

@media (max-width: 768px) {
  .bt-tour-hero-card { padding: 24px 16px; border-radius: 24px; }
  .bt-tour-title { font-size: 28px; }
  .bt-tour-grid { grid-template-columns: 1fr; }
  .bt-tourday .bt-day-item { margin-bottom: 28px !important; }
  .bt-tourday .bt-tour-container { padding: 10px !important; }
  .bt-tourday .bt-tour-header { display: flex !important; flex-direction: row !important; flex-wrap: wrap !important; align-items: center !important; justify-content: flex-start !important; text-align: left !important; gap: 10px !important; }
  .bt-tourday .bt-tour-header .bt-day-badge { font-size: 14px !important; text-align: left !important; align-self: center !important; }
  .bt-tourday .bt-tour-route { border-radius: 8px !important; padding: 6px 12px !important; background: #f1f5f9 !important; gap: 8px !important; text-align: left !important; justify-content: flex-start !important; height: auto !important; max-height: none !important; flex-wrap: wrap !important; }
  .bt-tourday .bt-tour-card { padding: 20px 14px !important; border-radius: 16px; margin-bottom: 12px !important; }
  .bt-tourday .bt-tour-text p { text-align: justify !important; text-justify: inter-word !important; font-size: 15px; }
  .bt-tourday .bt-tour-image { max-height: 300px; margin-bottom: 12px !important; }
}
</style>\n\n`;

export default function TurOlusturucu() {
  const [activeTab, setActiveTab] = useState<
    "program" | "included" | "excluded" | "important" | "all"
  >("program");

  // HERO
  const [hero, setHero] = useState<HeroData>({
    duration: "4 Gece / 5 Gün",
    title: "BÜYÜK BALTIKLAR & HELSİNKİ TURU",
    subtitle: "Litvanya, Letonya, Estonya, Finlandiya",
    features: [
      "✈️ Türk Hava Yolları İle",
      "🏰 4 Ülke & 4 Başkent",
      "🍱 Akşam Yemekleri Dahil",
      "🎫 Tüm Kale ve Müze Girişleri Dahil",
      "✅ Ekstra Tur Ödemesi Yok",
    ],
    footerText: "Tüm Baltık Turları İçin Tıklayınız",
    footerUrl: "https://www.buraktur.com/tur/avrupa-turlari/baltik-turlari",
  });

  // GÜNLER & BULUŞMA
  const [days, setDays] = useState<DayData[]>([
    {
      id: 1,
      type: "meeting",
      dayTitle: "Buluşma",
      routes: [
        { id: "route-b1", location: "İstanbul Havalimanı (IST)", iconToNext: "airplane.png" },
        { id: "route-b2", location: "Vilnius (VNO)", iconToNext: "" },
      ],
      content:
        "İstanbul Yeni Havalimanı Dış Hatlar Terminali Giden Yolcu Salonu 'Türk Hava Yolları' bankosunda saat 06.00'da buluşuyoruz. Bilet, bagaj ve pasaport işlemlerinin ardından TK1407 sefer sayılı uçuş ile saat 08.40'ta Vilnius'a hareket ediyoruz.",
      imageUrl: "",
      notes: [
        "Uçuş saatinden en az 3 saat önce havalimanında hazır bulunmanız gerekmektedir.",
      ],
    },
    {
      id: 2,
      type: "day",
      dayTitle: "1. Gün",
      routes: [
        { id: "route-1a", location: "Vilnius", iconToNext: "bus.png" },
        { id: "route-1b", location: "Trakai", iconToNext: "bus.png" },
        { id: "route-1c", location: "Vilnius", iconToNext: "" },
      ],
      content:
        "Varışımızın ardından bizi bekleyen özel otobüsümüz ile panoramik Vilnius şehir turuna başlıyoruz. UNESCO Dünya Mirası Listesi'nde yer alan Tarihi Şehir Meydanı, Vilnius Katedrali, Gediminas Kalesi ve Şafak Kapısı görülecek yerler arasındadır. Ardından göl üzerindeki muhteşem Trakai Kalesi'ne hareket ediyoruz.",
      imageUrl: "https://www.buraktur.com/AlbumMedia/ckUpload/images/Dubai/3.jpg",
      notes: [
        "Bugün Trakai Kalesi giriş biletleri tur ücretine dahildir.",
        "Akşam yemeği yerel restoranda helal konseptli olarak alınacaktır.",
      ],
    },
  ]);

  // DAHİL OLANLAR
  const [includedTitle, setIncludedTitle] = useState<string>("Fiyata Dahil Olan Hizmetler");
  const [includedServices, setIncludedServices] = useState<string[]>(DEFAULT_INCLUDED);

  // HARİÇ OLANLAR
  const [excludedTitle, setExcludedTitle] = useState<string>("Fiyata Dahil Olmayan Hizmetler");
  const [excludedServices, setExcludedServices] = useState<string[]>(DEFAULT_EXCLUDED);

  // ÖNEMLİ BİLGİLER
  const [importantTitle, setImportantTitle] = useState("Önemli Bilgiler ve Notlar");

  // YAPAY ZEKA VE OTOMATİK KALINLAŞTIRMA DURUMLARI
  const [geminiApiKey, setGeminiApiKey] = useState<string>("");
  const [activeAiModel, setActiveAiModel] = useState<string>("gemini-1.5-flash");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiTesting, setIsAiTesting] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [autoBoldOnImport, setAutoBoldOnImport] = useState(true);

  // Sayfa yüklendiğinde kayıtlı API anahtarını ve aktif modeli al
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("bt_gemini_key");
      if (savedKey) setGeminiApiKey(savedKey);
      const savedModel = localStorage.getItem("bt_gemini_active_model");
      if (savedModel) setActiveAiModel(savedModel);
    }
  }, []);

  const saveApiKey = (key: string) => {
    setGeminiApiKey(key);
    if (typeof window !== "undefined") {
      localStorage.setItem("bt_gemini_key", key);
    }
  };

  // API ANAHTARINI TEST ETME FONKSİYONU (KESİNTİSİZ & ÇOKLU MODEL YEDEKLİ)
  const testAiKey = async () => {
    const cleanKey = geminiApiKey.trim();
    if (!cleanKey) {
      setAiTestResult({ success: false, message: "Lütfen önce bir API anahtarı giriniz." });
      return;
    }
    setIsAiTesting(true);
    setAiTestResult(null);

    try {
      // 1. En kararlı ve kotası en yüksek temel modeller
      let candidateNames = [
        "gemini-1.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-2.0-flash-exp"
      ];

      // 2. Google ListModels sorgula ve desteklenen modelleri listeye ekle
      try {
        const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`);
        if (listRes.ok) {
          const listData = await listRes.json();
          const models: any[] = listData.models || [];
          const supported = models
            .filter((m: any) =>
              Array.isArray(m.supportedGenerationMethods) &&
              m.supportedGenerationMethods.includes("generateContent")
            )
            .map((m: any) => m.name.replace(/^models\//, ""))
            // Kararsız/deneysel/kullanım dışı uç modelleri filtrele
            .filter((name: string) => !name.includes("preview") && !name.includes("medium") && !name.includes("2.5"));

          // Standart modelleri öncelikli tutarak birleştir
          candidateNames = Array.from(new Set([...candidateNames, ...supported]));
        }
      } catch (listErr) {
        console.warn("ListModels alınamadı, standart modeller denenecek:", listErr);
      }

      // Kullanıcının kayıtlı modeli varsa en başa al
      if (activeAiModel && candidateNames.includes(activeAiModel)) {
        candidateNames = [activeAiModel, ...candidateNames.filter((m) => m !== activeAiModel)];
      }

      let workingModel = "";
      let errorLog: string[] = [];

      // Modelleri sırayla test et, İLK ÇALIŞAN modeli onayla!
      for (const modelName of candidateNames) {
        try {
          const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${cleanKey}`;
          const genRes = await fetch(genUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: "ping" }] }],
            }),
          });

          if (genRes.ok) {
            workingModel = modelName;
            break; // Başarılı!
          } else {
            const errData = await genRes.json().catch(() => ({}));
            const msg = errData.error?.message || `HTTP ${genRes.status}`;
            errorLog.push(`${modelName}: ${msg}`);
          }
        } catch (e: any) {
          errorLog.push(`${modelName}: ${e.message}`);
        }
      }

      if (!workingModel) {
        throw new Error(
          `Hiçbir Gemini modeli yanıt vermedi. Son hata: ${errorLog[errorLog.length - 1] || "Bilinmeyen hata"}`
        );
      }

      setActiveAiModel(workingModel);
      if (typeof window !== "undefined") {
        localStorage.setItem("bt_gemini_active_model", workingModel);
      }

      setAiTestResult({
        success: true,
        message: `✓ Başarılı! Google Gemini API bağlantısı kuruldu. Aktif Model: ${workingModel}`
      });
    } catch (err: any) {
      setAiTestResult({
        success: false,
        message: "❌ " + err.message
      });
    } finally {
      setIsAiTesting(false);
    }
  };

  const [importantNotes, setImportantNotes] = useState<string[]>(DEFAULT_IMPORTANT_NOTES);

  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [copiedCardId, setCopiedCardId] = useState<number | string | null>(null);

  // MODAL / PDF AKTARMA STATELERİ
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- HERO İŞLEMLERİ ---
  const addFeature = () => {
    setHero({ ...hero, features: [...hero.features, "Yeni Özellik"] });
  };
  const updateFeature = (index: number, val: string) => {
    const newFeatures = [...hero.features];
    newFeatures[index] = val;
    setHero({ ...hero, features: newFeatures });
  };
  const removeFeature = (index: number) => {
    setHero({ ...hero, features: hero.features.filter((_, i) => i !== index) });
  };

  // --- GÜN & BULUŞMA İŞLEMLERİ ---
  const addMeeting = () => {
    const newId = days.length > 0 ? Math.max(...days.map((d) => d.id)) + 1 : 1;
    const meetingItem: DayData = {
      id: newId,
      type: "meeting",
      dayTitle: "Buluşma",
      routes: [
        { id: generateId(), location: "İstanbul Havalimanı", iconToNext: "airplane.png" },
        { id: generateId(), location: "Hedef Şehir", iconToNext: "" },
      ],
      content: "Havalimanı buluşma detayları ve uçuş bilgileri buraya yazılır...",
      imageUrl: "",
      notes: ["Havalimanında uçuş saatinden 3 saat önce hazır bulunulmalıdır."],
    };
    setDays([meetingItem, ...days]);
  };

  const addDay = () => {
    const newId = days.length > 0 ? Math.max(...days.map((d) => d.id)) + 1 : 1;
    const dayCount = days.filter((d) => d.type === "day").length + 1;
    setDays([
      ...days,
      {
        id: newId,
        type: "day",
        dayTitle: `${dayCount}. Gün`,
        routes: [
          { id: generateId(), location: "Başlangıç Noktası", iconToNext: "bus.png" },
          { id: generateId(), location: "Varış Noktası", iconToNext: "" },
        ],
        content: "Tur gününün detaylı açıklamasını buraya yazınız...",
        imageUrl: "",
        notes: [],
      },
    ]);
  };

  const updateDay = (id: number, field: keyof DayData, value: any) => {
    setDays(days.map((day) => (day.id === id ? { ...day, [field]: value } : day)));
  };

  const removeDay = (id: number) => {
    setDays(days.filter((day) => day.id !== id));
  };

  const addRouteNode = (dayId: number) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          const newRoutes = [...day.routes];
          if (newRoutes.length > 0) newRoutes[newRoutes.length - 1].iconToNext = "bus.png";
          newRoutes.push({ id: generateId(), location: "Yeni Durak", iconToNext: "" });
          return { ...day, routes: newRoutes };
        }
        return day;
      })
    );
  };

  const updateRouteNode = (
    dayId: number,
    routeId: string,
    field: keyof RouteNode,
    value: string
  ) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            routes: day.routes.map((route) =>
              route.id === routeId ? { ...route, [field]: value } : route
            ),
          };
        }
        return day;
      })
    );
  };

  const removeRouteNode = (dayId: number, routeId: string) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          const newRoutes = day.routes.filter((r) => r.id !== routeId);
          if (newRoutes.length > 0) newRoutes[newRoutes.length - 1].iconToNext = "";
          return { ...day, routes: newRoutes };
        }
        return day;
      })
    );
  };

  // ÇOKLU ÖNEMLİ NOT İŞLEMLERİ (GÜN İÇİN)
  const addDayNote = (dayId: number) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          return { ...day, notes: [...day.notes, "Yeni önemli not açıklaması..."] };
        }
        return day;
      })
    );
  };

  const updateDayNote = (dayId: number, noteIndex: number, text: string) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          const newNotes = [...day.notes];
          newNotes[noteIndex] = text;
          return { ...day, notes: newNotes };
        }
        return day;
      })
    );
  };

  const removeDayNote = (dayId: number, noteIndex: number) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          return { ...day, notes: day.notes.filter((_, idx) => idx !== noteIndex) };
        }
        return day;
      })
    );
  };

  // --- DAHİL / HARİÇ / ÖNEMLİ BİLGİLER YARDIMCILARI ---
  const addIncludedItem = () => {
    setIncludedServices([...includedServices, "Yeni dahil hizmet açıklaması..."]);
  };
  const updateIncludedItem = (idx: number, val: string) => {
    const list = [...includedServices];
    list[idx] = val;
    setIncludedServices(list);
  };
  const removeIncludedItem = (idx: number) => {
    setIncludedServices(includedServices.filter((_, i) => i !== idx));
  };

  const addExcludedItem = () => {
    setExcludedServices([...excludedServices, "Yeni hariç hizmet açıklaması..."]);
  };
  const updateExcludedItem = (idx: number, val: string) => {
    const list = [...excludedServices];
    list[idx] = val;
    setExcludedServices(list);
  };
  const removeExcludedItem = (idx: number) => {
    setExcludedServices(excludedServices.filter((_, i) => i !== idx));
  };

  const addImportantItem = () => {
    setImportantNotes([...importantNotes, "Yeni önemli bilgi notu..."]);
  };
  const updateImportantItem = (idx: number, val: string) => {
    const list = [...importantNotes];
    list[idx] = val;
    setImportantNotes(list);
  };
  const removeImportantItem = (idx: number) => {
    setImportantNotes(importantNotes.filter((_, i) => i !== idx));
  };

  // =========================================================================
  // AKILLI PDF / METİN PARSER (AYRIŞTIRICI) MOTORU
  // =========================================================================


  // =========================================================================
  // MOD A: YEREL AKILLI KALINLAŞTIRMA (INTERNETSIZ / SÖZLÜK TABANLI)
  // =========================================================================
  const autoBoldDayContent = (text: string, destinations: string[] = []): string => {
    if (!text) return "";
    let res = text;

    // 1. Durak ve Şehir İsimleri
    destinations.forEach((dest) => {
      if (dest && dest.length > 2) {
        try {
          const reg = new RegExp(`(?<!<b>)(?<![a-zA-ZçğıöşüÇĞİÖŞÜ])(${dest})(?![a-zA-ZçğıöşüÇĞİÖŞÜ])(?!<\/b>)`, "gi");
          res = res.replace(reg, "<b>$1</b>");
        } catch (e) {}
      }
    });

    // 2. Sefer Kodları (TK266, TK0252, vb.)
    res = res.replace(/(?<!<b>)\b([A-Z]{2}\s*\d{3,4})\b(?!<\/b>)/g, "<b>$1</b>");

    // 3. Saatler (01.30’da, 07.45, 18.05 vb.)
    res = res.replace(/(?<!<b>)\b(\d{1,2}\.\d{2}(?:['’][a-zçğıöşü]+)?)\b(?!<\/b>)/gi, "<b>$1</b>");

    // 4. Havalimanı / Terminal Kalıpları
    res = res.replace(/(?<!<b>)\b([A-ZÇĞİÖŞÜ][a-zA-ZçğıöşüÇĞİÖŞÜ\s]+(?:Havalimanı(?:’?[a-zçğıöşü]+)?|Havaalanı(?:’?[a-zçğıöşü]+)?|Dış Hatlar Terminali))\b(?!<\/b>)/g, "<b>$1</b>");

    // 5. Tarihi, Dini ve Kültürel Mekan Kalıpları
    const placeSuffixes = [
      "Türbe ve Külliyeleri(?:[’'][a-zçğıöşü]+)?",
      "Türbe ve Külliyesi(?:[’'][a-zçğıöşü]+)?",
      "Çeşmesi ve Türbesi(?:[’'][a-zçğıöşü]+)?",
      "Türbesi(?:[’'][a-zçğıöşü]+)?",
      "Camisi(?:[’'][a-zçğıöşü]+)?",
      "Camii(?:[’'][a-zçğıöşü]+)?",
      "Mescidi(?:[’'][a-zçğıöşü]+)?",
      "Medresesi(?:[’'][a-zçğıöşü]+)?",
      "Külliyesi(?:[’'][a-zçğıöşü]+)?",
      "Minaresi(?:[’'][a-zçğıöşü]+)?",
      "Kalesi(?:[’'][a-zçğıöşü]+)?",
      "Kompleksi(?:[’'][a-zçğıöşü]+)?",
      "Tapınağı(?:[’'][a-zçğıöşü]+)?",
      "Mozolesi(?:[’'][a-zçğıöşü]+)?",
      "Sarayı(?:[’'][a-zçğıöşü]+)?",
      "Müzesi(?:[’'][a-zçğıöşü]+)?",
      "Meydanı(?:[’'][a-zçğıöşü]+)?",
      "Köprüsü(?:[’'][a-zçğıöşü]+)?",
      "Katedrali(?:[’'][a-zçğıöşü]+)?",
      "Kilisesi(?:[’'][a-zçğıöşü]+)?",
      "Manastırı(?:[’'][a-zçğıöşü]+)?",
      "Kapısı(?:[’'][a-zçğıöşü]+)?",
      "Kulesi(?:[’'][a-zçğıöşü]+)?",
      "Anıtı(?:[’'][a-zçğıöşü]+)?",
      "Heykeli(?:[’'][a-zçğıöşü]+)?",
      "Gölü(?:[’'][a-zçğıöşü]+)?",
      "Nehri(?:[’'][a-zçğıöşü]+)?",
      "Kanalı(?:[’'][a-zçğıöşü]+)?",
      "Parkı(?:[’'][a-zçğıöşü]+)?",
      "Tünelleri(?:[’'][a-zçğıöşü]+)?",
      "Pazarı(?:[’'][a-zçğıöşü]+)?",
      "Çarşısı(?:[’'][a-zçğıöşü]+)?",
      "Hotel(?:\s+vb\.?)?",
      "Oteli(?:\s+vb\.?)?"
    ];

    const suffixRegexStr = `([A-ZÇĞİÖŞÜ][a-zA-ZçğıöşüÇĞİÖŞÜ\\-’'\\(\\)\\.]*(?:\\s+[A-ZÇĞİÖŞÜ][a-zA-ZçğıöşüÇĞİÖŞÜ\\-’'\\(\\)\\.]*){0,6}\\s+(?:${placeSuffixes.join("|")}))`;
    try {
      const placeRegex = new RegExp(`(?<!<b>)${suffixRegexStr}(?!<\\/b>)`, "g");
      res = res.replace(placeRegex, "<b>$1</b>");
    } catch (e) {}

    // 6. Sabit dünya mirası / özel mekan terimleri
    const specialTerms = ["UNESCO Dünya Mirası", "Eski Mahalle", "Tren Sokağı", "Angkor Wat", "Lebi Havuz", "Check-in", "Türk Hava Yolları", "THY"];
    specialTerms.forEach((term) => {
      try {
        const r = new RegExp(`(?<!<b>)(${term})(?!<\\/b>)`, "gi");
        res = res.replace(r, "<b>$1</b>");
      } catch (e) {}
    });

    // 7. Çift veya iç içe <b> taglerini temizle
    res = res.replace(/<b>\s*<b>/gi, "<b>").replace(/<\/b>\s*<\/b>/gi, "</b>");
    return res;
  };

  // HERO KARTI İÇİN 4-6 MADDE ÇIKARMA (HAVAYOLU KESİNLİKLE HARİÇ TUTULUR)
  const extractHeroFeatures = (incList: string[], tourContent: string, tourTitle: string): string[] => {
    const features: string[] = [];
    const fullContext = (tourTitle + " " + tourContent + " " + incList.join(" ")).toLowerCase();

    // 1. Ülke & Şehir Sayısı (örn: 4 Ülke & 4 Başkent)
    const countryMatch = fullContext.match(/(\d+)\s*(?:ülke|başkent)/i);
    if (countryMatch) {
      features.push(`🏰 ${countryMatch[0].toUpperCase()}`);
    }

    // 2. Akşam Yemekleri Durumu
    const dinnerItem = incList.find((it) => /akşam\s+yeme[gğ]i/i.test(it));
    if (dinnerItem) {
      const countMatch = dinnerItem.match(/(\d+)\s*akşam\s+yeme[gğ]i/i);
      features.push(countMatch ? `🍱 ${countMatch[0]} Dahil` : "🍱 Akşam Yemekleri Dahil");
    } else if (/akşam\s+yeme[gğ]i\s+dahil/i.test(fullContext)) {
      features.push("🍱 Akşam Yemekleri Dahil");
    }

    // 3. Müze / Ören Yeri / Girişler
    const museumItem = incList.find((it) => /müze|ören|kale|giriş\s+ücret/i.test(it));
    if (museumItem) {
      features.push("🎫 Tüm Kale ve Müze Girişleri Dahil");
    } else if (/giriş\s+ücretleri\s+dahil/i.test(fullContext)) {
      features.push("🎫 Tüm Giriş Ücretleri Dahil");
    }

    // 4. Konaklama Kalitesi
    const hotelItem = incList.find((it) => /otel|konaklama|cruise/i.test(it));
    if (hotelItem) {
      if (/5\s*\*|5\s*yıldız/i.test(hotelItem)) {
        features.push("🏨 5 Yıldızlı Otellerde Konaklama");
      } else if (/cruise/i.test(hotelItem)) {
        features.push("🚢 Cruise & Seçkin Oteller");
      } else {
        features.push("🏨 Seçkin Otellerde Konaklama");
      }
    }

    // 5. Ekstra Tur Durumu
    if (/ekstra\s+tur\s+(?:ücreti\s+)?yok|tüm\s+turlar\s+dahil/i.test(fullContext)) {
      features.push("✅ Ekstra Tur Ödemesi Yok");
    }

    // 6. Rehberlik Hizmeti
    const guideItem = incList.find((it) => /rehberlik/i.test(it));
    if (guideItem) {
      features.push("🧭 Profesyonel Türkçe Rehberlik");
    }

    // Ek Güvence / Yedek Maddeler
    if (features.length < 4 && incList.some((it) => /sigorta/i.test(it))) {
      features.push("🛡️ Kapsamlı Seyahat Sigortası Dahil");
    }
    if (features.length < 4 && incList.some((it) => /transfer/i.test(it))) {
      features.push("🚐 Özel Klimalı Araçlarla Transfer");
    }

    // Kesinlikle havayolu (THY, uçak vb.) içermeyen temiz liste
    return features.filter((f) => !/hava\s*yol|thy|uçak\s+bileti/i.test(f)).slice(0, 6);
  };

  // =========================================================================
  // MOD B: GOOGLE GEMINI YAPAY ZEKA MOTORU (OPSİYONEL & KESİNTİ GÜVENCELİ)
  // =========================================================================
  // GOOGLE GEMINI DİNAMİK MODEL ÇAĞIRICI (KESİNTİSİZ & OTOMATİK YEDEKLEME)
  const callGeminiAi = async (apiKey: string, prompt: string): Promise<string> => {
    const cleanKey = apiKey.trim();
    if (!cleanKey) throw new Error("Lütfen bir Google Gemini API anahtarı giriniz.");

    const candidateModels = Array.from(
      new Set([
        activeAiModel,
        "gemini-1.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-2.0-flash-exp"
      ].filter(Boolean))
    );

    let lastError = "";

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{
                text: "Sen Burak Turizm için sadece HTML biçimlendirme yapan bir asistansın. ASLA düşünce süreci, kural analizi, 'Input text:', 'Task:', 'Constraint', açıklama veya yorum yazma. Yanıtın SADECE ve DOĞRUDAN biçimlendirilmiş metnin kendisi olmalıdır."
              }]
            },
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.0
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0];
          if (candidate?.content?.parts) {
            // Sadece düşünce (thought) OLMAYAN gerçek içerik parçalarını birleştir
            const nonThoughtParts = candidate.content.parts.filter((p: any) => !p.thought);
            const text = nonThoughtParts.map((p: any) => p.text || "").join("").trim();
            if (text) {
              if (activeAiModel !== model) {
                setActiveAiModel(model);
                if (typeof window !== "undefined") {
                  localStorage.setItem("bt_gemini_active_model", model);
                }
              }
              return text;
            }
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          const msg = errData.error?.message || response.statusText;
          lastError = `${model}: ${msg}`;
          console.warn(`Gemini (${model}) başarısız, sonraki modele geçiliyor:`, msg);
        }
      } catch (e: any) {
        lastError = `${model}: ${e.message}`;
        console.warn(`Gemini (${model}) bağlantı hatası, sonraki modele geçiliyor:`, e.message);
      }
    }

    throw new Error(lastError || "Gemini modellerinin hiçbiri yanıt vermedi.");
  };

  // YAPAY ZEKA ÇIKTISINI TEMİZLEME VE DÜŞÜNCE ARTIKLARINI ELİMİNE ETME
  const sanitizeAiTextOutput = (aiText: string, originalText: string, destinations: string[] = []): string => {
    if (!aiText) return autoBoldDayContent(originalText, destinations);

    let cleaned = aiText.trim();
    // Markdown code block kalıntılarını kaldır
    cleaned = cleaned.replace(/^```(?:html)?s*/i, "").replace(/s*```$/i, "").trim();

    // Modelin iç düşünce / scratchpad döküntüsü içerip içermediğini denetle
    const hasThoughtArtifacts =
      /(\bInput text:|\bTask:|\bConstraint\b|Refining the|Self-Correction|Final (?:string|result|check):|NLP tasks)/i.test(cleaned);

    if (hasThoughtArtifacts) {
      // "Final string:" veya "Result:" sonrası kısmı bulmaya çalış
      const finalMatch = cleaned.match(/(?:Final string|Final Result|Result)\s*:\s*\n*([\s\S]+)$/i);
      if (finalMatch && finalMatch[1] && finalMatch[1].trim()) {
        cleaned = finalMatch[1].trim();
      } else {
        // Eğer düşünce metni ayıklanamıyorsa, bozuk AI çıktısını reddet ve güvenli yerel motoru çalıştır!
        console.warn("AI çıktısında düşünce kalıntıları tespit edildi, güvenli yerel motor devreye alındı.");
        return autoBoldDayContent(originalText, destinations);
      }
    }

    // Uzunluk kontrolü: AI çıktısı orijinal metnin 2 katından uzunsa veya yarısından kısaysa bozuktur
    if (cleaned.length > originalText.length * 2.2 || cleaned.length < originalText.length * 0.4) {
      console.warn("AI çıktısı anormal uzunlukta, güvenli yerel motor devreye alındı.");
      return autoBoldDayContent(originalText, destinations);
    }

    return cleaned;
  };

  // METİN İÇERİSİNDE SEÇİLİ YAZIYI KALIN (BOLD) YAPMA / KALDIRMA
  const toggleBoldSelection = (textareaId: string, dayId: number, currentVal: string) => {
    const el = document.getElementById(textareaId) as HTMLTextAreaElement | null;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start !== end) {
      const selected = currentVal.substring(start, end);
      let rep = '';
      if (selected.startsWith('<b>') && selected.endsWith('</b>')) {
        rep = selected.substring(3, selected.length - 4);
      } else {
        rep = `<b>${selected}</b>`;
      }
      const updated = currentVal.substring(0, start) + rep + currentVal.substring(end);
      updateDay(dayId, 'content', updated);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start, start + rep.length);
      }, 50);
    } else {
      const rep = '<b>kalın yazı</b>';
      const updated = currentVal.substring(0, start) + rep + currentVal.substring(end);
      updateDay(dayId, 'content', updated);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + 3, start + 3 + 10);
      }, 50);
    }
  };

  const parseAndApplyTourText = (rawText: string) => {
    if (!rawText || !rawText.trim()) {
      alert("Lütfen önce bir PDF yükleyin veya metin yapıştırın!");
      return;
    }

    try {
      const cleanText = rawText.replace(/\r\n/g, "\n");

      // 1. DAHİL VE HARİÇ HİZMETLERİ BUL
      let daysSection = cleanText;
      let incItems: string[] = [];
      let excItems: string[] = [];

      const incMatch = cleanText.search(/(?:<b[^>]*>)?\s*(?:Fiyata\s+)?Dahil\s+Olan\s+Hizmetler/i);
      const excMatch = cleanText.search(/(?:<b[^>]*>)?\s*(?:Fiyata\s+)?Dahil\s+Olmayan\s+Hizmetler|Hariç\s+Hizmetler/i);

      if (incMatch !== -1) {
        daysSection = cleanText.substring(0, incMatch).replace(/<b[^>]*>\s*$/gi, "").trim();
        const incEnd = excMatch !== -1 && excMatch > incMatch ? excMatch : cleanText.length;
        const incText = cleanText.substring(incMatch, incEnd);
        incItems = incText
          .split("\n")
          .map((l) => l.replace(/^[•\*\-\–\—\s]+/, "").trim())
          .filter((l) => l.length > 5 && !/Dahil\s+Olan\s+Hizmetler/i.test(l));
      }

      if (excMatch !== -1) {
        const excText = cleanText.substring(excMatch);
        excItems = excText
          .split("\n")
          .map((l) => l.replace(/^[•\*\-\–\—\s]+/, "").trim())
          .filter((l) => l.length > 5 && !/Dahil\s+Olmayan\s+Hizmetler|Hariç\s+Hizmetler/i.test(l));
      }

      // 2. BAŞLIK VE ALT BAŞLIK TAHMİNİ (ÇOK SATIRLI BAŞLIKLARI KUSURSUZ BİRLEŞTİRME)
      const lines = daysSection
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !/BURAK\s*TUR|0850|www\.buraktur|Faks:|İzmir:|İstanbul:/i.test(l));

      let detectedTitle = hero.title;
      let detectedSubtitle = hero.subtitle;

      // "1. Gün" veya "Buluşma" satırını bul
      const firstDayIdx = lines.findIndex((l) => /(?:1\.\s*G[üu]n|Bulu[şs]ma)/i.test(l));
      if (firstDayIdx > 0) {
        // 1. Gün'e kadar olan satırları al
        const preLines = lines.slice(0, firstDayIdx);

        // "TURU", "TUR", "GEZİSİ" içeren son başlık satırını bul
        let turuLineIdx = -1;
        for (let i = 0; i < preLines.length; i++) {
          if (/\b(?:TURU|TUR|GEZİSİ|PROGRAMI)\b/i.test(preLines[i])) {
            turuLineIdx = i;
            break;
          }
        }

        let titleParts: string[] = [];
        let subtitleParts: string[] = [];

        if (turuLineIdx !== -1) {
          // "TURU" satırına kadar olan tüm satırları (örn: "VİETNAM, KAMBOÇYA, LAOS," + "TAYLAND TURU") başlık yap
          titleParts = preLines.slice(0, turuLineIdx + 1);
          subtitleParts = preLines.slice(turuLineIdx + 1);
        } else {
          // Eğer "TURU" kelimesi yoksa büyük harf kontrolü
          const isUpper = (s: string) => s.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ]/g, "").length > 3 && s === s.toUpperCase();
          let lastUpper = -1;
          for (let i = 0; i < preLines.length; i++) {
            if (isUpper(preLines[i])) lastUpper = i;
            else break;
          }
          if (lastUpper !== -1) {
            titleParts = preLines.slice(0, lastUpper + 1);
            subtitleParts = preLines.slice(lastUpper + 1);
          } else if (preLines.length > 1) {
            titleParts = [preLines[0]];
            subtitleParts = preLines.slice(1);
          } else {
            titleParts = preLines;
          }
        }

        if (titleParts.length > 0) {
          detectedTitle = titleParts
            .join(" ")
            .replace(/<[^>]+>/g, "")
            .replace(/\s{2,}/g, " ")
            .trim();
        }

        if (subtitleParts.length > 0) {
          detectedSubtitle = subtitleParts
            .join(", ")
            .replace(/<[^>]+>/g, "")
            .replace(/\s{2,}/g, " ")
            .replace(/,\s*,/g, ",")
            .trim();
        }
      }

      // 3. GÜNLERİ AYRIŞTIR (Bold taglerini ve farklı formatları kusursuz yakalama)
      const dayRegex = /(?:^|\n)(?:<b[^>]*>)?\s*(?:(\d+)\.\s*G[üu]n|Bulu[şs]ma)(?:[^\n:]*?)?[:\-–—]\s*([^\n]+)/gi;
      const matches: { full: string; dayNum?: string; routeStr: string; index: number; length: number }[] = [];
      let match;

      while ((match = dayRegex.exec(daysSection)) !== null) {
        matches.push({
          full: match[0],
          dayNum: match[1],
          routeStr: match[2].replace(/<[^>]+>/g, '').trim(),
          index: match.index,
          length: match[0].length,
        });
      }

      const parsedDays: DayData[] = [];

      matches.forEach((m, i) => {
        const start = m.index + m.length;
        const end = i < matches.length - 1 ? matches[i + 1].index : daysSection.length;
        let dayRaw = daysSection.substring(start, end).trim();

        // Footer / Acente adreslerini temizle
        dayRaw = dayRaw
          .split("\n")
          .filter((l) => !/BURAK\s*TUR|0850\s*304|www\.buraktur|Faks:|Ergenekon\s*Mah|Akdeniz\s*Mah/i.test(l))
          .join("\n")
          .trim();

        // Sonda kalan açık <b> taglerini temizle ve etiket dengesini sağla
        dayRaw = dayRaw.replace(/<b[^>]*>\s*$/gi, "").trim();
        const openBCount = (dayRaw.match(/<b[^>]*>/gi) || []).length;
        const closeBCount = (dayRaw.match(/<\/b>/gi) || []).length;
        if (openBCount > closeBCount) {
          dayRaw += "</b>".repeat(openBCount - closeBCount);
        }

        // Önemli Notları Ayıkla (Bold taglerini koruyarak veya temizleyerek)
        const notes: string[] = [];
        dayRaw = dayRaw
          .replace(/(?:^|\n)\s*(?:<b>|<strong[^>]*>)?(?:Önemli|Not|Dikkat)\s*:\s*(?:<\/b>|<\/strong>)?\s*([^\n]+)/gi, (_, noteText) => {
            notes.push(noteText.replace(/<[^>]+>/g, "").trim());
            return "";
          })
          .trim();

        // Rota duraklarını belirle (HTML taglerini rotadan temizle)
        const cleanRouteStr = m.routeStr.replace(/<[^>]+>/g, "").trim();
        let stops = cleanRouteStr
          .split(/\s*[\u2013\u2014\-–—>]+\s*/)
          .map((s) => s.trim())
          .filter(Boolean);

        if (stops.length === 0) stops = [cleanRouteStr];

        // İkon tahmin motoru
        const lowerContent = (cleanRouteStr + " " + dayRaw).toLowerCase();
        const routes: RouteNode[] = stops.map((stop, sIdx) => {
          let icon = "bus.png";
          if (sIdx < stops.length - 1) {
            if (/uçak|uçuş|havalimanı|sefer|uçuyoruz|thy|tk\d|ek\d/i.test(lowerContent)) {
              icon = "airplane.png";
            } else if (/cruise|gemi|tekne|körfez|kano|sampan|feribot/i.test(lowerContent)) {
              icon = "ship.png";
            } else if (/tren|demiryolu|yht|station/i.test(lowerContent)) {
              icon = "train.png";
            }
          } else {
            icon = "";
          }
          return {
            id: generateId(),
            location: stop,
            iconToNext: icon,
          };
        });

        parsedDays.push({
          id: i + 1,
          type: m.dayNum ? "day" : "meeting",
          dayTitle: m.dayNum ? `${m.dayNum}. Gün` : "Buluşma",
          routes: routes,
          content: dayRaw, // Bold <b>...</b> tagleri içeride korunmuş olarak kalır!
          imageUrl: "",
          notes: notes,
        });
      });

      // EĞER HİÇ GÜN BULUNAMADIYSA BİLGİLENDİR
      if (parsedDays.length === 0) {
        alert(
          "Gün başlıkları (örn: '1. Gün: İstanbul – Hanoi') algılanamadı. Lütfen metnin '1. Gün' veya 'Buluşma' içerdiğinden emin olun."
        );
        return;
      }

      // BAŞARIYLA UYGULA
      // Hero maddelerini otomatik çıkar (Havayolu hariç tutularak!)
      const autoFeatures = extractHeroFeatures(incItems, daysSection, detectedTitle);

      setHero({
        ...hero,
        title: detectedTitle,
        subtitle: detectedSubtitle,
        duration: `${parsedDays.length} Günlük Program`,
        features: autoFeatures.length > 0 ? autoFeatures : hero.features,
      });
      setDays(parsedDays);
      if (incItems.length > 0) {
        setIncludedServices(incItems.map(item => {
          let clean = item.replace(/<b[^>]*>\s*$/gi, "").trim();
          const o = (clean.match(/<b[^>]*>/gi) || []).length;
          const c = (clean.match(/<\/b>/gi) || []).length;
          if (o > c) clean += "</b>".repeat(o - c);
          return clean;
        }));
      }
      if (excItems.length > 0) {
        setExcludedServices(excItems.map(item => {
          let clean = item.replace(/<b[^>]*>\s*$/gi, "").trim();
          const o = (clean.match(/<b[^>]*>/gi) || []).length;
          const c = (clean.match(/<\/b>/gi) || []).length;
          if (o > c) clean += "</b>".repeat(o - c);
          return clean;
        }));
      }

      setIsImportModalOpen(false);
      setActiveTab("program");
      setImportMessage(`✓ Harika! "${detectedTitle}" başlıklı ${parsedDays.length} Günlük Tur, kalın (bold) metinleriyle başarıyla aktarıldı.`);
      setTimeout(() => setImportMessage(null), 5000);
    } catch (err: any) {
      alert("Ayrıştırma sırasında bir hata oluştu: " + err.message);
    }
  };

  // WORD (.DOCX) VE PDF DOSYALARINI OKUMA FONKSİYONU
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isWord = file.name.endsWith(".docx") || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");

    if (isWord) {
      setIsPdfLoading(true);
      try {
        // Mammoth.js kütüphanesini yükle
        // @ts-ignore
        if (!window.mammoth) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "mammoth.browser.min.js";
            script.onload = resolve;
            script.onerror = () => {
              const cdnScript = document.createElement("script");
              cdnScript.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js";
              cdnScript.onload = resolve;
              cdnScript.onerror = reject;
              document.head.appendChild(cdnScript);
            };
            document.head.appendChild(script);
          });
        }

        const arrayBuffer = await file.arrayBuffer();
        // @ts-ignore
        const result = await window.mammoth.convertToHtml({ arrayBuffer });
        const html = result.value;

        // HTML etiketlerini bizim sisteme uyarla (strong/b -> <b>, p/div/li -> \n)
        let str = html.replace(/<(?:strong|b)(?:\s+[^>]*)?>([\s\S]*?)<\/(?:strong|b)>/gi, "___B_START___$1___B_END___");
        str = str.replace(/<span[^>]*style="[^"]*font-weight:\s*(?:bold|[6-9]00)[^"]*"[^>]*>([\s\S]*?)<\/span>/gi, "___B_START___$1___B_END___");
        str = str.replace(/<br\s*\/?>/gi, "\n");
        str = str.replace(/<\/(?:p|div|li|h[1-6]|tr)>/gi, "\n");
        str = str.replace(/<[^>]+>/g, "");
        str = str.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"");
        str = str.replace(/___B_START___/g, "<b>").replace(/___B_END___/g, "</b>");
        const clean = str.replace(/\n{3,}/g, "\n\n").trim();
        setImportText(clean);
      } catch (err: any) {
        alert("Word dosyası okunamadı: " + err.message);
      } finally {
        setIsPdfLoading(false);
      }
    } else if (isPdf) {
      setIsPdfLoading(true);
      try {
        // PDF.js'i CDN üzerinden dinamik yükle
        // @ts-ignore
        if (!window.pdfjsLib) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
          // @ts-ignore
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }

        const arrayBuffer = await file.arrayBuffer();
        // @ts-ignore
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extracted = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          // Font objelerini yüklemek için getOperatorList çağırılır
          await page.getOperatorList();
          const textContent = await page.getTextContent();
          let lastY: number | null = null;
          let pageText = "";
          let isCurrentlyBold = false;

          for (const item of textContent.items) {
            if ("str" in item && item.str) {
              let isItemBold = false;
              if (page.commonObjs.has(item.fontName)) {
                const fontObj = page.commonObjs.get(item.fontName);
                if (fontObj) {
                  isItemBold = Boolean(
                    fontObj.bold ||
                    fontObj.black ||
                    (fontObj.name && /bold|black|heavy|w[7-9]/i.test(fontObj.name)) ||
                    (fontObj.loadedName && /bold|black|heavy|w[7-9]/i.test(fontObj.loadedName))
                  );
                }
              }

              const styleObj = textContent.styles[item.fontName];
              if (styleObj && styleObj.fontFamily && /bold|black/i.test(styleObj.fontFamily)) {
                isItemBold = true;
              }

              // Satır geçişi kontrolü
              if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
                if (isCurrentlyBold) {
                  pageText += "</b>";
                  isCurrentlyBold = false;
                }
                pageText += "\n";
              }

              const str = item.str;
              const isWhitespaceOnly = /^\s+$/.test(str);

              // Boşluk olmayan karakterlerde bold durumunu güncelle
              if (isItemBold && !isCurrentlyBold && !isWhitespaceOnly) {
                pageText += "<b>";
                isCurrentlyBold = true;
              } else if (!isItemBold && isCurrentlyBold && !isWhitespaceOnly) {
                pageText += "</b>";
                isCurrentlyBold = false;
              }

              pageText += str;
              lastY = item.transform[5];
            }
          }
          if (isCurrentlyBold) {
            pageText += "</b>";
          }
          extracted += pageText + "\n\n";
        }

        setImportText(extracted);
      } catch (err: any) {
        alert("PDF okunamadı: " + err.message + ". Metni kopyalayıp aşağıdaki kutucuğa yapıştırabilirsiniz.");
      } finally {
        setIsPdfLoading(false);
      }
    } else {
      // Düz metin dosyası ise
      const reader = new FileReader();
      reader.onload = (event) => {
        setImportText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  // KOPYALA-YAPIŞTIRDA BOLD BİLGİSİNİ KORUMA HANDLER'I
  const handleTextareaPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const html = e.clipboardData.getData("text/html");
    if (html && (html.includes("<b") || html.includes("<strong") || html.includes("font-weight"))) {
      e.preventDefault();
      let str = html.replace(/<(?:strong|b)(?:\s+[^>]*)?>([\s\S]*?)<\/(?:strong|b)>/gi, "___B_START___$1___B_END___");
      str = str.replace(/<span[^>]*style="[^"]*font-weight:\s*(?:bold|[6-9]00)[^"]*"[^>]*>([\s\S]*?)<\/span>/gi, "___B_START___$1___B_END___");
      str = str.replace(/<br\s*\/?>/gi, "\n");
      str = str.replace(/<\/(?:p|div|li|h[1-6]|tr)>/gi, "\n");
      str = str.replace(/<[^>]+>/g, "");
      str = str.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"");
      str = str.replace(/___B_START___/g, "<b>").replace(/___B_END___/g, "</b>");
      const clean = str.replace(/\n{3,}/g, "\n\n").trim();
      setImportText(clean);
    }
  };

  // DEMO METNİ YÜKLEME (VİETNAM TURU - TAM BAŞLIK VE BOLD ETİKETLERLE)
  const loadDemoVietnamTour = () => {
    const demo = `BURAK TUR
VİETNAM, KAMBOÇYA, LAOS, 
TAYLAND TURU
Hanoi, Ha Long Bay, Ho Chi Minh (Saigon), Siem Reap, Luang Prabang, Bangkok

1. Gün 3 Aralık 2026 Perşembe: İstanbul – Hanoi
İstanbul Yeni Havalimanı Dış Hatlar Terminali Giden Yolcu Salonu <b>"THY"</b> bankosunda <b>00.01’de</b> buluşuyoruz. Check-in, pasaport ve gümrük işlemleri sonrası THY'nin <b>TK0252</b> seferi ile <b>18.05’te</b> Vietnam'ın <b>Hanoi</b> şehrine uçuyoruz (9sa 30dk).

2. Gün 4 Aralık 2026 Cuma: Hanoi
Varış: <b>07.05</b>. Varışı müteakip yapılacak şehir turumuzda <b>Ho Chi Minh Mozolesi</b>, <b>Başkanlık Sarayı</b>, <b>Edebiyat Tapınağı</b>, eskiden bir hapishane olan <b>Hoa Lo</b>, <b>Eski Mahalle</b>, <b>Hanoi Tren Sokağı</b>, <b>Kral Ly Thai To Heykeli</b>, <b>Ngoc Son Tapınağı</b> ve <b>Hoan Kiem Gölü</b> göreceğimiz yerler arasındadır. Serbest zamanın ardından akşam yemeği sonrası konaklama otelimizde.

3. Gün 5 Aralık 2026 Cumartesi: Hanoi – Ha Long Bay - Cruise
Otelde alacağımız kahvaltının ardından UNESCO Dünya Mirası Listesi'nde yer alan ve dünyanın en etkileyici doğal oluşumlarından biri kabul edilen <b>Ha Long Bay'e</b> hareket ediyoruz (155 km). Varışımızın ardından cruise gemimize geçerek unutulmaz körfez yolculuğumuza başlıyoruz. Gemide alacağımız öğle yemeği eşliğinde binlerce kireçtaşı adacığı arasında eşsiz manzaraların tadını çıkarıyoruz. Programımız kapsamında mağara ziyaretleri, bambu teknesi veya kano aktiviteleri ve körfezin saklı koylarını keşfetme imkânı buluyoruz. Akşam yemeği sonrası konaklama cruise gemimizde.

4. Gün 6 Aralık 2026 Pazar: Ha Long Bay - Hanoi – Ho Chi Minh (Saigon)
Cruise gemisinde alacağımız kahvaltının ardından <b>Hanoi Havalimanı’na</b> hareket ediyoruz (180 km). Yerel havayollarıyla <b>Saigon’a</b> hareket ediyoruz. Akşam yemeği sonrası konaklama otelimizde.

5. Gün 7 Aralık 2026 Pazartesi: Ho Chi Minh (Saigon)
Otelde alacağımız kahvaltının ardından <b>Saigon’un</b> karmaşasını geride bırakıp hayatın su üzerinde geçtiği <b>Mekong Deltası</b> kasabası olan <b>My Tho'ya</b> hareket ediyoruz (70 km). Mekong Nehri’ndeki yaşamı göreceğimiz tekne turu sırasında Hindistan cevizinden ürünler üreten bir ailenin atölyesini ziyaret etmek için adadaki bir köye çıkıyoruz.

6. Gün 8 Aralık 2026 Salı: Ho Chi Minh (Saigon) – Siem Reap (Kamboçya)
Otelde alacağımız kahvaltının ardından efsanevi tünelleri ziyaret etmek için <b>Cu Chi Bölgesi’nin</b> yemyeşil kırsalına hareket ediyoruz (45 km). Cu Chi Tünelleri’ni ziyaretin ardından dönüş yolunda <b>Bağımsızlık Sarayı’nı</b> ve <b>Savaş Müzesi’ni</b> ziyaret ediyoruz. Yerel havayolu ile saat <b>19.30’da</b> <b>Siem Reap</b> şehrine uçuyoruz.
Önemli: Bugün uçak saatinden dolayı akşam yemeği yerine geç öğle yemeği alınacaktır.

7. Gün 9 Aralık 2026 Çarşamba: Siem Reap – Angkor Thom – Ta Prohm – Angkor Wat – Siem Reap
Otelde alacağımız kahvaltının ardından <b>Angkor Thom</b>, <b>Bayon Tapınağı</b>, <b>Ta Prohm Tapınağı</b> ve efsanevi <b>Angkor Wat</b> gezisi yapıyoruz. Akşam yemeği ve konaklama otelimizde.

8. Gün 10 Aralık 2026 Perşembe: Siem Reap (Kamboçya) – Luang Prabang (Laos)
<b>Tonle Sap Gölü</b> üzerinde geleneksel ahşap tekne turu yapıyoruz. Gezimizin ardından Siem Reap Havalimanı’ndan saat 17.05’te Laos’un <b>Luang Prabang</b> şehrine uçuyoruz.

9. Gün 11 Aralık 2026 Cuma: Luang Prabang – Bangkok
<b>Sabah Pazarı</b> ve <b>Kraliyet Sarayı</b> gezisi sonrası saat 16.05’te Tayland’ın başkenti <b>Bangkok’a</b> uçuyoruz (1sa 30dk).

10. Gün 12 Aralık 2026 Cumartesi: Bangkok
Erken saatte <b>Maeklong Demiryolu Pazarı</b> ve 150 yıllık <b>Yüzen Çarşı</b> turu yapıyoruz. Akşam yemeği ve konaklama otelimizde.

11. Gün 13 Aralık 2026 Pazar: Bangkok – İstanbul
Otelden çıkışımızın ardından <b>Bangkok Havalimanı’na</b> hareket ediyoruz. THY’nin <b>TK0065</b> seferi ile 10.20’de İstanbul’a uçuyoruz. Varış: 16.45.

Fiyata Dahil Olan Hizmetler
• THY ile İstanbul – Hanoi / Bangkok – İstanbul gidiş-dönüş ekonomi sınıfı uçak bileti ve vergileri
• Yerel Havayolları ile tüm ara uçuş biletleri ve vergileri
• 9 gece 5* kalitesinde otellerde ve 1 gece cruise gemisinde konaklama
• 8 kahvaltı, 8 akşam yemeği ve 1 geç öğle yemeği
• Programda adı geçen tüm aktiviteler, transferler ve giriş ücretleri
• Türkçe rehberlik hizmeti
• Seyahat sigortası
• Tüm yurt dışı yerel vergiler

Fiyata Dahil Olmayan Hizmetler
• Vietnam vizesi ve hizmet bedeli - E-VİZE (100$, yeşil pasaport sahipleri muaftır)
• Kamboçya vizesi - KAPIDA VİZE (35$, yeşil pasaport sahipleri muaftır)
• Laos vizesi - KAPIDA VİZE (45$, yeşil pasaport sahipleri de tabidir)
• Öğle yemekleri
• Yurt dışı çıkış harcı
• Bahşişler ve otel ekstraları`;

    setImportText(demo);
  };

  // ==========================================
  // HTML ÜRETİCİLER
  // ==========================================

  // TEK BİR GÜN / BULUŞMA KARTININ HTML'İ
  const generateSingleCardHTML = (day: DayData) => {
    const isMeeting = day.type === "meeting";
    const badgeClass = isMeeting ? "bt-day-badge bulusma" : "bt-day-badge";
    const cardClass = isMeeting ? "bt-tour-card bt-meeting-card" : "bt-tour-card";

    const routeHTML = day.routes
      .map((route, index) => {
        let html = `<span class="stop">${route.location}</span>`;
        if (index < day.routes.length - 1 && route.iconToNext) {
          html += `<img alt="icon" src="${ICON_BASE_URL}${route.iconToNext}" />`;
        }
        return html;
      })
      .join("");

    const notesHTML =
      day.notes && day.notes.length > 0
        ? day.notes
            .map(
              (note) =>
                `    <div class="bt-day-note"><strong>Önemli:</strong> ${note}</div>`
            )
            .join("\n") + "\n"
        : "";

    return `${STYLE_BLOCK}<section class="bt-tourday">
<div class="bt-tour-container">
  <div class="bt-day-item">
    <div class="${cardClass}">
      <div class="bt-tour-header">
        <div class="${badgeClass}">${day.dayTitle}</div>
        ${
          day.routes.length > 0
            ? `<div class="bt-tour-route">${routeHTML}</div>`
            : ""
        }
      </div>
      <div class="bt-tour-text">
        <p>${day.content.replace(/\n/g, "<br />")}</p>
      </div>
    </div>
    ${day.imageUrl ? `<div class="bt-tour-image"><img alt="Tur görseli" src="${day.imageUrl}" /></div>\n` : ""}${notesHTML}  </div>
</div>
</section>`;
  };

  // SADECE HERO KARTININ HTML'İ
  const generateHeroOnlyHTML = (isPreview = false) => {
    const hiddenAttr = isPreview ? "" : 'hidden=""';
    const featuresHTML = hero.features
      .map(
        (feat) => `<div class="bt-tour-item"><div class="bt-tour-item-text">${feat}</div></div>`
      )
      .join("\n");

    return `${STYLE_BLOCK}<section class="bt-tourday">
<div class="bt-tour-main-container">
  <div class="bt-tour-hero-card">
    <div class="bt-tour-res-section" data-bt-brand-only="" ${hiddenAttr}>
      <p>Rezervasyon ve detaylı bilgi için bize ulaşabilirsiniz.</p>
      <div class="bt-tour-btn-group">
        <a class="bt-tour-btn bt-tour-btn-wa" href="https://wa.me/+908503040404"><span>WhatsApp</span></a>
        <a class="bt-tour-btn bt-tour-btn-cc" href="tel:08503040404"><span>📞 Çağrı Merkezi</span></a>
      </div>
    </div>
    <div class="bt-tour-content">
      <span class="bt-tour-tag">${hero.duration}</span>
      <h1 class="bt-tour-title">${hero.title}</h1>
      <p class="bt-tour-subtitle">${hero.subtitle}</p>
      <div class="bt-tour-divider">&nbsp;</div>
      <div class="bt-tour-grid">
        ${featuresHTML}
        <div class="bt-tour-item" data-bt-brand-only="" ${hiddenAttr}>
          <div class="bt-tour-item-text">💎 Burak Tur Kalitesiyle</div>
        </div>
      </div>
      <div class="bt-tour-footer-meta" data-bt-brand-only="" ${hiddenAttr}>
        <a class="bt-tour-footer-link" href="${hero.footerUrl}">${hero.footerText}</a>
      </div>
    </div>
  </div>
</div>
</section>
<!-- DOMAIN KONTROL SCRIPT -->
<script>
(function () {
    var currentDomain = window.location.hostname.toLowerCase().replace(/\\.$/, '');
    var allowedDomains = ['buraktur.com', 'www.buraktur.com'];
    var isBurakTur = allowedDomains.indexOf(currentDomain) !== -1;
    if (isBurakTur) {
        var brandElements = document.querySelectorAll('[data-bt-brand-only]');
        brandElements.forEach(function (element) {
            element.removeAttribute('hidden');
        });
    }
})();
</script>`;
  };

  // 1. TUR PROGRAMI HTML'İ (TÜM PROGRAM)
  const generateProgramHTML = (isPreview = false) => {
    const hiddenAttr = isPreview ? "" : 'hidden=""';

    // HERO KARTI
    const featuresHTML = hero.features
      .map(
        (feat) => `<div class="bt-tour-item"><div class="bt-tour-item-text">${feat}</div></div>`
      )
      .join("\n");

    const heroHTML = `<section class="bt-tourday">
<div class="bt-tour-main-container">
  <div class="bt-tour-hero-card">
    <div class="bt-tour-res-section" data-bt-brand-only="" ${hiddenAttr}>
      <p>Rezervasyon ve detaylı bilgi için bize ulaşabilirsiniz.</p>
      <div class="bt-tour-btn-group">
        <a class="bt-tour-btn bt-tour-btn-wa" href="https://wa.me/+908503040404"><span>WhatsApp</span></a>
        <a class="bt-tour-btn bt-tour-btn-cc" href="tel:08503040404"><span>📞 Çağrı Merkezi</span></a>
      </div>
    </div>
    <div class="bt-tour-content">
      <span class="bt-tour-tag">${hero.duration}</span>
      <h1 class="bt-tour-title">${hero.title}</h1>
      <p class="bt-tour-subtitle">${hero.subtitle}</p>
      <div class="bt-tour-divider">&nbsp;</div>
      <div class="bt-tour-grid">
        ${featuresHTML}
        <div class="bt-tour-item" data-bt-brand-only="" ${hiddenAttr}>
          <div class="bt-tour-item-text">💎 Burak Tur Kalitesiyle</div>
        </div>
      </div>
      <div class="bt-tour-footer-meta" data-bt-brand-only="" ${hiddenAttr}>
        <a class="bt-tour-footer-link" href="${hero.footerUrl}">${hero.footerText}</a>
      </div>
    </div>
  </div>\n`;

    // GÜNLER VE BULUŞMA
    let daysHTML = "";
    days.forEach((day) => {
      const isMeeting = day.type === "meeting";
      const badgeClass = isMeeting ? "bt-day-badge bulusma" : "bt-day-badge";
      const cardClass = isMeeting ? "bt-tour-card bt-meeting-card" : "bt-tour-card";

      const routeHTML = day.routes
        .map((route, index) => {
          let html = `<span class="stop">${route.location}</span>`;
          if (index < day.routes.length - 1 && route.iconToNext) {
            html += `<img alt="icon" src="${ICON_BASE_URL}${route.iconToNext}" />`;
          }
          return html;
        })
        .join("");

      const notesHTML =
        day.notes && day.notes.length > 0
          ? day.notes
              .map(
                (note) =>
                  `    <div class="bt-day-note"><strong>Önemli:</strong> ${note}</div>`
              )
              .join("\n") + "\n"
          : "";

      daysHTML += `  <div class="bt-day-item">
    <div class="${cardClass}">
      <div class="bt-tour-header">
        <div class="${badgeClass}">${day.dayTitle}</div>
        ${
          day.routes.length > 0
            ? `<div class="bt-tour-route">${routeHTML}</div>`
            : ""
        }
      </div>
      <div class="bt-tour-text">
        <p>${day.content.replace(/\n/g, "<br />")}</p>
      </div>
    </div>
    ${day.imageUrl ? `<div class="bt-tour-image"><img alt="Tur görseli" src="${day.imageUrl}" /></div>\n` : ""}${notesHTML}  </div>\n`;
    });

    const footerScript = `</div>
</section>
<!-- DOMAIN KONTROL SCRIPT -->
<script>
(function () {
    var currentDomain = window.location.hostname.toLowerCase().replace(/\\.$/, '');
    var allowedDomains = ['buraktur.com', 'www.buraktur.com'];
    var isBurakTur = allowedDomains.indexOf(currentDomain) !== -1;
    if (isBurakTur) {
        var brandElements = document.querySelectorAll('[data-bt-brand-only]');
        brandElements.forEach(function (element) {
            element.removeAttribute('hidden');
        });
    }
})();
</script>\n`;

    return STYLE_BLOCK + heroHTML + daysHTML + footerScript;
  };

  // 2. DAHİL OLAN HİZMETLER HTML'İ
  const generateIncludedHTML = () => {
    const itemsHTML = includedServices
      .map(
        (item, idx) =>
          `\t<li style="background: #ffffff !important; margin-bottom: ${
            idx === includedServices.length - 1 ? "0" : "8px"
          } !important; padding: 10px 18px 10px 44px !important; border-radius: 12px !important; border: 1px solid #f1f5f9 !important; font-size: 15px !important; line-height: 1.4 !important; color: #0f172a !important; font-weight: 400 !important; box-shadow: 0 2px 4px rgba(15, 23, 42, 0.02) !important; position: relative !important; text-align: left !important;"><span style="position: absolute !important; left: 16px !important; top: 10px !important; color: #22c55e !important; font-weight: 800 !important; font-size: 16px !important; line-height: 1 !important;">✓</span> ${item}</li>`
      )
      .join("\n");

    const titleHTML = includedTitle && includedTitle.trim()
      ? `<h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 16px; text-align: left; font-family: 'Outfit', sans-serif !important;">${includedTitle.trim()}</h2>\n`
      : "";

    return `${titleHTML}<ul style="list-style: none !important; padding: 0 !important; margin: 0 auto !important; max-width: 800px !important; font-family: 'Outfit', sans-serif !important;">
${itemsHTML}
</ul>\n<p>&nbsp;</p>`;
  };

  // 3. DAHİL OLMAYAN (HARİÇ) HİZMETLER HTML'İ
  const generateExcludedHTML = () => {
    const itemsHTML = excludedServices
      .map(
        (item, idx) =>
          `\t<li style="background: #ffffff !important; margin-bottom: ${
            idx === excludedServices.length - 1 ? "0" : "8px"
          } !important; padding: 10px 18px 10px 44px !important; border-radius: 12px !important; border: 1px solid #fee2e2 !important; font-size: 15px !important; line-height: 1.4 !important; color: #0f172a !important; font-weight: 400 !important; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.03) !important; position: relative !important; text-align: left !important;"><span style="position: absolute !important; left: 16px !important; top: 10px !important; color: #ef4444 !important; font-weight: 800 !important; font-size: 15px !important; line-height: 1 !important;">✕</span> ${item}</li>`
      )
      .join("\n");

    const titleHTML = excludedTitle && excludedTitle.trim()
      ? `<h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 16px; text-align: left; font-family: 'Outfit', sans-serif !important;">${excludedTitle.trim()}</h2>\n`
      : "";

    return `${titleHTML}<ul style="list-style: none !important; padding: 0 !important; margin: 0 auto !important; max-width: 800px !important; font-family: 'Outfit', sans-serif !important;">
${itemsHTML}
</ul>\n<p>&nbsp;</p>`;
  };

  // 4. ÖNEMLİ BİLGİLER VE NOTLAR (ACCORDION) HTML'İ
  const generateImportantHTML = () => {
    const notesListHTML = importantNotes
      .map((note) => `\t<li>${note}</li>`)
      .join("\n");

    return `<!-- PREMIUM FONT: OUTFIT -->
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&amp;display=swap" rel="stylesheet" />
<style type="text/css">
.bt-tourday, .bt-tourday * { font-family: 'Outfit', sans-serif !important; box-sizing: border-box; }
.bt-tourday { color: #0f172a; margin: 0 !important; padding: 0 !important; }
.bt-tour-container { width: 100%; max-width: 900px; margin: 0 auto; padding: 10px 20px !important; }
.bt-tour-details { width: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; margin-bottom: 8px; box-shadow: 0 2px 4px rgba(15, 23, 42, 0.03); border-left: 5px solid #1ea1be; overflow: hidden; transition: all 0.3s ease; }
.bt-tour-summary { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; cursor: pointer; list-style: none; outline: none; user-select: none; transition: background 0.3s ease; }
.bt-tour-summary::-webkit-details-marker { display: none; }
.bt-tour-summary:hover { background: #f8fafc; }
.bt-tour-list-title { font-size: 17px; font-weight: 700; color: #1e293b; margin: 0; display: flex; align-items: center; gap: 10px; }
.bt-tour-header-icon { font-size: 19px; }
.bt-tour-click-badge { display: inline-flex; align-items: center; gap: 4px; background: linear-gradient(135deg, #1ea1be, #0e7fa0); color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; white-space: nowrap; box-shadow: 0 2px 6px rgba(30, 161, 190, 0.3); }
.bt-tour-details[open] .bt-tour-click-badge { display: none; }
.bt-tour-chevron-box { display: flex; align-items: center; justify-content: center; transition: transform 0.4s ease; }
.bt-tour-chevron { width: 20px; height: 20px; fill: none; stroke: #64748b; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.bt-tour-details[open] { border-color: #1ea1be; box-shadow: 0 6px 12px -2px rgba(30, 161, 190, 0.08); }
.bt-tour-details[open] .bt-tour-chevron-box { transform: rotate(180deg); }
.bt-tour-details[open] .bt-tour-chevron { stroke: #1ea1be; }
.bt-tour-details[open] .bt-tour-summary { background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
.bt-tour-accordion-content { padding: 14px 18px; }
.bt-tour-notes-list { list-style: none; padding: 0; margin: 0; }
.bt-tour-notes-list li { background: #ffffff; margin-bottom: 8px !important; padding: 10px 16px 10px 38px !important; border-radius: 12px; border: 1px solid #f1f5f9; font-size: 14.5px !important; line-height: 1.5 !important; font-weight: 400 !important; box-shadow: 0 2px 4px rgba(15, 23, 42, 0.02); text-align: left !important; position: relative; overflow-wrap: break-word !important; word-wrap: break-word !important; }
.bt-tour-notes-list li:last-child { margin-bottom: 0 !important; }
.bt-tour-notes-list li::before { content: "•"; position: absolute; left: 15px; top: 6px; color: #1ea1be; font-weight: 900; font-size: 1.6em; line-height: 1; }
@media (max-width: 768px) {
  .bt-tourday .bt-tour-container { padding: 10px !important; }
  .bt-tour-notes-list li { font-size: 14px !important; padding-left: 32px !important; }
  .bt-tour-notes-list li::before { left: 12px; }
  .bt-tour-list-title { font-size: 15px; }
  .bt-tour-summary { padding: 10px 14px; }
}
</style>
<section class="bt-tourday">
<div class="bt-tour-container">
<details class="bt-tour-details" id="bt-onemli-details" open=""><summary class="bt-tour-summary">
<h3 class="bt-tour-list-title"><span class="bt-tour-header-icon">📌</span> ${importantTitle} <span class="bt-tour-click-badge">👆 Tıklayınız</span></h3>
<div class="bt-tour-chevron-box"><svg class="bt-tour-chevron" viewbox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></div>
</summary>
<div class="bt-tour-accordion-content">
<ul class="bt-tour-notes-list">
${notesListHTML}
</ul>
</div>
</details>
</div>
</section>
<script>
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.bt-tour-details').forEach(function (el) {
        el.removeAttribute('open');
    });
});
</script>`;
  };

  // 5. TÜM SAYFA (HEPSİ BİR ARADA) - ÖNEMLİ BİLGİLER DAHİL & HARİÇ'TEN ÖNCE GELİR
  const generateAllHTML = (isPreview = false) => {
    return `${generateProgramHTML(isPreview)}

<!-- ÖNEMLİ BİLGİLER VE NOTLAR (AKORDEON) -->
<div style="margin-top: 36px !important;">
  ${generateImportantHTML()}
</div>

<!-- DAHİL OLAN HİZMETLER -->
<section class="bt-tourday" style="margin-top: 36px !important;">
  <div class="bt-tour-container">
    ${generateIncludedHTML()}
  </div>
</section>

<!-- DAHİL OLMAYAN (HARİÇ) HİZMETLER -->
<section class="bt-tourday" style="margin-top: 24px !important;">
  <div class="bt-tour-container">
    ${generateExcludedHTML()}
  </div>
</section>`;
  };

  // AKTİF SEKMENİN HTML'İNİ AL
  const getActiveTabHTML = (isPreview = false) => {
    switch (activeTab) {
      case "program":
        return generateProgramHTML(isPreview);
      case "included":
        return generateIncludedHTML();
      case "excluded":
        return generateExcludedHTML();
      case "important":
        return generateImportantHTML();
      case "all":
        return generateAllHTML(isPreview);
      default:
        return "";
    }
  };

  // TÜM GÜNLERİ YEREL KURAL MOTORUYLA KALINLAŞTIR (KESİN & HATASIZ)
  const handleApplyLocalAutoBoldAllDays = () => {
    const updated = days.map((d) => {
      // Eğer metinde önceki bozuk AI kalıntıları varsa temizle
      let cleanInput = d.content;
      if (/(\bInput text:|\bTask:|\bConstraint\b|Refining the|Final string:)/i.test(cleanInput)) {
        const m = cleanInput.match(/(?:Final string|Final Result|Result)\s*:\s*\n*([\s\S]+)$/i);
        if (m && m[1]) cleanInput = m[1].trim();
        else {
          cleanInput = cleanInput.split("\n").filter(l => !/^\s*\*\s*(Input text|Task|Constraint|Refining|Self-Correction|Check)/i.test(l)).join("\n").trim();
        }
      }
      return {
        ...d,
        content: autoBoldDayContent(cleanInput, [hero.title, hero.subtitle])
      };
    });
    setDays(updated);
    setImportMessage("✓ Tüm günler yerel kural motoruyla tertemiz kalınlaştırıldı.");
    setTimeout(() => setImportMessage(null), 3000);
  };

  // GENEL KOPYALAMA (SEKME BAZLI)
  const copyHTML = (tab: "program" | "included" | "excluded" | "important" | "all") => {
    let content = "";
    if (tab === "program") content = generateProgramHTML(false);
    else if (tab === "included") content = generateIncludedHTML();
    else if (tab === "excluded") content = generateExcludedHTML();
    else if (tab === "important") content = generateImportantHTML();
    else if (tab === "all") content = generateAllHTML(false);

    navigator.clipboard.writeText(content);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  // TEK KART KOPYALAMA (BULUŞMA VEYA HERHANGİ BİR GÜN)
  const copySingleCard = (day: DayData) => {
    const html = generateSingleCardHTML(day);
    navigator.clipboard.writeText(html);
    setCopiedCardId(day.id);
    setTimeout(() => setCopiedCardId(null), 2000);
  };


  // TEK BİR GÜNÜ YAPAY ZEKA İLE KALINLAŞTIR
  const handleAiBoldSingleDay = async (dayId: number, currentContent: string) => {
    if (!geminiApiKey.trim()) {
      setIsAiModalOpen(true);
      return;
    }
    setIsAiLoading(true);
    try {
      const prompt = `Sen Burak Turizm'in profesyonel tur editörüsün. Aşağıdaki tur günü metnindeki tarihi mekanları, türbeleri, külliyeleri, camileri, tapınakları, sarayları, müzeleri, otelleri, uçuş/sefer kodlarını, saatleri ve şehirleri <b>...</b> etiketiyle kalınlaştır.
ÖNEMLİ KURALLAR:
1. Metnin kelimelerini, anlamını ASLA değiştirme veya ekleme yapma.
2. Sadece kalınlaştırılması gereken yerlerin önüne <b> sonuna </b> ekle.
3. SADECE güncellenmiş metni döndür, başka hiçbir açıklama yazma.

Metin:
${currentContent}`;

      const aiResult = await callGeminiAi(geminiApiKey, prompt);
      const safeContent = sanitizeAiTextOutput(aiResult, currentContent, [hero.title, hero.subtitle]);
      updateDay(dayId, "content", safeContent);
      setImportMessage("✓ Gün başarıyla analiz edildi ve kalınlaştırıldı.");
      setTimeout(() => setImportMessage(null), 3000);
    } catch (err: any) {
      alert("Yapay zekaya ulaşılamadı: " + err.message + "\nYerel kural motoru devreye alınıyor.");
      // Fallback to local auto-bold
      const localResult = autoBoldDayContent(currentContent, [hero.title, hero.subtitle]);
      updateDay(dayId, "content", localResult);
    } finally {
      setIsAiLoading(false);
    }
  };

  // TÜM TURU YAPAY ZEKA İLE ANALİZ ET & ZENGİNLEŞTİR (HERO MADDELERİ + BOLDLAR)
  const handleAiEnrichEntireTour = async () => {
    if (!geminiApiKey.trim()) {
      setIsAiModalOpen(true);
      return;
    }
    setIsAiLoading(true);
    try {
      // 1. Hero maddelerini AI ile çıkar (Havayolu hariç!)
      const heroPrompt = `Aşağıdaki tur başlığı ve dahil olan hizmetler listesine bakarak, Burak Turizm tur üst kartı için en can alıcı 4-6 kısa özellik maddesi üret.
KURALLAR:
1. KESİNLİKLE havayolu (THY ile, uçak vb.) EKLEME.
2. Akşam yemekleri (örn: 🍱 8 Akşam Yemeği Dahil), konaklama (örn: 🏨 5* Oteller & Cruise), girişler (örn: 🎫 Tüm Müze Girişleri Dahil), ekstra tur şartı (örn: ✅ Ekstra Tur Ödemesi Yok), ülke sayısı (örn: 🏰 4 Ülke & 4 Başkent), rehberlik (örn: 🧭 Profesyonel Türkçe Rehberlik) gibi konuları ele al.
3. Her maddenin başına uygun tek bir emoji koy.
4. SADECE geçerli bir JSON string dizisi döndür (Örnek: ["🍱 8 Akşam Yemeği Dahil", "🏨 5 Yıldızlı Oteller"]). Başka hiçbir açıklama yazma.

Tur Başlığı: ${hero.title}
Dahil Olanlar:
${includedServices.join("\n")}`;

      const heroAiRes = await callGeminiAi(geminiApiKey, heroPrompt);
      try {
        const jsonMatch = heroAiRes.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Havayolu içermeyenleri al
            const cleanFeatures = parsed.filter((f: string) => !/hava\s*yol|thy|uçak/i.test(f)).slice(0, 6);
            if (cleanFeatures.length > 0) {
              setHero((prev) => ({ ...prev, features: cleanFeatures }));
            }
          }
        }
      } catch (e) {}

      // 2. Günlerdeki açıklamaları AI ile kalınlaştır
      const updatedDays = await Promise.all(
        days.map(async (d) => {
          try {
            const dayPrompt = `Aşağıdaki tur metnindeki tarihi ve dini mekanları (türbeler, külliyeler, camiler, medreseler, tapınaklar, saraylar, müzeler, oteller vb.), uçuşları ve saatleri <b>...</b> etiketi ile kalınlaştır. Kelimeleri değiştirme. Sadece metni döndür.
Metin:
${d.content}`;
            const bolded = await callGeminiAi(geminiApiKey, dayPrompt);
            const safeContent = sanitizeAiTextOutput(bolded, d.content, [hero.title, hero.subtitle]);
            return { ...d, content: safeContent };
          } catch (e) {
            return d;
          }
        })
      );
      setDays(updatedDays);
      setImportMessage("✨ Harika! Tüm tur programı ve Hero maddeleri Yapay Zeka ile başarıyla zenginleştirildi.");
      setTimeout(() => setImportMessage(null), 5000);
      setIsAiModalOpen(false);
    } catch (err: any) {
      alert("Yapay zeka analizinde hata oluştu: " + err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  // SADECE HERO KARTINI KOPYALA
  const copyHeroCard = () => {
    const html = generateHeroOnlyHTML(false);
    navigator.clipboard.writeText(html);
    setCopiedCardId("hero");
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans antialiased text-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* BAŞARI BİLDİRİMİ (TOAST) */}
        {importMessage && (
          <div className="mb-4 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center justify-between animate-fade-in font-semibold text-sm">
            <span>{importMessage}</span>
            <button
              onClick={() => setImportMessage(null)}
              className="text-white/80 hover:text-white ml-4 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* ÜST HEADER */}
        <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✈️</span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Burak Turizm - Tam Kapsamlı Tur Jeneratörü
              </h1>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Hero Kartı, Buluşma, Tur Günleri, Çoklu Önemli Notlar, Dahil/Hariç Hizmetler ve Akordeon Notlar.
            </p>
          </div>
          <div className="flex items-center flex-wrap gap-2.5">
            {/* YAPAY ZEKA ASİSTANI BUTONU */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-emerald-500/30"
              title="Google Gemini Yapay Zeka ile turu analiz edin ve zenginleştirin"
            >
              <span className="text-base">🤖</span>
              <span>Yapay Zeka (AI)</span>
              {geminiApiKey ? (
                <span className="w-2.5 h-2.5 rounded-full bg-lime-300 animate-pulse inline-block" title="AI Aktif" />
              ) : (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-normal">Ayarla</span>
              )}
            </button>

            {/* AKILLI WORD / PDF / METİN AKTARMA BUTONU */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>📄 Word / PDF / Metin Yükle</span>
            </button>
            <button
              onClick={() => copyHTML(activeTab)}
              className="bg-sky-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-sky-700 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{copiedTab === activeTab ? "✓ Kopyalandı!" : "📋 Aktif Sekmeyi Kopyala"}</span>
            </button>
            <button
              onClick={() => copyHTML("all")}
              className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{copiedTab === "all" ? "✓ Kopyalandı!" : "📦 Tümünü Kopyala"}</span>
            </button>
          </div>
        </header>

        {/* SEKME MENÜSÜ (TABS) */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("program")}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "program"
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span>🌟 Tur Programı & Buluşma</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {days.length} kart
            </span>
          </button>
          <button
            onClick={() => setActiveTab("important")}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "important"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span>📌 Önemli Bilgiler ve Notlar</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {importantNotes.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("included")}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "included"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span>✅ Dahil Olan Hizmetler</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {includedServices.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("excluded")}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "excluded"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span>❌ Dahil Olmayan Hizmetler</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {excludedServices.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span>📦 Tüm Sayfa Önizleme</span>
          </button>
        </div>

        {/* ANA İÇERİK: SOL FORM, SAĞ ÖNİZLEME */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* SOL PANEL - FORMLAR */}
          <div className="space-y-6">
            {/* ========================================================= */}
            {/* SEKME 1: TUR PROGRAMI (HERO + BULUŞMA + GÜNLER) */}
            {/* ========================================================= */}
            {activeTab === "program" && (
              <>
                {/* HERO ALANI */}
                <div className="bg-indigo-50 p-5 rounded-2xl shadow-sm border border-indigo-100 space-y-4">
                  <div className="flex justify-between items-center border-b border-indigo-200 pb-2">
                    <h2 className="text-lg font-bold text-indigo-900">
                      🌟 Tur Üst (Hero) Kartı
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyHeroCard}
                        className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                        title="Yalnızca Hero kartının HTML kodunu kopyalar"
                      >
                        {copiedCardId === "hero" ? "✓ Kopyalandı!" : "📋 Hero'yu Kopyala"}
                      </button>
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-full">
                        Başlık & Özellikler
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-indigo-700 mb-1">
                        Tur Süresi (Tag)
                      </label>
                      <input
                        type="text"
                        value={hero.duration}
                        onChange={(e) => setHero({ ...hero, duration: e.target.value })}
                        className="w-full border border-indigo-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-indigo-700 mb-1">
                        Tur Başlığı
                      </label>
                      <input
                        type="text"
                        value={hero.title}
                        onChange={(e) => setHero({ ...hero, title: e.target.value })}
                        className="w-full border border-indigo-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500 font-bold bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-700 mb-1">
                      Alt Başlık (Gezilecek Yerler / Şehirler)
                    </label>
                    <input
                      type="text"
                      value={hero.subtitle}
                      onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                      className="w-full border border-indigo-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500 bg-white"
                    />
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-indigo-100 space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-indigo-700">
                        Öne Çıkan Özellikler Grid'i
                      </label>
                      <button
                        onClick={addFeature}
                        className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg font-bold hover:bg-indigo-200 transition-colors cursor-pointer"
                      >
                        + Özellik Ekle
                      </button>
                    </div>
                    {hero.features.map((feat, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => updateFeature(idx, e.target.value)}
                          className="flex-1 border border-slate-200 rounded-lg p-1.5 text-sm outline-none focus:border-indigo-500"
                        />
                        <button
                          onClick={() => removeFeature(idx)}
                          className="text-red-400 hover:text-red-600 font-bold px-2 py-1 transition-colors cursor-pointer"
                          title="Sil"
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-indigo-700 mb-1">
                        Footer Link Metni
                      </label>
                      <input
                        type="text"
                        value={hero.footerText}
                        onChange={(e) => setHero({ ...hero, footerText: e.target.value })}
                        className="w-full border border-indigo-200 rounded-lg p-2 text-xs outline-none focus:border-indigo-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-indigo-700 mb-1">
                        Footer Link URL
                      </label>
                      <input
                        type="text"
                        value={hero.footerUrl}
                        onChange={(e) => setHero({ ...hero, footerUrl: e.target.value })}
                        className="w-full border border-indigo-200 rounded-lg p-2 text-xs outline-none focus:border-indigo-500 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* BUTONLAR: BULUŞMA EKLE & YENİ GÜN EKLE */}
                <div className="flex justify-between items-center pt-2">
                  <h2 className="text-lg font-bold text-slate-800">Tur Akışı & Günler</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={addMeeting}
                      className="bg-cyan-600 text-white px-3.5 py-2 rounded-xl text-sm font-semibold hover:bg-cyan-700 transition-colors shadow-sm cursor-pointer"
                    >
                      + Buluşma Ekle
                    </button>
                    <button
                      onClick={addDay}
                      className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                    >
                      + Yeni Gün Ekle
                    </button>
                  </div>
                </div>

                {/* GÜNLER VE BULUŞMA KART LİSTESİ */}
                {days.map((day, index) => {
                  const isMeeting = day.type === "meeting";
                  const isCopied = copiedCardId === day.id;

                  return (
                    <div
                      key={day.id}
                      className={`p-5 rounded-2xl shadow-sm border space-y-4 bg-white transition-all ${
                        isMeeting
                          ? "border-cyan-300 ring-1 ring-cyan-200"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-bold px-3 py-1 rounded-lg text-xs ${
                              isMeeting
                                ? "bg-cyan-100 text-cyan-800"
                                : "bg-sky-100 text-sky-800"
                            }`}
                          >
                            {isMeeting ? "✈️ BULUŞMA" : `📅 ${index + 1}. GÜN`}
                          </span>
                          <input
                            type="text"
                            value={day.dayTitle}
                            onChange={(e) => updateDay(day.id, "dayTitle", e.target.value)}
                            className="border border-slate-200 rounded-lg p-1.5 px-3 text-sm outline-none focus:border-sky-500 font-bold w-32"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          {/* TEK KART KOPYALA BUTONU */}
                          <button
                            onClick={() => copySingleCard(day)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                              isCopied
                                ? "bg-emerald-600 text-white"
                                : isMeeting
                                ? "bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200"
                                : "bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200"
                            }`}
                            title={`Sadece bu kartı (${day.dayTitle}) kopyalar`}
                          >
                            <span>{isCopied ? "✓ Kopyalandı!" : `📋 ${day.dayTitle}'ü Kopyala`}</span>
                          </button>
                          <button
                            onClick={() => removeDay(day.id)}
                            className="text-red-500 text-xs font-semibold hover:underline cursor-pointer px-1"
                          >
                            Kartı Sil
                          </button>
                        </div>
                      </div>

                      {/* DİNAMİK ROTA */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-sm font-bold text-slate-700">
                            Güzergah & Duraklar
                          </label>
                          <button
                            onClick={() => addRouteNode(day.id)}
                            className="text-xs font-bold bg-sky-100 text-sky-700 px-3 py-1.5 rounded-lg hover:bg-sky-200 transition-colors cursor-pointer"
                          >
                            + Durak Ekle
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {day.routes.map((route, rIndex) => (
                            <div key={route.id} className="flex flex-col">
                              <div className="flex gap-2 items-center">
                                <div className="w-6 h-6 shrink-0 rounded-full bg-white border border-slate-300 text-slate-500 flex items-center justify-center text-xs font-bold shadow-sm">
                                  {rIndex + 1}
                                </div>
                                <input
                                  type="text"
                                  value={route.location}
                                  onChange={(e) =>
                                    updateRouteNode(day.id, route.id, "location", e.target.value)
                                  }
                                  className="flex-1 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-sky-500 bg-white"
                                  placeholder="Örn: İstanbul Havalimanı"
                                />
                                {day.routes.length > 1 && (
                                  <button
                                    onClick={() => removeRouteNode(day.id, route.id)}
                                    className="text-slate-400 hover:text-red-500 p-2 transition-colors cursor-pointer"
                                    title="Durağı Sil"
                                  >
                                    ✖
                                  </button>
                                )}
                              </div>
                              {rIndex < day.routes.length - 1 && (
                                <div className="flex items-center pl-8 py-2 gap-2">
                                  <span className="text-slate-300 text-xs font-bold">↳</span>
                                  <select
                                    value={route.iconToNext}
                                    onChange={(e) =>
                                      updateRouteNode(
                                        day.id,
                                        route.id,
                                        "iconToNext",
                                        e.target.value
                                      )
                                    }
                                    className="border border-slate-200 rounded-lg p-1.5 text-xs outline-none focus:border-sky-500 bg-white cursor-pointer font-medium text-slate-700 w-36 shadow-sm"
                                  >
                                    {ICON_OPTIONS.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AÇIKLAMA METNİ */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-semibold text-slate-600">
                            Açıklama Metni (Kalın yerler &lt;b&gt;...&lt;/b&gt; olarak saklanır)
                          </label>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => toggleBoldSelection(`day-content-${day.id}`, day.id, day.content)}
                              title="Seçili metni kalın yapar veya kaldırır (Kısayol: Ctrl+B / Cmd+B)"
                              className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-700 px-2 py-0.5 rounded border border-slate-200 transition shadow-sm cursor-pointer"
                            >
                              <span className="font-extrabold text-xs">B</span> Seçiliyi Kalın Yap
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const stops = day.routes.map(r => r.location);
                                const bolded = autoBoldDayContent(day.content, stops);
                                updateDay(day.id, "content", bolded);
                              }}
                              title="Yerel kural motoruyla tarihi yerleri, saatleri ve otelleri otomatik kalınlaştırır"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200 transition shadow-sm cursor-pointer"
                            >
                              <span>🪄</span> Oto-Kalınlaştır
                            </button>
                            {geminiApiKey && (
                              <button
                                type="button"
                                onClick={() => handleAiBoldSingleDay(day.id, day.content)}
                                disabled={isAiLoading}
                                title="Google Gemini yapay zekasıyla karmaşık yerleri ve dini mekanları insan gibi kalınlaştırır"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 px-2 py-0.5 rounded border border-purple-200 transition shadow-sm cursor-pointer"
                              >
                                <span>✨</span> AI
                              </button>
                            )}
                          </div>
                        </div>
                        <textarea
                          id={`day-content-${day.id}`}
                          value={day.content}
                          onChange={(e) => updateDay(day.id, "content", e.target.value)}
                          onKeyDown={(e) => {
                            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
                              e.preventDefault();
                              toggleBoldSelection(`day-content-${day.id}`, day.id, day.content);
                            }
                          }}
                          rows={4}
                          className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-sky-500 resize-none font-sans"
                        />
                        <span className="block text-[11px] text-slate-400 mt-0.5">
                          💡 İpucu: Kalın yapmak istediğiniz kelimeyi seçip <b>B</b> butonuna basabilir veya klavyeden <b>Ctrl+B / Cmd+B</b> yapabilirsiniz.
                        </span>
                      </div>

                      {/* GÖRSEL URL */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Görsel URL (Opsiyonel)
                        </label>
                        <input
                          type="text"
                          placeholder="https://www.buraktur.com/..."
                          value={day.imageUrl}
                          onChange={(e) => updateDay(day.id, "imageUrl", e.target.value)}
                          className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-sky-500"
                        />
                      </div>

                      {/* ÇOKLU ÖNEMLİ NOTLAR (KIRMIZI KUTULAR) */}
                      <div className="bg-red-50/60 p-3.5 rounded-xl border border-red-100 space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                            <span>🚨</span> Önemli Notlar ({day.notes.length} adet)
                          </label>
                          <button
                            onClick={() => addDayNote(day.id)}
                            className="text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                          >
                            + Not Ekle
                          </button>
                        </div>
                        {day.notes.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">
                            Bu gün için henüz kırmızı önemli not eklenmedi.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {day.notes.map((note, nIdx) => (
                              <div key={nIdx} className="flex gap-2 items-start">
                                <span className="text-xs font-bold text-red-600 pt-2 shrink-0">
                                  {nIdx + 1}.
                                </span>
                                <textarea
                                  value={note}
                                  onChange={(e) =>
                                    updateDayNote(day.id, nIdx, e.target.value)
                                  }
                                  rows={2}
                                  className="flex-1 border border-red-200 rounded-lg p-2 text-xs outline-none focus:border-red-400 bg-white"
                                  placeholder="Önemli not açıklaması..."
                                />
                                <button
                                  onClick={() => removeDayNote(day.id, nIdx)}
                                  className="text-red-400 hover:text-red-600 font-bold p-1.5 transition-colors cursor-pointer"
                                  title="Notu Sil"
                                >
                                  ✖
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* ========================================================= */}
            {/* SEKME 2: DAHİL OLAN HİZMETLER */}
            {/* ========================================================= */}
            {activeTab === "included" && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                      <span>✅</span> Fiyata Dahil Olan Hizmetler
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Yeşil tikli kartlar olarak çıktısı alınır.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIncludedServices(DEFAULT_INCLUDED)}
                      className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 font-medium cursor-pointer"
                    >
                      Sıfırla
                    </button>
                    <button
                      onClick={addIncludedItem}
                      className="text-xs bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-emerald-700 font-bold shadow-sm cursor-pointer"
                    >
                      + Madde Ekle
                    </button>
                  </div>
                </div>

                {/* BAŞLIK DÜZENLEME (İSTEĞE BAĞLI / SİLİNEBİLİR) */}
                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-emerald-900">
                      Bölüm Başlığı <span className="text-emerald-700 font-normal">(İsteğe bağlı, başlık istemiyorsanız boş bırakabilirsiniz)</span>
                    </label>
                    {includedTitle ? (
                      <button
                        type="button"
                        onClick={() => setIncludedTitle("")}
                        className="text-[11px] text-emerald-700 hover:text-red-600 font-semibold underline cursor-pointer"
                      >
                        Başlığı Sil
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIncludedTitle("Fiyata Dahil Olan Hizmetler")}
                        className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold underline cursor-pointer"
                      >
                        Varsayılan Başlığı Ekle
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={includedTitle}
                    onChange={(e) => setIncludedTitle(e.target.value)}
                    placeholder="Örn: Fiyata Dahil Olan Hizmetler (İstemiyorsanız tamamen boş bırakın)"
                    className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-sm outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  {includedServices.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    >
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                        ✓
                      </span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateIncludedItem(idx, e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={() => removeIncludedItem(idx)}
                        className="text-slate-400 hover:text-red-500 p-2 font-bold transition-colors cursor-pointer"
                        title="Sil"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SEKME 3: DAHİL OLMAYAN (HARİÇ) HİZMETLER */}
            {/* ========================================================= */}
            {activeTab === "excluded" && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-rose-800 flex items-center gap-2">
                      <span>❌</span> Fiyata Dahil Olmayan Hizmetler
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Kırmızı çarpılı kartlar olarak çıktısı alınır.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setExcludedServices(DEFAULT_EXCLUDED)}
                      className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 font-medium cursor-pointer"
                    >
                      Sıfırla
                    </button>
                    <button
                      onClick={addExcludedItem}
                      className="text-xs bg-rose-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-rose-700 font-bold shadow-sm cursor-pointer"
                    >
                      + Madde Ekle
                    </button>
                  </div>
                </div>

                {/* BAŞLIK DÜZENLEME (İSTEĞE BAĞLI / SİLİNEBİLİR) */}
                <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-rose-900">
                      Bölüm Başlığı <span className="text-rose-700 font-normal">(İsteğe bağlı, başlık istemiyorsanız boş bırakabilirsiniz)</span>
                    </label>
                    {excludedTitle ? (
                      <button
                        type="button"
                        onClick={() => setExcludedTitle("")}
                        className="text-[11px] text-rose-700 hover:text-red-600 font-semibold underline cursor-pointer"
                      >
                        Başlığı Sil
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setExcludedTitle("Fiyata Dahil Olmayan Hizmetler")}
                        className="text-[11px] text-rose-700 hover:text-rose-800 font-semibold underline cursor-pointer"
                      >
                        Varsayılan Başlığı Ekle
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={excludedTitle}
                    onChange={(e) => setExcludedTitle(e.target.value)}
                    placeholder="Örn: Fiyata Dahil Olmayan Hizmetler (İstemiyorsanız tamamen boş bırakın)"
                    className="w-full bg-white border border-rose-300 rounded-lg p-2 text-sm outline-none focus:border-rose-600 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  {excludedServices.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-rose-50/40 border border-rose-100 rounded-xl p-2.5"
                    >
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0">
                        ✕
                      </span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateExcludedItem(idx, e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-rose-500"
                      />
                      <button
                        onClick={() => removeExcludedItem(idx)}
                        className="text-slate-400 hover:text-red-500 p-2 font-bold transition-colors cursor-pointer"
                        title="Sil"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SEKME 4: ÖNEMLİ BİLGİLER VE NOTLAR (ACCORDION) */}
            {/* ========================================================= */}
            {activeTab === "important" && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-amber-800 flex items-center gap-2">
                      <span>📌</span> Önemli Bilgiler ve Notlar
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tıklayınca açılan akordeon kartı üretir.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setImportantNotes(DEFAULT_IMPORTANT_NOTES)}
                      className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 font-medium cursor-pointer"
                    >
                      Varsayılanları Yükle
                    </button>
                    <button
                      onClick={addImportantItem}
                      className="text-xs bg-amber-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-amber-700 font-bold shadow-sm cursor-pointer"
                    >
                      + Not Ekle
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Başlık Metni
                  </label>
                  <input
                    type="text"
                    value={importantTitle}
                    onChange={(e) => setImportantTitle(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  {importantNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    >
                      <span className="text-xs font-bold text-amber-600 pt-2 shrink-0">
                        {idx + 1}.
                      </span>
                      <textarea
                        value={note}
                        onChange={(e) => updateImportantItem(idx, e.target.value)}
                        rows={2}
                        className="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() => removeImportantItem(idx)}
                        className="text-slate-400 hover:text-red-500 p-2 font-bold transition-colors cursor-pointer"
                        title="Sil"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SEKME 5: TÜM SAYFA (BİLGİLENDİRME) */}
            {/* ========================================================= */}
            {activeTab === "all" && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h2 className="text-lg font-bold text-slate-800">
                  📦 Tüm Sayfa Birleşik Çıktı
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Bu sekmede oluşturduğunuz <strong>Tur Programı (Hero + Buluşma + Günler)</strong>,{" "}
                  <strong>Dahil Olan Hizmetler</strong>, <strong>Dahil Olmayan Hizmetler</strong> ve{" "}
                  <strong>Önemli Bilgiler Akordeonu</strong> tek bir HTML sayfası halinde birleştirilmiştir.
                </p>
                <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-800">
                  💡 <strong>İpucu:</strong> Eğer CMS panelinizde tek bir editör kullanıyorsanız sağ üstteki{" "}
                  <strong>"Tümünü Kopyala"</strong> butonunu kullanabilirsiniz. Ayrı ayrı alanlar varsa ilgili sekmelerden veya kartlardan parça parça kopyalayabilirsiniz.
                </div>
              </div>
            )}
          </div>

          {/* SAĞ PANEL - CANLI ÖNİZLEME */}
          <div
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit sticky top-6 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 80px)" }}
          >
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800">
                Canlı Önizleme ({activeTab === "all" ? "Tüm Sayfa" : activeTab})
              </h2>
              <button
                onClick={() => copyHTML(activeTab)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {copiedTab === activeTab ? "✓ Kopyalandı" : "Kodu Kopyala"}
              </button>
            </div>
            {/* isPreview = true gönderiyoruz ki Fom Dijital ekibi çalışırken butonları ve yapıları görsün */}
            <div
              className="w-full overflow-hidden"
              dangerouslySetInnerHTML={{ __html: getActiveTabHTML(true) }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      
      {/* ========================================================================= */}
      {/* YAPAY ZEKA AYARLARI VE ZENGİNLEŞTİRME MODALI */}
      {/* ========================================================================= */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 space-y-5 border border-slate-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span>✨</span> Google Gemini Yapay Zeka
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Karmaşık türbe, külliye, tapınak isimlerini kusursuz kalınlaştırmak ve Hero maddelerini özetlemek için Google Gemini kullanılır.
                </p>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <span>🛡️</span> %100 Kesinti Güvenceli (Hibrit Çalışma):
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Yapay zeka olmasa bile sistem yerel kural motoruyla çalışmaya devam eder. AI, insan gibi karmaşık cümleleri anlamak için opsiyonel bir hızlandırıcıdır.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Gemini API Key (Ücretsizdir)
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => {
                      saveApiKey(e.target.value);
                      setAiTestResult(null);
                    }}
                    placeholder="AIzaSy..."
                    className="flex-1 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:border-purple-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={testAiKey}
                    disabled={isAiTesting || !geminiApiKey.trim()}
                    className="text-xs bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-3 py-2 rounded-xl font-bold cursor-pointer transition shadow-sm"
                  >
                    {isAiTesting ? "Test Ediliyor..." : "🔍 Test Et"}
                  </button>
                  {geminiApiKey && (
                    <button
                      type="button"
                      onClick={() => {
                        saveApiKey("");
                        setAiTestResult(null);
                      }}
                      className="text-xs text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 cursor-pointer font-semibold"
                    >
                      Sil
                    </button>
                  )}
                </div>

                {/* TEST SONUCU BİLDİRİMİ */}
                {aiTestResult && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold mt-2 ${
                      aiTestResult.success
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {aiTestResult.message}
                  </div>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 API anahtarı sadece kendi tarayıcınızda (localStorage) saklanır.{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-600 underline font-bold"
                  >
                    Buradan 1 saniyede ücretsiz alabilirsiniz ↗
                  </a>
                </p>
              </div>

              {geminiApiKey && (
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-3">
                  <h4 className="text-xs font-bold text-purple-900">
                    Sihirli İşlemler:
                  </h4>
                  <button
                    type="button"
                    onClick={handleAiEnrichEntireTour}
                    disabled={isAiLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <span>⏳ Yapay Zeka Analiz Ediyor...</span>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>Tüm Turu Yapay Zeka ile Zenginleştir</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10.5px] text-purple-700 text-center">
                    Tüm günlerdeki türbe/cami/otelleri kalınlaştırır ve Hero kartı için 5 can alıcı maddeyi (havayolu hariç) üretir.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AKILLI PDF / METİN OTOMATİK DOLDURMA MODALI */}
      {/* ========================================================================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 space-y-5 max-h-[90vh] overflow-y-auto border border-slate-200">
            {/* MODAL BAŞLIĞI */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span>📄</span> Word (.docx), PDF veya Metinden Doldur
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tur programı PDF dosyasını yükleyin veya metnini yapıştırın; başlık, günler, duraklar, kalın yazılar ve dahil/hariç hizmetler otomatik ayrılsın.
                </p>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* DOSYA YÜKLEME ALANI (SÜRÜKLE - BIRAK) */}
            <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-2xl p-5 text-center bg-indigo-50/50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">📄</span>
                <p className="text-sm font-bold text-indigo-900">
                  {isPdfLoading ? "PDF Dosyası Okunuyor & Kalın Yazılar Çözümleniyor..." : "PDF Dosyasını Seçin veya Buraya Sürükleyin"}
                </p>
                <p className="text-xs text-slate-500">
                  Desteklenen formatlar: .pdf, .txt (PDF'teki tüm kalın/bold yazılar korunur)
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPdfLoading}
                  className="mt-1 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {isPdfLoading ? "⏳ Okunuyor..." : "Bilgisayardan Dosya Seç"}
                </button>
              </div>
            </div>

            {/* VEYA METİN ALANI */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Veya PDF / Word Metnini Doğrudan Yapıştırın:
                </label>
                <button
                  type="button"
                  onClick={loadDemoVietnamTour}
                  className="text-xs text-purple-600 hover:text-purple-800 font-bold underline cursor-pointer"
                >
                  💡 Örnek Vietnam Turunu Yükle (Test)
                </button>
              </div>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                onPaste={handleTextareaPaste}
                rows={9}
                placeholder="Örnek:
VİETNAM, KAMBOÇYA, LAOS, 
TAYLAND TURU
Hanoi, Ha Long Bay, Ho Chi Minh...

1. Gün 3 Aralık: İstanbul – Hanoi
İstanbul Havalimanı THY bankosunda buluşuyoruz...

Fiyata Dahil Olan Hizmetler
• THY ile uçak bileti..."
                className="w-full border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-indigo-500 font-mono bg-slate-50"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                İpucu: Word veya PDF'ten kopyalayıp buraya yapıştırdığınızda kalın (bold) kelimeler otomatik korunur.
              </p>
            </div>

            {/* MODAL BUTONLARI */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-600 hover:bg-slate-100 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => parseAndApplyTourText(importText)}
                disabled={!importText.trim()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>🚀 Sihirli Şekilde Forma Aktar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
