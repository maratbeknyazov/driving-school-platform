/**
 * Категории и разделы автошколы.
 *
 * Массив CATEGORIES — единственный источник карточек, фильтров, тем и
 * настроек экзамена. Новый раздел (например, «Ночное вождение») добавляется
 * одним объектом: карточка, страница теории и тренировка появятся сами.
 *
 * Поле filter — это источник регулярного выражения (без флагов), которым
 * платформа отбирает вопросы из банка ПДД. Поле bank — привязка к банку
 * билетов: категория без bank показывает только теорию, а не пустой тест.
 *
 * Схема:
 *   id, group ("license" | "theory" | "practice"), accent, icon
 *   title / subtitle / description — { ru, en }
 *   theory[]  — темы занятий { ru, en }
 *   exam      — { questions, pass, minutes }
 *   bank      — { id, questions, blocks } | null
 *   filter    — { source, fields } | null
 *   hotspots  — только для 3D-разбора автомобиля: id узла + подпись
 */

export const BANK_META = {
  id: "uz-b",
  title: { ru: "Банк ПДД · Узбекистан", en: "Traffic rules bank · Uzbekistan" },
  languages: ["ru", "uzb", "uzc"],
  questions: 1351,
  blocks: 68,
  questionsPerBlock: 20,
  source: "e-avtomaktab.uz",
};

export const EXAM_RULES = {
  questions: 20,
  pass: 18,
  minutes: 20,
  penalty: {
    ru: "Каждая ошибка снижает итог: для сдачи нужно 18 из 20.",
    en: "Every mistake counts: 18 of 20 correct is required to pass.",
  },
};

export const CATEGORIES = [
  {
    id: "cat-a",
    group: "license",
    accent: "#C084FC",
    icon: "moto",
    title: { ru: "Категория A", en: "Category A" },
    subtitle: { ru: "Мотоциклы и мопеды", en: "Motorcycles and mopeds" },
    description: {
      ru: "Посадка, баланс, торможение и защитная экипировка. Экзаменационная теория для мототехники и разбор типичных ошибок новичков.",
      en: "Seating, balance, braking and protective gear. The theory exam for motorcycles plus the mistakes beginners repeat most.",
    },
    theory: [
      { ru: "Экипировка: шлем, перчатки, защита корпуса", en: "Gear: helmet, gloves, body armour" },
      { ru: "Торможение: передний и задний тормоз", en: "Braking: front and rear brake" },
      { ru: "Положение в полосе и видимость", en: "Lane position and visibility" },
      { ru: "Пассажир и груз на мотоцикле", en: "Passengers and cargo on a motorcycle" },
      { ru: "Манёвр в потоке и слепые зоны", en: "Manoeuvring in traffic and blind spots" },
    ],
    exam: EXAM_RULES,
    bank: null,
    filter: { source: "мотоцикл|мопед|мото|двухколес", fields: ["q", "explanation"] },
    hotspots: [],
  },
  {
    id: "cat-b",
    group: "license",
    accent: "#FACC15",
    icon: "car",
    title: { ru: "Категория B", en: "Category B" },
    subtitle: { ru: "Легковые автомобили", en: "Passenger cars" },
    description: {
      ru: "Полный экзаменационный банк: 1351 вопрос в 68 блоках на трёх языках, экзамен 18 из 20, разбор ошибок и интервальное повторение.",
      en: "The complete exam bank: 1,351 questions in 68 blocks across three languages, an 18-of-20 exam, error review and spaced repetition.",
    },
    theory: [
      { ru: "Общие положения и обязанности водителя", en: "General provisions and driver duties" },
      { ru: "Сигналы, световые приборы и манёвры", en: "Signals, lights and manoeuvres" },
      { ru: "Скорость, дистанция и обгон", en: "Speed, following distance and overtaking" },
      { ru: "Остановка, стоянка и парковка", en: "Stopping, parking and standing" },
      { ru: "Особые условия: ночь, дождь, туман", en: "Special conditions: night, rain, fog" },
    ],
    exam: EXAM_RULES,
    bank: BANK_META,
    filter: null,
    hotspots: [],
  },
  {
    id: "cat-c",
    group: "license",
    accent: "#FB923C",
    icon: "truck",
    title: { ru: "Категория C", en: "Category C" },
    subtitle: { ru: "Грузовики и составы", en: "Trucks and combinations" },
    description: {
      ru: "Габариты, масса, пневматические тормоза и крепление груза. Отдельный фокус — тормозной путь и мёртвые зоны.",
      en: "Dimensions, weight, air brakes and load securing. Extra focus on stopping distance and blind spots.",
    },
    theory: [
      { ru: "Разрешённая масса и нагрузка на ось", en: "Permitted mass and axle load" },
      { ru: "Пневматическая тормозная система", en: "Air brake system" },
      { ru: "Крепление и распределение груза", en: "Load securing and weight distribution" },
      { ru: "Тормозной путь и дистанция", en: "Stopping distance and following gap" },
      { ru: "Мёртвые зоны и повороты", en: "Blind spots and turning" },
    ],
    exam: EXAM_RULES,
    bank: null,
    filter: { source: "грузов|масс|прицеп|фур|тягач|ось|габарит", fields: ["q", "explanation"] },
    hotspots: [],
  },
  {
    id: "vehicle",
    group: "theory",
    accent: "#38BDF8",
    icon: "gear",
    title: { ru: "Устройство автомобиля", en: "Vehicle mechanics" },
    subtitle: { ru: "3D-разбор по узлам", en: "Exploded 3D walkthrough" },
    description: {
      ru: "Интерактивная exploded-view модель: двигатель, трансмиссия, тормоза, подвеска, рулевое и электроника. Каждый узел — хотспот с объяснением.",
      en: "An interactive exploded view: engine, transmission, brakes, suspension, steering and electrics. Every part is a hotspot with an explanation.",
    },
    theory: [
      { ru: "Двигатель: цикл, смазка, охлаждение", en: "Engine: cycle, lubrication, cooling" },
      { ru: "Трансмиссия: сцепление, КПП, привод", en: "Transmission: clutch, gearbox, drive" },
      { ru: "Тормоза: диски, колодки, ABS", en: "Brakes: discs, pads, ABS" },
      { ru: "Подвеска и рулевое управление", en: "Suspension and steering" },
      { ru: "Электроника, аккумулятор, предохранители", en: "Electrics, battery, fuses" },
      { ru: "Шины: рисунок, давление, износ", en: "Tyres: tread, pressure, wear" },
    ],
    exam: { questions: 15, pass: 12, minutes: 15 },
    bank: null,
    filter: { source: "двигател|тормоз|масл|аккумулятор|рулев|сцеплен|коробк|подвеск|шины|давлен", fields: ["q", "explanation"] },
    hotspots: [
      { id: "engine", title: { ru: "Двигатель", en: "Engine" }, note: { ru: "Сердце автомобиля: преобразует топливо в движение, требует масла и охлаждения.", en: "Converts fuel into motion; depends on oil and coolant." } },
      { id: "brakes", title: { ru: "Тормозные диски", en: "Brake discs" }, note: { ru: "Трение колодок о диск гасит скорость; перегрев снижает эффективность.", en: "Pad friction slows the disc; overheating fades braking." } },
      { id: "wheels", title: { ru: "Колёса и шины", en: "Wheels and tyres" }, note: { ru: "Единственный контакт с дорогой: давление и рисунок влияют на сцепление.", en: "The only road contact: pressure and tread decide grip." } },
      { id: "suspension", title: { ru: "Подвеска", en: "Suspension" }, note: { ru: "Гасит неровности и удерживает колесо на дороге в повороте.", en: "Absorbs bumps and keeps the tyre planted mid-corner." } },
      { id: "cabin", title: { ru: "Салон и безопасность", en: "Cabin and safety" }, note: { ru: "Ремни, подушки, подголовники и зоны деформации работают вместе.", en: "Belts, airbags, head restraints and crumple zones work together." } },
    ],
  },
  {
    id: "first-aid",
    group: "theory",
    accent: "#F87171",
    icon: "aid",
    title: { ru: "Первая помощь", en: "First aid" },
    subtitle: { ru: "До приезда скорой", en: "Before the ambulance" },
    description: {
      ru: "Остановка кровотечения, иммобилизация, СЛР и действия при ДТП. Алгоритмы, которые проверяются на экзамене.",
      en: "Bleeding control, immobilisation, CPR and scene management. The algorithms the exam actually tests.",
    },
    theory: [
      { ru: "Оценка обстановки и вызов помощи", en: "Scene assessment and calling for help" },
      { ru: "Кровотечение: давящая повязка и жгут", en: "Bleeding: pressure bandage and tourniquet" },
      { ru: "Переломы и иммобилизация", en: "Fractures and immobilisation" },
      { ru: "СЛР и восстановление дыхания", en: "CPR and airway management" },
      { ru: "Ожоги, шок, потеря сознания", en: "Burns, shock, unconsciousness" },
    ],
    exam: { questions: 15, pass: 13, minutes: 15 },
    bank: null,
    filter: { source: "пострадав|кровотеч|жгут|перелом|ожог|сердеч|дыхан|реанимац|шок", fields: ["q", "explanation"] },
    hotspots: [],
  },
  {
    id: "signs",
    group: "theory",
    accent: "#4ADE80",
    icon: "sign",
    title: { ru: "Дорожные знаки", en: "Road signs" },
    subtitle: { ru: "7 групп и разметка", en: "7 groups and markings" },
    description: {
      ru: "Предупреждающие, приоритета, запрещающие, предписывающие, информационные, сервисные и таблички — плюс горизонтальная и вертикальная разметка.",
      en: "Warning, priority, prohibitory, mandatory, information, service signs and plates — plus horizontal and vertical markings.",
    },
    theory: [
      { ru: "Предупреждающие знаки и треугольник", en: "Warning signs and the triangle" },
      { ru: "Знаки приоритета", en: "Priority signs" },
      { ru: "Запрещающие и предписывающие", en: "Prohibitory and mandatory signs" },
      { ru: "Информационные, сервисные, таблички", en: "Information, service signs and plates" },
      { ru: "Разметка: линии, островки, стрелки", en: "Markings: lines, islands, arrows" },
    ],
    exam: { questions: 20, pass: 18, minutes: 20 },
    bank: null,
    filter: { source: "знак|табличк|разметк", fields: ["q", "explanation"] },
    hotspots: [],
  },
  {
    id: "intersections",
    group: "practice",
    accent: "#2DD4BF",
    icon: "junction",
    title: { ru: "Сложные перекрёстки", en: "Complex intersections" },
    subtitle: { ru: "Кто едет первым", en: "Who goes first" },
    description: {
      ru: "Равнозначные дороги, помеха справа, трамвай, круговое движение и левый поворот. Визуальные схемы ситуаций с разбором.",
      en: "Uncontrolled junctions, the right-hand rule, trams, roundabouts and left turns. Visual situation diagrams with explanations.",
    },
    theory: [
      { ru: "Равнозначные дороги и помеха справа", en: "Equal roads and the right-hand rule" },
      { ru: "Светофор, регулировщик, приоритет", en: "Traffic lights, wardens and priority" },
      { ru: "Круговое движение", en: "Roundabouts" },
      { ru: "Трамвай и рельсовый транспорт", en: "Trams and rail transport" },
      { ru: "Левый поворот и встречный поток", en: "Left turns and oncoming traffic" },
    ],
    exam: { questions: 20, pass: 18, minutes: 20 },
    bank: null,
    filter: { source: "перекрест|перекрёст|кругов|равнозначн", fields: ["q", "explanation"] },
    hotspots: [],
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
);

export const TOTAL_TOPICS = CATEGORIES.reduce(
  (n, c) => n + c.theory.length,
  0
);
