
import { Category, Product } from './types';

// The source of truth version - bumping this is good practice but our logic will handle updates automatically
export const DATA_VERSION = '2.0'; 
export const INITIAL_EXCHANGE_RATE = 15000;

// This array acts as the MASTER DATABASE.
// Any changes here will be reflected for all users immediately upon reload.
export const MOCK_PRODUCTS: Product[] = [
  // --- قسم الكهرباء ---
  {
    id: 'e1',
    name: 'مثقاب بوش ١٣مم احترافي (GSB 13 RE)',
    category: Category.ELECTRICITY,
    priceSYP: 0, // Calculated dynamically
    priceUSD: 65,
    brand: 'Bosch',
    rating: 4.9,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=1000&auto=format&fit=crop',
    description: 'المثقاب الأقوى في فئته. محرك 600 واط، مقبض مريح، وتصميم مدمج للعمل في الأماكن الضيقة. كفالة سنة حقيقية.'
  },
  {
    id: 'e2',
    name: 'طقم مفكات عزل 1000 فولت',
    category: Category.ELECTRICITY,
    priceSYP: 0,
    priceUSD: 12,
    brand: 'Wiha',
    rating: 4.8,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?q=80&w=1000&auto=format&fit=crop',
    description: 'طقم مفكات ألماني أصلي معزول لضمان سلامتك أثناء العمل بالكهرباء. رؤوس مغناطيسية قوية.'
  },
  {
    id: 'e3',
    name: 'فاحص جهد رقمي (Digital Multimeter)',
    category: Category.ELECTRICITY,
    priceSYP: 0,
    priceUSD: 25,
    brand: 'Fluke',
    rating: 5.0,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1585338665972-c2e36d4f13c6?q=80&w=1000&auto=format&fit=crop',
    description: 'جهاز فحص دقيق جداً للمحترفين. قياس الفولت، الأمبير، والمقاومة بدقة عالية.'
  },

  // --- قسم المياه والتمديدات ---
  {
    id: 'w1',
    name: 'مفتاح أنابيب سويدي ٦٠٠مم',
    category: Category.WATER,
    priceSYP: 0,
    priceUSD: 35,
    brand: 'Bahco',
    rating: 4.9,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1542838686-37da4a9fd1b3?q=80&w=1000&auto=format&fit=crop',
    description: 'الوحش السويدي الأصلي. فك متحرك قوي جداً، لا ينزلق ولا يصدأ. استثمار للعمر.'
  },
  {
    id: 'w2',
    name: 'صاروخ قص وتجليخ ٤.٥ إنش',
    category: Category.CONSTRUCTION, // Moved to construction usually, but serves cutting pipes
    priceSYP: 0,
    priceUSD: 45,
    brand: 'Makita',
    rating: 4.7,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop',
    description: 'صاروخ ماكيتا الأصلي، محرك جبار وسرعة دوران عالية لقص الحديد والبلاستيك والحجر.'
  },

  // --- قسم البناء ---
  {
    id: 'c1',
    name: 'شريط قياس ليزري ٥٠ متر',
    category: Category.CONSTRUCTION,
    priceSYP: 0,
    priceUSD: 40,
    brand: 'Bosch',
    rating: 4.9,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1594950346369-236b283f3898?q=80&w=1000&auto=format&fit=crop',
    description: 'وداعاً للمتر التقليدي. قس المسافات والمساحات بضغطة زر وبدقة مليمترية.'
  },
  {
    id: 'c2',
    name: 'مطرقة هدم وتكسير (هيلتي)',
    category: Category.CONSTRUCTION,
    priceSYP: 0,
    priceUSD: 180,
    brand: 'DeWalt',
    rating: 4.8,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=1000&auto=format&fit=crop',
    description: 'هيلتي تكسير جبارة للأعمال الشاقة في الباطون والجدران.'
  },

  // --- قسم الدهانات ---
  {
    id: 'p1',
    name: 'دهان جوتن فينوماستيك (أبيض ملكي)',
    category: Category.PAINT,
    priceSYP: 0,
    priceUSD: 45,
    brand: 'Jotun',
    rating: 5.0,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=1000&auto=format&fit=crop',
    description: 'دهان داخلي فاخر، قابل للغسل، تغطية ممتازة، وملمس حريري ناعم.'
  },
  {
    id: 'p2',
    name: 'رولة دهان احترافية مع عصا تمديد',
    category: Category.PAINT,
    priceSYP: 0,
    priceUSD: 10,
    brand: 'Harris',
    rating: 4.5,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
    description: 'لا تترك وبر وتضمن توزيع متساوي للدهان على الجدران.'
  }
];
