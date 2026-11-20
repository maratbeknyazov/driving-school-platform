/**
 * Узлы автомобиля для 3D-разбора.
 *
 * id совпадает с именем группы в js/scene.js и с hotspot в categories.js.
 * Все подписи двуязычные: новая деталь добавляется одним объектом, а сцена
 * получает её anchor только если id предусмотрен в scene.js.
 */

export const VEHICLE_PARTS = [
  {
    id: "engine",
    accent: "#D9F99D",
    title: { ru: "Двигатель", en: "Engine" },
    subtitle: { ru: "1.6 MPI · 115 л.с. · бензин", en: "1.6 MPI · 115 hp · petrol" },
    note: {
      ru: "Четырёхтактный цикл: впуск, сжатие, рабочий ход, выпуск. Поршень толкает шатун, тот вращает коленвал, а ремень или цепь ГРМ синхронизирует клапаны с коленвалом.",
      en: "Four strokes: intake, compression, power, exhaust. The piston drives the rod, the rod turns the crank, and the timing belt or chain keeps valves in step with it.",
    },
    resource: {
      ru: "Масло и фильтр — каждые 10 000 км или раз в год; охлаждающая жидкость — 5 лет; ремень ГРМ — 90 000 км, цепь — по износу.",
      en: "Oil and filter every 10,000 km or yearly; coolant every 5 years; timing belt at 90,000 km, chain by wear.",
    },
    failure: {
      ru: "Масляное голодание задирает шейки коленвала: стук, падение давления, капремонт или замена двигателя — от $2 000.",
      en: "Oil starvation scores the crank journals: knocking, lost pressure, a rebuild or a replacement engine from $2,000.",
    },
    facts: [
      { ru: "Давление масла на холодную выше: лампа гаснет через 1–2 секунды после пуска.", en: "Cold oil pressure is higher: the warning light should go out 1–2 seconds after start." },
      { ru: "Перегрев опаснее поездки без масла на короткую дистанцию: головка ведёт уже при 110–120 °C.", en: "Overheating is deadlier than a short low-oil trip: the head warps at 110–120 °C." },
      { ru: "Стук на холодную, исчезающий при прогреве, — частый признак изношенных гидрокомпенсаторов.", en: "Cold-start tapping that fades when warm often means worn hydraulic lifters." },
    ],
  },
  {
    id: "transmission",
    accent: "#FACC15",
    title: { ru: "Трансмиссия", en: "Transmission" },
    subtitle: { ru: "Сцепление · МКПП · привод", en: "Clutch · manual · drivetrain" },
    note: {
      ru: "Сцепление соединяет двигатель с коробкой, передаёт крутящий момент и гасит рывки. Коробка меняет передаточное число, а ШРУСы передают момент на колёса под углом.",
      en: "The clutch links engine and gearbox, transmits torque and absorbs shock. The gearbox changes ratio, and CV joints deliver torque to the wheels at an angle.",
    },
    resource: {
      ru: "Диск сцепления — 100 000–150 000 км; масло в МКПП — 60 000 км; пыльники ШРУСов проверять каждые 20 000 км.",
      en: "Clutch disc 100,000–150,000 km; gearbox oil 60,000 km; CV boots checked every 20,000 km.",
    },
    failure: {
      ru: "Езда «на полусцеплении» сжигает диск: запах, пробуксовка на подъёме, замена — $500–1 200. Порванный пыльник ШРУСа убивает гранату за пару тысяч км.",
      en: "Riding the clutch burns the disc: smell, slip on a climb, a $500–1,200 replacement. A torn CV boot destroys the joint within a couple thousand km.",
    },
    facts: [
      { ru: "Сцепление не охлаждается: держать педаль нажатой на светофоре — износ выжимного подшипника.", en: "The clutch has no cooling: holding the pedal at a light wears the release bearing." },
      { ru: "Хруст при включении задней — не всегда коробка: проверьте уровень и состояние масла.", en: "A crunch into reverse is not always the gearbox: check oil level and condition." },
      { ru: "Разный износ передних шин слева и справа — повод проверить ШРУС и углы установки колёс.", en: "Uneven front-tyre wear left to right points to a CV joint or wheel alignment." },
    ],
  },
  {
    id: "brakes",
    accent: "#FB7185",
    title: { ru: "Тормоза", en: "Brakes" },
    subtitle: { ru: "Диски · колодки · ABS", en: "Discs · pads · ABS" },
    note: {
      ru: "Колодки прижимаются к диску, кинетическая энергия переходит в тепло. ABS отпускает колесо импульсами, сохраняя управляемость при блокировке.",
      en: "Pads clamp the disc, turning kinetic energy into heat. ABS releases a locking wheel in pulses so steering stays alive.",
    },
    resource: {
      ru: "Колодки — при остатке 3 мм; диск — при толщине ниже минимума или бороздах; жидкость DOT 4 — каждые 2 года.",
      en: "Pads at 3 mm remaining; discs below minimum thickness or deeply grooved; DOT 4 fluid every 2 years.",
    },
    failure: {
      ru: "Перегретые тормоза «плывут»: педаль проваливается, тормозной путь с 100 км/ч растёт на 15–20 м. Старая жидкость закипает уже при 150 °C.",
      en: "Hot brakes fade: the pedal sinks and stopping distance from 100 km/h grows by 15–20 m. Old fluid boils at around 150 °C.",
    },
    facts: [
      { ru: "Педаль стала мягкой — в системе воздух или течёт тормозная жидкость; ехать нельзя.", en: "A spongy pedal means air or a fluid leak; do not drive." },
      { ru: "Руль тянет в сторону при торможении — заклинивший суппорт или неравномерный износ колодок.", en: "Pulling to one side under braking means a sticking caliper or uneven pads." },
      { ru: "ABS не сокращает тормозной путь на сухом асфальте — он сохраняет рулевое управление.", en: "ABS does not shorten dry-asphalt stops; it preserves steering control." },
    ],
  },
  {
    id: "wheels",
    accent: "#38BDF8",
    title: { ru: "Колёса и шины", en: "Wheels and tyres" },
    subtitle: { ru: "205/55 R16 · давление 2,2 бар", en: "205/55 R16 · 2.2 bar" },
    note: {
      ru: "Пятно контакта размером с ладонь передаёт всё: разгон, торможение и поворот. Рисунок отводит воду, давление распределяет нагрузку по площади.",
      en: "A palm-sized contact patch carries everything: acceleration, braking and cornering. Tread clears water, pressure spreads the load.",
    },
    resource: {
      ru: "Протектор — 1,6 мм по закону, 3 мм для мокрой дороги; давление проверять на холодных шинах раз в месяц; балансировка — после удара.",
      en: "Tread: 1.6 mm legal, 3 mm for wet roads; pressure monthly on cold tyres; rebalance after an impact.",
    },
    failure: {
      ru: "Лысая шина на мокром асфальте аквапланирует уже при 80 км/ч. Недокачанные колёса греются и разрушаются на трассе.",
      en: "A bald tyre aquaplanes at 80 km/h in the wet. Under-inflation overheats and destroys a tyre at speed.",
    },
    facts: [
      { ru: "Давление падает на 0,1 бар при снижении температуры на 10 °C — зимой проверяйте чаще.", en: "Pressure drops 0.1 bar per 10 °C of cooling — check more often in winter." },
      { ru: "Разный рисунок на одной оси ухудшает устойчивость при торможении.", en: "Mismatched tread on one axle hurts stability under braking." },
      { ru: "Грыжа на боковине — не ремонтируется: только замена колеса.", en: "A sidewall bulge cannot be repaired: replace the tyre." },
    ],
  },
  {
    id: "suspension",
    accent: "#C084FC",
    title: { ru: "Подвеска", en: "Suspension" },
    subtitle: { ru: "МакФерсон · стабилизатор", en: "MacPherson · anti-roll bar" },
    note: {
      ru: "Пружина принимает неровности, амортизатор гасит колебания, рычаги удерживают колесо в нужной плоскости. Без демпфирования колесо прыгает и теряет контакт.",
      en: "The spring absorbs bumps, the damper kills the oscillation, and the arms hold the wheel in plane. Without damping the wheel hops and loses contact.",
    },
    resource: {
      ru: "Амортизаторы — 80 000–120 000 км; сайлентблоки и шаровые — по люфту; развал-схождение — после удара или замены рычагов.",
      en: "Dampers 80,000–120,000 km; bushings and ball joints by play; alignment after an impact or arm replacement.",
    },
    failure: {
      ru: "Убитый амортизатор увеличивает тормозной путь на неровной дороге до 30% и съедает внутреннюю кромку шины.",
      en: "A dead damper can add up to 30% to braking distance on broken pavement and chews the inner tyre edge.",
    },
    facts: [
      { ru: "Раскачивание кузова после лежачего полицейского больше одного цикла — амортизатор устал.", en: "More than one body oscillation after a speed bump means a tired damper." },
      { ru: "Стук на мелких неровностях часто даёт стойка стабилизатора, а не сама подвеска.", en: "A rattle over small bumps is often an anti-roll link, not the suspension itself." },
      { ru: "После замены рычага развал обязателен: иначе шина сотрётся за сезон.", en: "Alignment is mandatory after an arm replacement, or a tyre can wear out in one season." },
    ],
  },
  {
    id: "cabin",
    accent: "#4ADE80",
    title: { ru: "Салон и безопасность", en: "Cabin and safety" },
    subtitle: { ru: "Ремни · подушки · каркас", en: "Belts · airbags · safety cell" },
    note: {
      ru: "Ремень удерживает тело, преднатяжитель убирает слабину, подушка принимает голову. Зоны деформации сминаются, а силовая клетка сохраняет пространство для людей.",
      en: "The belt restrains the body, a pretensioner removes slack, the airbag catches the head. Crumple zones deform while the safety cell holds the occupant space.",
    },
    resource: {
      ru: "Ремни и замки — проверка при каждом ТО; подушки — 10–15 лет по регламенту; подголовник — на уровне макушки.",
      en: "Belts and buckles at every service; airbags 10–15 years per schedule; head restraint level with the crown.",
    },
    failure: {
      ru: "Непристёгнутый пассажир на заднем сиденье — снаряд для передних: риск гибели вырастает в 3–4 раза. Подушка без ремня травмирует сильнее.",
      en: "An unbelted rear passenger becomes a projectile for those in front: fatality risk rises 3–4×. An airbag without a belt injures more.",
    },
    facts: [
      { ru: "Подушка раскрывается за 20–30 мс: быстрее, чем человек успевает моргнуть.", en: "An airbag inflates in 20–30 ms: faster than a blink." },
      { ru: "Детское кресло назад — до 4 лет и 105 см: шея ребёнка не держит удар.", en: "Rear-facing child seats until 4 years and 105 cm: a child's neck cannot take the load." },
      { ru: "Трещина на лобовом в зоне водителя — повод заменить стекло, а не ремонтировать.", en: "A crack in the driver's sightline means replacement, not repair." },
    ],
  },
];

export const VEHICLE_BY_ID = Object.fromEntries(
  VEHICLE_PARTS.map((part) => [part.id, part])
);
