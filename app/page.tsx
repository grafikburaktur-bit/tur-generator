"use client";

import React, { useState } from "react";

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
.bt-tourday .bt-tour-text p { margin: 0 0 16px; font-size: 16px; color: #334155; line-height: 1.7; text-align: justify; }
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
  .bt-tourday .bt-tour-text p { text-align: left !important; font-size: 15px; }
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
  const [includedServices, setIncludedServices] = useState<string[]>(DEFAULT_INCLUDED);

  // HARİÇ OLANLAR
  const [excludedServices, setExcludedServices] = useState<string[]>(DEFAULT_EXCLUDED);

  // ÖNEMLİ BİLGİLER
  const [importantTitle, setImportantTitle] = useState("Önemli Bilgiler ve Notlar");
  const [importantNotes, setImportantNotes] = useState<string[]>(DEFAULT_IMPORTANT_NOTES);

  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [copiedCardId, setCopiedCardId] = useState<number | string | null>(null);

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
          } !important; padding: 10px 18px 10px 44px !important; border-radius: 12px !important; border: 1px solid #f1f5f9 !important; font-size: 15px !important; line-height: 1.4 !important; color: #0f172a !important; box-shadow: 0 2px 4px rgba(15, 23, 42, 0.02) !important; position: relative !important; text-align: left !important;"><span style="position: absolute !important; left: 16px !important; top: 10px !important; color: #22c55e !important; font-weight: 800 !important; font-size: 16px !important; line-height: 1 !important;">✓</span> ${item}</li>`
      )
      .join("\n");

    return `<ul style="list-style: none !important; padding: 0 !important; margin: 0 auto !important; max-width: 800px !important; font-family: 'Outfit', sans-serif !important;">
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
          } !important; padding: 10px 18px 10px 44px !important; border-radius: 12px !important; border: 1px solid #fee2e2 !important; font-size: 15px !important; line-height: 1.4 !important; color: #0f172a !important; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.03) !important; position: relative !important; text-align: left !important;"><span style="position: absolute !important; left: 16px !important; top: 10px !important; color: #ef4444 !important; font-weight: 800 !important; font-size: 15px !important; line-height: 1 !important;">✕</span> ${item}</li>`
      )
      .join("\n");

    return `<ul style="list-style: none !important; padding: 0 !important; margin: 0 auto !important; max-width: 800px !important; font-family: 'Outfit', sans-serif !important;">
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
.bt-tour-notes-list li { background: #ffffff; margin-bottom: 8px !important; padding: 10px 16px 10px 38px !important; border-radius: 12px; border: 1px solid #f1f5f9; font-size: 14.5px !important; line-height: 1.5 !important; box-shadow: 0 2px 4px rgba(15, 23, 42, 0.02); text-align: left !important; position: relative; overflow-wrap: break-word !important; word-wrap: break-word !important; }
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

  // 5. TÜM SAYFA (HEPSİ BİR ARADA)
  const generateAllHTML = (isPreview = false) => {
    return `${generateProgramHTML(isPreview)}

<!-- DAHİL OLAN HİZMETLER -->
<section class="bt-tourday" style="margin-top: 40px !important;">
  <div class="bt-tour-container">
    <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 16px; text-align: left;">✅ Fiyata Dahil Hizmetler</h2>
    ${generateIncludedHTML()}
  </div>
</section>

<!-- DAHİL OLMAYAN HİZMETLER -->
<section class="bt-tourday" style="margin-top: 30px !important;">
  <div class="bt-tour-container">
    <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 16px; text-align: left;">❌ Fiyata Dahil Olmayan Hizmetler</h2>
    ${generateExcludedHTML()}
  </div>
</section>

<!-- ÖNEMLİ BİLGİLER -->
<div style="margin-top: 30px !important;">
  ${generateImportantHTML()}
</div>`;
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => copyHTML(activeTab)}
              className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-sky-700 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
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
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Açıklama Metni (Kalın yapmak için &lt;strong&gt;metin&lt;/strong&gt;)
                        </label>
                        <textarea
                          value={day.content}
                          onChange={(e) => updateDay(day.id, "content", e.target.value)}
                          rows={4}
                          className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-sky-500 resize-none"
                        />
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
    </div>
  );
}
