import type { Category, CategoryKey, Subcategory, SubcategoryKey } from '../types';

// Single source of truth for the Category -> Subcategory taxonomy.
// Each category carries a stable `key`, a display `name`, an `icon` and a
// `gradient` token (see styles.css). New categories/subcategories can be added
// here without touching the UI — the same shape also supports future
// user-created custom categories.
export const categories: Category[] = [
  {
    key: 'food',
    name: 'Food',
    icon: '🍔',
    gradient: 'from-amber',
    subcategories: [
      { key: 'groceries', name: 'Groceries', icon: '🛒' },
      { key: 'restaurants', name: 'Restaurants', icon: '🍔' },
      { key: 'coffee', name: 'Coffee', icon: '☕' },
      { key: 'delivery', name: 'Delivery', icon: '🥡' },
      { key: 'bakery', name: 'Bakery', icon: '🥐' },
      { key: 'bar', name: 'Bar / Drinks', icon: '🍺' },
      { key: 'mcdonalds', name: "McDonald's", icon: '🍟' },
      { key: 'burger-king', name: 'Burger King', icon: '🍔' },
      { key: 'bobs', name: "Bob's", icon: '🍔' },
      { key: 'subway', name: 'Subway', icon: '🥪' }
    ]
  },
  {
    key: 'transportation',
    name: 'Transportation',
    icon: '🚗',
    gradient: 'from-cyan',
    subcategories: [
      { key: 'transport', name: 'Uber / Transport', icon: '🚗' },
      { key: 'public-transport', name: 'Public Transport', icon: '🚌' },
      { key: 'fuel', name: 'Fuel', icon: '⛽' },
      { key: 'car-maintenance', name: 'Car Maintenance', icon: '🚘' },
      { key: 'parking', name: 'Parking', icon: '🅿️' },
      { key: 'tolls', name: 'Tolls', icon: '🛣️' },
      { key: 'car-insurance', name: 'Car Insurance', icon: '🚙' },
      { key: 'vehicle-tax', name: 'Vehicle Tax / Licensing', icon: '📋' }
    ]
  },
  {
    key: 'housing',
    name: 'Housing',
    icon: '🏠',
    gradient: 'from-rose',
    subcategories: [
      { key: 'rent', name: 'Rent / Mortgage', icon: '🏠' },
      { key: 'condo', name: 'Condo Fee', icon: '🏢' },
      { key: 'water', name: 'Water', icon: '💧' },
      { key: 'electricity', name: 'Electricity', icon: '⚡' },
      { key: 'internet', name: 'Internet', icon: '🌐' },
      { key: 'gas', name: 'Gas', icon: '🔥' },
      { key: 'property-tax', name: 'Property Tax', icon: '🧾' },
      { key: 'home-insurance', name: 'Home Insurance', icon: '🛡️' },
      { key: 'cleaning', name: 'Cleaning Supplies', icon: '🧹' },
      { key: 'domestic-help', name: 'Domestic Help', icon: '🧑‍🔧' },
      { key: 'furniture', name: 'Furniture', icon: '🛋️' },
      { key: 'home-repairs', name: 'Home Repairs', icon: '🔧' },
      { key: 'decoration', name: 'Decoration', icon: '🪴' }
    ]
  },
  {
    key: 'personal-care',
    name: 'Personal Care',
    icon: '💇',
    gradient: 'from-pink',
    subcategories: [
      { key: 'barbershop', name: 'Barbershop', icon: '💇' },
      { key: 'beauty-salon', name: 'Beauty Salon', icon: '💅' },
      { key: 'spa', name: 'Spa / Massage', icon: '💆' },
      { key: 'cosmetics', name: 'Cosmetics', icon: '🧴' },
      { key: 'perfume', name: 'Perfume', icon: '🌸' },
      { key: 'personal-care', name: 'Personal Care', icon: '🪒' }
    ]
  },
  {
    key: 'health',
    name: 'Health & Wellness',
    icon: '🩺',
    gradient: 'from-lime',
    subcategories: [
      { key: 'health', name: 'Health', icon: '🩺' },
      { key: 'health-insurance', name: 'Health Insurance', icon: '🏥' },
      { key: 'pharmacy', name: 'Pharmacy', icon: '💊' },
      { key: 'dentist', name: 'Dentist', icon: '🦷' },
      { key: 'vision-care', name: 'Vision Care', icon: '👓' },
      { key: 'therapy', name: 'Therapy', icon: '🧠' },
      { key: 'exams', name: 'Exams / Labs', icon: '🧪' },
      { key: 'gym', name: 'Gym', icon: '🏋️' },
      { key: 'supplements', name: 'Supplements', icon: '💪' }
    ]
  },
  {
    key: 'shopping',
    name: 'Shopping',
    icon: '👕',
    gradient: 'from-violet',
    subcategories: [
      { key: 'clothing', name: 'Clothing', icon: '👕' },
      { key: 'shoes', name: 'Shoes', icon: '👟' },
      { key: 'shopping', name: 'Shopping', icon: '🛍️' },
      { key: 'accessories', name: 'Accessories', icon: '💍' },
      { key: 'electronics', name: 'Electronics', icon: '📱' }
    ]
  },
  {
    key: 'entertainment',
    name: 'Entertainment',
    icon: '🎮',
    gradient: 'from-purple',
    subcategories: [
      { key: 'leisure', name: 'Leisure', icon: '🎮' },
      { key: 'movies', name: 'Movies', icon: '🎬' },
      { key: 'concerts', name: 'Concerts / Shows', icon: '🎤' },
      { key: 'events', name: 'Events', icon: '🎟️' },
      { key: 'games', name: 'Games', icon: '🕹️' },
      { key: 'hobbies', name: 'Hobbies', icon: '🎲' }
    ]
  },
  {
    key: 'subscriptions',
    name: 'Subscriptions',
    icon: '📱',
    gradient: 'from-blue',
    subcategories: [
      { key: 'netflix', name: 'Netflix', icon: '🎬' },
      { key: 'disney', name: 'Disney+', icon: '🏰' },
      { key: 'max', name: 'Max', icon: '🎥' },
      { key: 'prime-video', name: 'Prime Video', icon: '📦' },
      { key: 'apple-tv', name: 'Apple TV+', icon: '🍎' },
      { key: 'globoplay', name: 'Globoplay', icon: '📺' },
      { key: 'paramount', name: 'Paramount+', icon: '⛰️' },
      { key: 'youtube-premium', name: 'YouTube Premium', icon: '▶️' },
      { key: 'crunchyroll', name: 'Crunchyroll', icon: '🍥' },
      { key: 'spotify', name: 'Spotify', icon: '🎵' },
      { key: 'apple-music', name: 'Apple Music', icon: '🎶' },
      { key: 'deezer', name: 'Deezer', icon: '🎧' },
      { key: 'game-pass', name: 'Game Pass', icon: '🎮' },
      { key: 'cloud-storage', name: 'Cloud Storage', icon: '☁️' },
      { key: 'ai-services', name: 'AI Services', icon: '🤖' },
      { key: 'news', name: 'News / Magazines', icon: '📰' },
      { key: 'mobile-plan', name: 'Mobile Plan', icon: '📱' }
    ]
  },
  {
    key: 'education',
    name: 'Education',
    icon: '📚',
    gradient: 'from-orange',
    subcategories: [
      { key: 'education', name: 'Education', icon: '📚' },
      { key: 'tuition', name: 'Tuition', icon: '🏫' },
      { key: 'courses', name: 'Courses', icon: '🎓' },
      { key: 'language', name: 'Language', icon: '🌍' },
      { key: 'books', name: 'Books', icon: '📖' },
      { key: 'school-supplies', name: 'School Supplies', icon: '📝' }
    ]
  },
  {
    key: 'work',
    name: 'Work',
    icon: '💼',
    gradient: 'from-slate',
    subcategories: [
      { key: 'equipment', name: 'Equipment', icon: '💻' },
      { key: 'office-supplies', name: 'Office Supplies', icon: '🖨️' },
      { key: 'software', name: 'Software', icon: '📄' },
      { key: 'coworking', name: 'Coworking', icon: '🏢' },
      { key: 'services', name: 'Services / Freelancers', icon: '🤝' },
      { key: 'ads', name: 'Ads / Marketing', icon: '📈' }
    ]
  },
  {
    key: 'travel',
    name: 'Travel',
    icon: '✈️',
    gradient: 'from-teal',
    subcategories: [
      { key: 'flights', name: 'Flights', icon: '✈️' },
      { key: 'hotels', name: 'Hotels', icon: '🏨' },
      { key: 'local-transport', name: 'Local Transport', icon: '🚖' },
      { key: 'meals', name: 'Meals', icon: '🍽️' },
      { key: 'tours', name: 'Tours', icon: '🎟️' },
      { key: 'travel-insurance', name: 'Travel Insurance', icon: '🛡️' }
    ]
  },
  {
    key: 'pets',
    name: 'Pets',
    icon: '🐶',
    gradient: 'from-emerald',
    subcategories: [
      { key: 'pet-food', name: 'Pet Food', icon: '🐶' },
      { key: 'vet', name: 'Vet', icon: '🩺' },
      { key: 'pet-meds', name: 'Pet Meds', icon: '💊' },
      { key: 'grooming', name: 'Grooming', icon: '🛁' },
      { key: 'pet-supplies', name: 'Pet Supplies', icon: '🦴' }
    ]
  },
  {
    key: 'finance',
    name: 'Finance',
    icon: '💰',
    gradient: 'from-indigo',
    subcategories: [
      { key: 'credit-card', name: 'Credit Card', icon: '💳' },
      { key: 'investments', name: 'Investments', icon: '🏦' },
      { key: 'loans', name: 'Loans', icon: '💵' },
      { key: 'insurance', name: 'Insurance', icon: '🛡️' },
      { key: 'taxes', name: 'Taxes', icon: '💸' },
      { key: 'bank-fees', name: 'Bank Fees', icon: '🏧' }
    ]
  },
  {
    key: 'family',
    name: 'Other',
    icon: '🎁',
    gradient: 'from-red',
    subcategories: [
      { key: 'gifts', name: 'Gifts', icon: '🎁' },
      { key: 'other', name: 'Other', icon: '✨' }
    ]
  }
];

// Sensible fallback used whenever a stored key no longer exists in the taxonomy.
export const FALLBACK_CATEGORY_KEY: CategoryKey = 'family';
export const FALLBACK_SUBCATEGORY_KEY: SubcategoryKey = 'other';

export const getCategory = (key: CategoryKey): Category =>
  categories.find((category) => category.key === key) ??
  categories.find((category) => category.key === FALLBACK_CATEGORY_KEY) ??
  categories[categories.length - 1];

export const getSubcategory = (
  categoryKey: CategoryKey,
  subcategoryKey: SubcategoryKey
): Subcategory | undefined =>
  getCategory(categoryKey).subcategories.find((sub) => sub.key === subcategoryKey);

// Maps the legacy flat categories to the new taxonomy so expenses saved before
// this change (localStorage + seed data) keep rendering correctly.
export const LEGACY_CATEGORY_MAP: Record<string, { category: CategoryKey; subcategory: SubcategoryKey }> = {
  market: { category: 'food', subcategory: 'groceries' },
  transport: { category: 'transportation', subcategory: 'transport' },
  water: { category: 'housing', subcategory: 'water' },
  electricity: { category: 'housing', subcategory: 'electricity' },
  internet: { category: 'housing', subcategory: 'internet' },
  housing: { category: 'housing', subcategory: 'rent' },
  leisure: { category: 'entertainment', subcategory: 'leisure' },
  health: { category: 'health', subcategory: 'health' },
  education: { category: 'education', subcategory: 'education' },
  card: { category: 'finance', subcategory: 'credit-card' },
  gifts: { category: 'family', subcategory: 'gifts' },
  other: { category: 'family', subcategory: 'other' }
};

// Normalizes a (possibly legacy or partial) category/subcategory pair into a
// valid pair that exists in the current taxonomy.
export const resolveCategory = (
  category?: CategoryKey,
  subcategory?: SubcategoryKey
): { category: CategoryKey; subcategory: SubcategoryKey } => {
  const existing = category ? categories.find((item) => item.key === category) : undefined;

  if (existing) {
    const sub = subcategory && existing.subcategories.some((item) => item.key === subcategory)
      ? subcategory
      : existing.subcategories[0].key;
    return { category: existing.key, subcategory: sub };
  }

  if (category && LEGACY_CATEGORY_MAP[category]) {
    return LEGACY_CATEGORY_MAP[category];
  }

  return { category: FALLBACK_CATEGORY_KEY, subcategory: FALLBACK_SUBCATEGORY_KEY };
};

// -----------------------------------------------------------------------------
// Localization
// -----------------------------------------------------------------------------
// Category / subcategory display names per language. The `name` field above is
// the single source for English (and the label future custom categories will
// carry), so these tables only hold the languages that differ from it — `pt`,
// `es` and `it`. `en` therefore always resolves from `name`, avoiding a
// duplicated English string that could silently drift out of sync.
// Brand names (Netflix, Disney+, Spotify, ...) are omitted entirely — they fall
// back to `name` and stay identical across all languages.
type CategoryLang = 'pt' | 'en' | 'es' | 'it';
type NameTranslations = Partial<Record<CategoryLang, string>>;

const categoryNames: Record<CategoryKey, NameTranslations> = {
  food: { pt: 'Alimentação', es: 'Alimentación', it: 'Alimentazione' },
  transportation: { pt: 'Transporte', es: 'Transporte', it: 'Trasporti' },
  housing: { pt: 'Moradia', es: 'Vivienda', it: 'Casa' },
  'personal-care': { pt: 'Cuidados Pessoais', es: 'Cuidado Personal', it: 'Cura Personale' },
  health: { pt: 'Saúde & Bem-estar', es: 'Salud y Bienestar', it: 'Salute e Benessere' },
  shopping: { pt: 'Compras', es: 'Compras', it: 'Shopping' },
  entertainment: { pt: 'Entretenimento', es: 'Entretenimiento', it: 'Intrattenimento' },
  subscriptions: { pt: 'Assinaturas', es: 'Suscripciones', it: 'Abbonamenti' },
  education: { pt: 'Educação', es: 'Educación', it: 'Istruzione' },
  work: { pt: 'Trabalho', es: 'Trabajo', it: 'Lavoro' },
  travel: { pt: 'Viagem', es: 'Viaje', it: 'Viaggi' },
  pets: { pt: 'Pets', es: 'Mascotas', it: 'Animali Domestici' },
  finance: { pt: 'Finanças', es: 'Finanzas', it: 'Finanze' },
  family: { pt: 'Outros', es: 'Otros', it: 'Altro' }
};

// Keyed by `${categoryKey}.${subcategoryKey}`.
const subcategoryNames: Record<string, NameTranslations> = {
  'food.groceries': { pt: 'Mercado', es: 'Supermercado', it: 'Spesa' },
  'food.restaurants': { pt: 'Restaurantes', es: 'Restaurantes', it: 'Ristoranti' },
  'food.coffee': { pt: 'Café', es: 'Café', it: 'Caffè' },
  'food.delivery': { pt: 'Delivery', es: 'Delivery', it: 'Delivery' },
  'food.bakery': { pt: 'Padaria', es: 'Panadería', it: 'Panetteria' },
  'food.bar': { pt: 'Bar', es: 'Bar / Bebidas', it: 'Bar / Drink' },

  'transportation.transport': { pt: 'Uber / Transporte', es: 'Uber / Transporte', it: 'Uber / Trasporto' },
  'transportation.public-transport': { pt: 'Transporte Público', es: 'Transporte Público', it: 'Trasporto Pubblico' },
  'transportation.fuel': { pt: 'Combustível', es: 'Combustible', it: 'Carburante' },
  'transportation.car-maintenance': { pt: 'Manutenção do Carro', es: 'Mantenimiento del Auto', it: 'Manutenzione Auto' },
  'transportation.parking': { pt: 'Estacionamento', es: 'Estacionamiento', it: 'Parcheggio' },
  'transportation.tolls': { pt: 'Pedágio', es: 'Peaje', it: 'Pedaggio' },
  'transportation.car-insurance': { pt: 'Seguro do Carro', es: 'Seguro del Auto', it: 'Assicurazione Auto' },
  'transportation.vehicle-tax': { pt: 'IPVA / Licenciamento', es: 'Impuesto Vehicular', it: 'Bollo Auto' },

  'housing.rent': { pt: 'Aluguel / Financiamento', es: 'Alquiler / Hipoteca', it: 'Affitto / Mutuo' },
  'housing.condo': { pt: 'Condomínio', es: 'Gastos de Comunidad', it: 'Spese Condominiali' },
  'housing.water': { pt: 'Água', es: 'Agua', it: 'Acqua' },
  'housing.electricity': { pt: 'Luz', es: 'Electricidad', it: 'Luce' },
  'housing.internet': { pt: 'Internet', es: 'Internet', it: 'Internet' },
  'housing.gas': { pt: 'Gás', es: 'Gas', it: 'Gas' },
  'housing.property-tax': { pt: 'IPTU', es: 'Impuesto Predial', it: 'IMU' },
  'housing.home-insurance': { pt: 'Seguro Residencial', es: 'Seguro de Hogar', it: 'Assicurazione Casa' },
  'housing.cleaning': { pt: 'Produtos de Limpeza', es: 'Productos de Limpieza', it: 'Prodotti per la Pulizia' },
  'housing.domestic-help': { pt: 'Diarista / Empregada', es: 'Servicio Doméstico', it: 'Colf / Aiuto Domestico' },
  'housing.furniture': { pt: 'Móveis', es: 'Muebles', it: 'Mobili' },
  'housing.home-repairs': { pt: 'Reparos', es: 'Reparaciones', it: 'Riparazioni' },
  'housing.decoration': { pt: 'Decoração', es: 'Decoración', it: 'Decorazione' },

  'personal-care.barbershop': { pt: 'Barbearia', es: 'Barbería', it: 'Barbiere' },
  'personal-care.beauty-salon': { pt: 'Salão de Beleza', es: 'Salón de Belleza', it: 'Salone di Bellezza' },
  'personal-care.spa': { pt: 'Spa / Massagem', es: 'Spa / Masaje', it: 'Spa / Massaggio' },
  'personal-care.cosmetics': { pt: 'Cosméticos', es: 'Cosméticos', it: 'Cosmetici' },
  'personal-care.perfume': { pt: 'Perfumes', es: 'Perfume', it: 'Profumi' },
  'personal-care.personal-care': { pt: 'Cuidados Pessoais', es: 'Cuidado Personal', it: 'Cura Personale' },

  'health.health': { pt: 'Saúde', es: 'Salud', it: 'Salute' },
  'health.health-insurance': { pt: 'Plano de Saúde', es: 'Seguro Médico', it: 'Assicurazione Sanitaria' },
  'health.pharmacy': { pt: 'Farmácia', es: 'Farmacia', it: 'Farmacia' },
  'health.dentist': { pt: 'Dentista', es: 'Dentista', it: 'Dentista' },
  'health.vision-care': { pt: 'Óptica', es: 'Óptica', it: 'Ottica' },
  'health.therapy': { pt: 'Terapia', es: 'Terapia', it: 'Terapia' },
  'health.exams': { pt: 'Exames', es: 'Exámenes', it: 'Esami' },
  'health.gym': { pt: 'Academia', es: 'Gimnasio', it: 'Palestra' },
  'health.supplements': { pt: 'Suplementos', es: 'Suplementos', it: 'Integratori' },

  'shopping.clothing': { pt: 'Roupas', es: 'Ropa', it: 'Abbigliamento' },
  'shopping.shoes': { pt: 'Calçados', es: 'Calzado', it: 'Scarpe' },
  'shopping.shopping': { pt: 'Compras', es: 'Compras', it: 'Shopping' },
  'shopping.accessories': { pt: 'Acessórios', es: 'Accesorios', it: 'Accessori' },
  'shopping.electronics': { pt: 'Eletrônicos', es: 'Electrónica', it: 'Elettronica' },

  'entertainment.leisure': { pt: 'Lazer', es: 'Ocio', it: 'Svago' },
  'entertainment.movies': { pt: 'Cinema', es: 'Cine', it: 'Cinema' },
  'entertainment.concerts': { pt: 'Shows', es: 'Conciertos', it: 'Concerti' },
  'entertainment.events': { pt: 'Eventos', es: 'Eventos', it: 'Eventi' },
  'entertainment.games': { pt: 'Jogos', es: 'Juegos', it: 'Giochi' },
  'entertainment.hobbies': { pt: 'Hobbies', es: 'Pasatiempos', it: 'Hobby' },

  // Brand streamings fall back to `name`; only the generic ones are translated.
  'subscriptions.cloud-storage': { pt: 'Armazenamento em Nuvem', es: 'Almacenamiento en la Nube', it: 'Archiviazione Cloud' },
  'subscriptions.ai-services': { pt: 'Serviços de IA', es: 'Servicios de IA', it: 'Servizi IA' },
  'subscriptions.news': { pt: 'Notícias / Revistas', es: 'Noticias / Revistas', it: 'Notizie / Riviste' },
  'subscriptions.mobile-plan': { pt: 'Plano de Celular', es: 'Plan de Móvil', it: 'Piano Telefonico' },

  'education.education': { pt: 'Educação', es: 'Educación', it: 'Istruzione' },
  'education.tuition': { pt: 'Mensalidade', es: 'Matrícula', it: 'Retta Scolastica' },
  'education.courses': { pt: 'Cursos', es: 'Cursos', it: 'Corsi' },
  'education.language': { pt: 'Idiomas', es: 'Idiomas', it: 'Lingue' },
  'education.books': { pt: 'Livros', es: 'Libros', it: 'Libri' },
  'education.school-supplies': { pt: 'Material Escolar', es: 'Material Escolar', it: 'Materiale Scolastico' },

  'work.equipment': { pt: 'Equipamentos', es: 'Equipos', it: 'Attrezzatura' },
  'work.office-supplies': { pt: 'Material de Escritório', es: 'Material de Oficina', it: 'Materiale da Ufficio' },
  'work.software': { pt: 'Software', es: 'Software', it: 'Software' },
  'work.coworking': { pt: 'Coworking', es: 'Coworking', it: 'Coworking' },
  'work.services': { pt: 'Serviços / Freelancers', es: 'Servicios / Freelancers', it: 'Servizi / Freelance' },
  'work.ads': { pt: 'Anúncios / Marketing', es: 'Anuncios / Marketing', it: 'Pubblicità / Marketing' },

  'travel.flights': { pt: 'Passagens', es: 'Vuelos', it: 'Voli' },
  'travel.hotels': { pt: 'Hotéis', es: 'Hoteles', it: 'Hotel' },
  'travel.local-transport': { pt: 'Transporte Local', es: 'Transporte Local', it: 'Trasporto Locale' },
  'travel.meals': { pt: 'Refeições', es: 'Comidas', it: 'Pasti' },
  'travel.tours': { pt: 'Passeios', es: 'Tours', it: 'Tour' },
  'travel.travel-insurance': { pt: 'Seguro Viagem', es: 'Seguro de Viaje', it: 'Assicurazione Viaggio' },

  'pets.pet-food': { pt: 'Ração', es: 'Comida de Mascotas', it: 'Cibo per Animali' },
  'pets.vet': { pt: 'Veterinário', es: 'Veterinario', it: 'Veterinario' },
  'pets.pet-meds': { pt: 'Medicamentos Pet', es: 'Medicamentos', it: 'Farmaci per Animali' },
  'pets.grooming': { pt: 'Banho e Tosa', es: 'Peluquería Canina', it: 'Toelettatura' },
  'pets.pet-supplies': { pt: 'Acessórios Pet', es: 'Accesorios de Mascotas', it: 'Accessori per Animali' },

  'finance.credit-card': { pt: 'Cartão de Crédito', es: 'Tarjeta de Crédito', it: 'Carta di Credito' },
  'finance.investments': { pt: 'Investimentos', es: 'Inversiones', it: 'Investimenti' },
  'finance.loans': { pt: 'Empréstimos', es: 'Préstamos', it: 'Prestiti' },
  'finance.insurance': { pt: 'Seguros', es: 'Seguros', it: 'Assicurazioni' },
  'finance.taxes': { pt: 'Impostos', es: 'Impuestos', it: 'Tasse' },
  'finance.bank-fees': { pt: 'Tarifas Bancárias', es: 'Comisiones Bancarias', it: 'Commissioni Bancarie' },

  'family.gifts': { pt: 'Presentes', es: 'Regalos', it: 'Regali' },
  'family.other': { pt: 'Outros', es: 'Otros', it: 'Altro' }
};

// Localized display name for a category, falling back to the taxonomy `name`.
export const categoryName = (key: CategoryKey, lang: CategoryLang): string =>
  categoryNames[key]?.[lang] ?? getCategory(key).name;

// Localized display name for a subcategory, falling back to the taxonomy `name`.
export const subcategoryName = (
  categoryKey: CategoryKey,
  subcategoryKey: SubcategoryKey,
  lang: CategoryLang
): string =>
  subcategoryNames[`${categoryKey}.${subcategoryKey}`]?.[lang] ??
  getSubcategory(categoryKey, subcategoryKey)?.name ??
  subcategoryKey;

// -----------------------------------------------------------------------------
// Integrity check
// -----------------------------------------------------------------------------
// Guards the invariants that are easy to break when editing the taxonomy by
// hand: duplicate keys, categories left without subcategories, translation
// entries missing pt/es/it, or table keys that point to something that no
// longer exists. Returns a list of human-readable problems (empty means healthy).
// Run automatically in development from main.tsx.
export const validateTaxonomy = (): string[] => {
  const problems: string[] = [];
  const validPairs = new Set<string>();
  const categoryKeys = new Set<CategoryKey>();

  for (const category of categories) {
    if (categoryKeys.has(category.key)) {
      problems.push(`Duplicate category key: "${category.key}"`);
    }
    categoryKeys.add(category.key);

    for (const lang of ['pt', 'es', 'it'] as const) {
      if (!categoryNames[category.key]?.[lang]) {
        problems.push(`Category "${category.key}" is missing its ${lang} label`);
      }
    }

    if (category.subcategories.length === 0) {
      problems.push(`Category "${category.key}" has no subcategories`);
    }

    const subKeys = new Set<SubcategoryKey>();
    for (const sub of category.subcategories) {
      if (subKeys.has(sub.key)) {
        problems.push(`Duplicate subcategory key "${sub.key}" in "${category.key}"`);
      }
      subKeys.add(sub.key);
      validPairs.add(`${category.key}.${sub.key}`);
    }
  }

  // A translation entry, when present, must carry pt, es and it (partial rows
  // are almost always an editing slip). Keys must also point to a real pair.
  for (const [pair, translations] of Object.entries(subcategoryNames)) {
    if (!validPairs.has(pair)) {
      problems.push(`Translation for unknown subcategory: "${pair}"`);
      continue;
    }
    for (const lang of ['pt', 'es', 'it'] as const) {
      if (!translations[lang]) {
        problems.push(`Subcategory "${pair}" is missing its ${lang} label`);
      }
    }
  }

  return problems;
};
