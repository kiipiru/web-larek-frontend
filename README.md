# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TypeScript, Webpack

## Описание проекта
Веб-ларек — это веб-приложение для онлайн-покупок, позволяющее пользователям просматривать каталог товаров, добавлять их в корзину, оформлять заказы и получать подтверждение покупки. Приложение построено по архитектуре MVP (Model-View-Presenter), обеспечивая четкое разделение логики представления, данных и взаимодействия.

## Структура проекта
- `src/` — исходные файлы проекта
- `src/components/` — папка с TypeScript-компонентами
- `src/components/base/` — папка с базовым кодом
- `src/scss/` — папка со стилями SCSS
- `src/utils/` — папка с утилитами и константами
- `src/types/` — папка с определениями типов

### Важные файлы
- `src/index.html` — HTML-файл главной страницы
- `src/index.ts` — точка входа приложения
- `src/types/index.ts` — файл с типами данных
- `src/scss/styles.scss` — корневой файл стилей
- `src/utils/constants.ts` — файл с константами
- `src/utils/utils.ts` — файл с утилитами

## Установка и запуск
Для установки и запуска проекта выполните следующие команды:

```bash
npm install
npm run start
```

или

```bash
yarn
yarn start
```

## Сборка
Для сборки проекта выполните:

```bash
npm run build
```

или

```bash
yarn build
```

## Данные и типы данных, используемые в приложении

### Товар (IItem)
```typescript
export interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: ItemCategories;
    price: number | null;
}
```

### Категории товаров (ItemCategories)
```typescript
export type ItemCategories = "софт-скил" | "другое" | "дополнительное" | "кнопка" | "хард-скил";
```

### Корзина (IBasket)
```typescript
export interface IBasket {
    items: Map<string, number>;
    addItem(id: string): void;
    deleteItem(id: string): void;
}
```

### Заказ (IOrder)
```typescript
export interface IOrder {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
    items: string[];
    total: number;
}
```

### Результат заказа (IOrderResult)
```typescript
export interface IOrderResult {
    id: string;
    total: number;
}
```

### Данные товаров (IItemsData)
```typescript
export interface IItemsData {
    items: IItem[];
    preview: string | null;
    totalCost: number | null;
    getItem(id: string): IItem;
}
```

### Способ оплаты (PaymentMethod)
```typescript
export type PaymentMethod = 'card' | 'cash';
```

## Архитектура приложения
Приложение построено по парадигме MVP:
- **Слой представления** — отвечает за отображение данных на странице.
- **Слой данных** — отвечает за хранение и управление данными.
- **Презентер** — обеспечивает взаимодействие между слоями представления и данных через брокер событий.

### Базовый код

#### Класс `Api`
Содержит базовую логику отправки HTTP-запросов.

**Конструктор:**
- `constructor(baseUrl: string, options: RequestInit = {})` - принимает базовый URL сервера для HTTP-запросов и глобальные опции для всех запросов (опционально).

**Поля:**
- `baseUrl: string` — Базовый URL сервера для запросов.
- `options: RequestInit` — Настройки запросов, включая заголовки.

**Методы:**
- `get(uri: string): Promise<object>`
  - **Параметры:** `uri: string` — endpoint для GET-запроса.
  - **Возвращает:** `Promise<object>` — промис с данными от сервера.
  - **Описание:** Выполняет GET-запрос к указанному endpoint.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>`
  - **Параметры:**
    - `uri: string` — endpoint для запроса.
    - `data: object` — данные для отправки в теле запроса.
    - `method: ApiPostMethods` — метод запроса ('POST', 'PUT', 'DELETE').
  - **Возвращает:** `Promise<object>` — промис с ответом сервера.
  - **Описание:** Выполняет запрос с указанным методом и данными в формате JSON.
  - `handleResponse(response: Response): Promise<object>`
  - **Параметры:**
    - `response: Response` — объект ответа, полученный из HTTP-запроса.
  - **Возвращает:** `Promise<object>` — промис с ответом сервера.
  - **Описание:** При успешном ответе разрешает промис с объектом JSON, а в случае ошибки отклоняет его и выводит соответствующее сообщение.


#### Класс `EventEmitter`
Брокер событий для генерации и обработки событий в системе.

**Конструктор:**
`constructor()` - не принимает параметров.

**Поля:**
- `_events: Map<EventName, Set<Subscriber>>` — Карта событий и их подписчиков.

**Методы:**
- `on<T extends object>(eventName: EventName, callback: (event: T) => void): void`
  - **Параметры:**
    - `eventName: EventName` — имя события или регулярное выражение.
    - `callback: (event: T) => void` — функция-обработчик.
  - **Возвращает:** `void`
  - **Описание:** Подписывает callback на указанное событие.
- `off(eventName: EventName, callback: Subscriber): void`
  - **Параметры:**
    - `eventName: EventName` — имя события.
    - `callback: Subscriber` — функция-обработчик для удаления.
  - **Возвращает:** `void`
  - **Описание:** Снимает обработчик с события.
- `emit<T extends object>(eventName: string, data?: T): void`
  - **Параметры:**
    - `eventName: string` — имя события.
    - `data?: T` — данные, передаваемые в обработчик.
  - **Возвращает:** `void`
  - **Описание:** Инициирует событие с указанными данными.
- `trigger<T extends object>(eventName: string, context?: Partial<T>): (data: T) => void`
  - **Параметры:**
    - `eventName: string` — имя события.
    - `context?: Partial<T>` — контекст для данных события.
  - **Возвращает:** `(data: T) => void` — функция-триггер для генерации события.
  - **Описание:** Создает функцию, которая инициирует событие при вызове.
- `onAll(callback: (event: EmitterEvent) => void): void`
  - **Параметры:**
    - `callback: (event: EmitterEvent) => void` — обработчик всех событий.
  - **Возвращает:** `void`
  - **Описание:** Подписывается на все события.
- `offAll(): void`
  - **Параметры:** Нет.
  - **Возвращает:** `void`
  - **Описание:** Сбрасывает все обработчики событий.

### Слой данных

#### Класс `ItemsData`
Отвечает за хранение и управление данными товаров.

**Конструктор:**
`constructor(data: Partial<IItemsData>, events: IEvents)` - принимает частичные данные модели товаров (соответствующие интерфейсу IItemsData) и экземпляр брокера событий (IEvents).

**Поля:**
- `_items: IItem[]` — Массив объектов товаров.
- `events: IEvents` — Экземпляр брокера событий для уведомления об изменениях.

**Методы:**
- `protected _changed(): void`
  - **Параметры:** Нет.
  - **Возвращает:** `void`
  - **Описание:** Инициирует событие `items:changed`.
- `set items(items: IItem[]): void`
  - **Параметры:** `items: IItem[]` — массив товаров.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает новый список товаров и применяет метод _changed `items:changed`.
- `get items(): IItem[]`
  - **Параметры:** Нет.
  - **Возвращает:** `IItem[]` — текущий массив товаров.
  - **Описание:** Возвращает список товаров.
- `getCard(id: string): IItem`
  - **Параметры:** `id: string` — идентификатор товара.
  - **Возвращает:** `IItem` — объект товара.
  - **Описание:** Возвращает товар по его ID.

#### Класс `ItemsBasket`
Управляет содержимым корзины покупок.

**Конструктор:**
`constructor(data: Partial<IBasket>, events: IEvents)` - принимает частичные данные модели корзины (соответствующие интерфейсу IBasket) и экземпляр брокера событий (IEvents).

**Поля:**
- `_items: Map<string, number>` — Карта товаров с количеством (ID товара и количество).
- `_totalPrice: number` — Общая стоимость товаров в корзине.
- `events: IEvents` — Экземпляр брокера событий.

**Методы:**
- `addItem(id: string): void`
  - **Параметры:** `id: string` — идентификатор товара.
  - **Возвращает:** `void`
  - **Описание:** Добавляет товар в корзину или увеличивает его количество, инициируя событие `basket:change`.
- `deleteItem(id: string): void`
  - **Параметры:** `id: string` — идентификатор товара.
  - **Возвращает:** `void`
  - **Описание:** Уменьшает количество товара в корзине или удаляет его, инициируя событие `basket:change`.
- `set items(items: Map<string, number>): void`
  - **Параметры:** `items: Map<string, number>` — новая карта товаров.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает содержимое корзины.
- `get items(): Map<string, number>`
  - **Параметры:** Нет.
  - **Возвращает:** `Map<string, number>` — текущая карта товаров.
  - **Описание:** Возвращает содержимое корзины.
- `set totalPrice(price: number): void`
  - **Параметры:** `price: number` — общая стоимость.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает общую стоимость корзины.
- `get totalPrice(): number`
  - **Параметры:** Нет.
  - **Возвращает:** `number` — текущая общая стоимость.
  - **Описание:** Возвращает общую стоимость корзины.

#### Класс `Order`
Управляет данными заказа.

**Конструктор:**
`constructor(data: Partial<IOrder>, events: IEvents)` - принимает частичные данные модели заказа (соответствующие интерфейсу IOrder) и экземпляр брокера событий (IEvents).

**Поля:**
- `_payment: PaymentMethod` — Способ оплаты (карта или наличные).
- `_email: string` — Email пользователя.
- `_phone: string` — Телефон пользователя.
- `_address: string` — Адрес доставки.
- `_items: string[]` — Список ID товаров в заказе.
- `_total: number` — Общая стоимость заказа.
- `events: IEvents` — Экземпляр брокера событий.

**Методы:**
- `set payment(value: PaymentMethod): void`
  - **Параметры:** `value: PaymentMethod` — способ оплаты.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает способ оплаты и инициирует событие `order:updated`.
- `set email(value: string): void`
  - **Параметры:** `value: string` — email пользователя.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает email и инициирует событие `order:updated`.
- `set phone(value: string): void`
  - **Параметры:** `value: string` — телефон пользователя.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает телефон и инициирует событие `order:updated`.
- `set address(value: string): void`
  - **Параметры:** `value: string` — адрес доставки.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает адрес и инициирует событие `order:updated`.
- `set items(value: string[]): void`
  - **Параметры:** `value: string[]` — список ID товаров.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает товары в заказе и инициирует событие `order:updated`.
- `set total(value: number): void`
  - **Параметры:** `value: number` — общая стоимость.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает общую стоимость заказа.
- `get payment(): PaymentMethod`
  - **Параметры:** Нет.
  - **Возвращает:** `PaymentMethod` — текущий способ оплаты.
  - **Описание:** Возвращает способ оплаты.
- `get email(): string`
  - **Параметры:** Нет.
  - **Возвращает:** `string` — текущий email.
  - **Описание:** Возвращает email пользователя.
- `get phone(): string`
  - **Параметры:** Нет.
  - **Возвращает:** `string` — текущий телефон.
  - **Описание:** Возвращает телефон пользователя.
- `get address(): string`
  - **Параметры:** Нет.
  - **Возвращает:** `string` — текущий адрес.
  - **Описание:** Возвращает адрес доставки.
- `get items(): string[]`
  - **Параметры:** Нет.
  - **Возвращает:** `string[]` — список ID товаров.
  - **Описание:** Возвращает товары в заказе.
- `get total(): number`
  - **Параметры:** Нет.
  - **Возвращает:** `number` — общая стоимость.
  - **Описание:** Возвращает общую стоимость заказа.
- `makeOrder(): IOrder | null`
  - **Параметры:** Нет.
  - **Возвращает:** `IOrder | null` — объект заказа или null, если данные невалидны.
  - **Описание:** Формирует объект заказа для отправки на сервер.

### Классы представления

#### Класс `Component<T>`
Базовый класс для компонентов представления, работающих с DOM.

**Конструктор:**
`constructor(container: HTMLElement)` - принимает корневой DOM-элемент, с которым будет работать компонент.

**Поля:**
- `container: HTMLElement` — Корневой DOM-элемент компонента.

**Методы:**
- `toggleClass(element: HTMLElement, className: string, force?: boolean): void`
  - **Параметры:**
    - `element: HTMLElement` — целевой элемент.
    - `className: string` — имя CSS-класса.
    - `force?: boolean` — принудительное добавление/удаление класса.
  - **Возвращает:** `void`
  - **Описание:** Переключает CSS-класс на элементе.
- `setText(element: HTMLElement, value: unknown): void`
  - **Параметры:**
    - `element: HTMLElement` — целевой элемент.
    - `value: unknown` — текст для установки.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает текстовое содержимое элемента.
- `setDisabled(element: HTMLElement, state: boolean): void`
  - **Параметры:**
    - `element: HTMLElement` — целевой элемент.
    - `state: boolean` — статус блокировки.
  - **Возвращает:** `void`
  - **Описание:** Блокирует или разблокирует элемент.
- `setHidden(element: HTMLElement): void`
  - **Параметры:** `element: HTMLElement` — целевой элемент.
  - **Возвращает:** `void`
  - **Описание:** Скрывает элемент.
- `setVisible(element: HTMLElement): void`
  - **Параметры:** `element: HTMLElement` — целевой элемент.
  - **Возвращает:** `void`
  - **Описание:** Показывает элемент.
- `setImage(element: HTMLImageElement, src: string, alt?: string): void`
  - **Параметры:**
    - `element: HTMLImageElement` — элемент изображения.
    - `src: string` — URL изображения.
    - `alt?: string` — альтернативный текст.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает изображение и alt-текст.
- `render(data?: Partial<T>): HTMLElement`
  - **Параметры:** `data?: Partial<T>` — данные для рендеринга.
  - **Возвращает:** `HTMLElement` — корневой элемент компонента.
  - **Описание:** Обновляет компонент с новыми данными и возвращает контейнер.

#### Класс `Modal<T>`
Базовый класс для модальных окон.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents, modalContent: HTMLElement)` - принимает корневой DOM-элемент модального окна, экземпляр брокера событий (IEvents) и DOM-элемент содержимого модального окна.

**Поля:**
- `modal: HTMLElement` — Элемент модального окна.
- `events: IEvents` — Экземпляр брокера событий.
- `modalContentContainer: HTMLElement` — Контейнер для содержимого модального окна.
- `modalContent: HTMLElement` — Содержимое модального окна.

**Методы:**
- `open(): void`
  - **Параметры:** Нет.
  - **Возвращает:** `void`
  - **Описание:** Открывает модальное окно и инициирует событие `modal:open`.
- `close(): void`
  - **Параметры:** Нет.
  - **Возвращает:** `void`
  - **Описание:** Закрывает модальное окно и инициирует событие `modal:close`.
- `handleEscUp(evt: KeyboardEvent): void`
  - **Параметры:** `evt: KeyboardEvent` — событие клавиатуры.
  - **Возвращает:** `void`
  - **Описание:** Закрывает модальное окно при нажатии Esc.
- `render(data?: Partial<T>): HTMLElement`
  - **Параметры:** `data?: Partial<T>` — данные для рендеринга.
  - **Возвращает:** `HTMLElement` — контейнер модального окна.
  - **Описание:** Открывает модальное окно и рендерит содержимое.

#### Класс `ModalWithItem`
Модальное окно для отображения информации о товаре.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents, cardTemplate: HTMLElement)` - принимает корневой DOM-элемент модального окна для отображения информации о товаре, экземпляр брокера событий (IEvents) и DOM-элемент шаблона содержимого с информацией о товаре.

**Поля:**
- `_itemImage: HTMLImageElement` — Элемент изображения товара.
- `_itemCategory: HTMLSpanElement` — Элемент категории товара.
- `_itemTitle: HTMLElement` — Элемент заголовка товара.
- `_itemDescription: HTMLElement` — Элемент описания товара.
- `_itemPrice: HTMLSpanElement` — Элемент цены товара.
- `_basketButton: HTMLButtonElement` — Кнопка добавления/удаления из корзины.
- `itemId: string` — Идентификатор товара.

**Методы:**
- `set image(img: string): void`
  - **Параметры:** `img: string` — URL изображения.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает изображение товара.
- `set category(category: ItemCategories): void`
  - **Параметры:** `category: ItemCategories` — категория товара.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает категорию и соответствующий CSS-класс.
- `set title(title: string): void`
  - **Параметры:** `title: string` — заголовок товара.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает заголовок и alt-текст изображения.
- `set description(description: string): void`
  - **Параметры:** `description: string` — описание товара.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает описание товара.
- `set price(price: number | null): void`
  - **Параметры:** `price: number | null` — цена товара.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает цену и управляет активностью кнопки корзины.
- `set id(id: string): void`
  - **Параметры:** `id: string` — идентификатор товара.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает ID товара.
- `set basketButtonText(text: string): void`
  - **Параметры:** `text: string` — текст для кнопки.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает в карточке с товаром.
- `get id(): string`
  - **Параметры:** Нет.
  - **Возвращает:** `string` — идентификатор товара.
  - **Описание:** Возвращает ID товара.

#### Класс `ModalWithBasket`
Модальное окно для отображения корзины.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents, basketTemplate: HTMLElement, cardInBasketTemplate: HTMLElement)` - принимает корневой DOM-элемент модального окна корзины, экземпляр брокера событий (IEvents), DOM-элемент шаблона содержимого корзины и DOM-элемент шаблона карточки товара в корзине.

**Поля:**
- `_cardInBasketTemplate: HTMLElement` — Шаблон для элемента товара в корзине.
- `_cardBasketList: HTMLElement` — Список товаров в корзине.
- `_itemIndex: HTMLSpanElement` — Элемент индекса товара.
- `_itemTitle: HTMLSpanElement` — Элемент заголовка товара.
- `_itemPrice: HTMLSpanElement` — Элемент цены товара.
- `_itemDeleteButton: HTMLButtonElement` — Кнопка удаления товара.
- `_basketList: HTMLUListElement` — Список товаров в корзине.
- `_orderButton: HTMLButtonElement` — Кнопка оформления заказа.
- `_basketPrice: HTMLSpanElement` — Элемент общей стоимости.
- `_items: IItem[]` — Массив товаров в корзине.

**Методы:**
- `set items(items: IItem[]): void`
  - **Параметры:** `items: IItem[]` — массив товаров.
  - **Возвращает:** `void`
  - **Описание:** Рендерит список товаров в корзине.
- `disableOrderButton(state: boolean)`
  - **Параметры:** `state: boolean` — требуемое состояние кнопки.
  - **Возвращает:** `void`
  - **Описание:** Активирует и деактивирует кнопку оформления заказа.
- `handleTotalPrice(totalPrice: number | null): void`
  - **Параметры:** `totalPrice: number | null` — общая стоимость.
  - **Возвращает:** `void`
  - **Описание:** Обновляет отображение общей стоимости и состояние кнопки заказа.
- `createBasketItem(item: IItem, index: number): HTMLElement`
  - **Параметры:**
    - `item: IItem` — объект товара.
    - `index: number` — порядковый номер.
  - **Возвращает:** `HTMLElement` — элемент товара в корзине.
  - **Описание:** Создает DOM-элемент для товара в корзине.
- `removeBasketItem(id: string): void`
  - **Параметры:** `id: string` — идентификатор товара.
  - **Возвращает:** `void`
  - **Описание:** Удаляет товар из корзины и обновляет индексы.

#### Класс `ModalWithOrder`
Модальное окно для ввода способа оплаты и адреса.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents, orderTemplate: HTMLElement)` - принимает корневой DOM-элемент модального окна оформления заказа, экземпляр брокера событий (IEvents) и DOM-элемент шаблона содержимого оформления заказа.

**Поля:**
- `_paymentMethod: PaymentMethod` — Текущий способ оплаты.
- `_paymentByCardButton: HTMLButtonElement` — Кнопка оплаты картой.
- `_paymentByCashButton: HTMLButtonElement` — Кнопка оплаты наличными.
- `_paymentOptionsButtons: HTMLButtonElement[]` — Массив кнопок выбора оплаты.
- `_addressInput: HTMLInputElement` — Поле ввода адреса.
- `_proceedButton: HTMLButtonElement` — Кнопка продолжения.
- `_orderDataForm: HTMLFormElement` — Форма заказа.
- `_errorSpan: HTMLSpanElement` — Элемент для отображения ошибок.

**Методы:**
- `set errorSpan(text: string): void`
  - **Параметры:** `text: string` — текст ошибки.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает текст ошибки.
- `set payment(paymentMethod: PaymentMethod): void`
  - **Параметры:** `paymentMethod: PaymentMethod` — способ оплаты.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает способ оплаты.
- `get payment(): PaymentMethod`
  - **Параметры:** Нет.
  - **Возвращает:** `PaymentMethod` — текущий способ оплаты.
  - **Описание:** Возвращает способ оплаты.
- `get paymentOptionButtons(): HTMLButtonElement[]`
  - **Параметры:** Нет.
  - **Возвращает:** `HTMLButtonElement[]` — массив кнопок оплаты.
  - **Описание:** Возвращает кнопки выбора оплаты.
- `get proceedButton(): HTMLButtonElement`
  - **Параметры:** Нет.
  - **Возвращает:** `HTMLButtonElement` — кнопка продолжения.
  - **Описание:** Возвращает кнопку продолжения.
- `disableProceedButton(state: boolean)`
  - **Параметры:** `state: boolean` — требуемое состояние кнопки.
  - **Возвращает:** `void`
  - **Описание:** Активирует и деактивирует кнопку "далее".
- `addActiveClass(button: HTMLButtonElement): void`
  - **Параметры:** `button: HTMLButtonElement` — целевая кнопка.
  - **Возвращает:** `void`
  - **Описание:** Добавляет активный CSS-класс кнопке.
- `removeActiveClass(button: HTMLElement): void`
  - **Параметры:** `button: HTMLElement` — целевая кнопка.
  - **Возвращает:** `void`
  - **Описание:** Удаляет активный CSS-класс с кнопки.

#### Класс `ModalWithContactInfo`
Модальное окно для ввода контактных данных.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents, orderTemplate: HTMLElement)` - принимает корневой DOM-элемент модального окна для ввода контактных данных, экземпляр брокера событий (IEvents) и DOM-элемент шаблона содержимого контактных данных.

**Поля:**
- `_emailInput: HTMLInputElement` — Поле ввода email.
- `_phoneInput: HTMLInputElement` — Поле ввода телефона.
- `_submitOrderButton: HTMLButtonElement` — Кнопка отправки заказа.
- `_errorSpan: HTMLSpanElement` — Элемент для отображения ошибок.

**Методы:**
- `get submitOrderButton(): HTMLButtonElement`
  - **Параметры:** Нет.
  - **Возвращает:** `HTMLButtonElement` — кнопка отправки заказа.
  - **Описание:** Возвращает кнопку отправки заказа.
- `set errorSpan(text: string): void`
  - **Параметры:** `text: string` — текст ошибки.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает текст ошибки.
  - `disableSubmitOrderButton(state: boolean)`
  - **Параметры:** `state: boolean` — требуемое состояние кнопки.
  - **Возвращает:** `void`
  - **Описание:** Активирует и деактивирует кнопку "оплатить".

#### Класс `ModalWithSuccess`
Модальное окно для подтверждения успешного заказа.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents, successTemplate: HTMLElement)` - принимает корневой DOM-элемент модального окна успешного заказа, экземпляр брокера событий (IEvents) и DOM-элемент шаблона содержимого успешного заказа.

**Поля:**
- `_totalPrice: HTMLElement` — Элемент для отображения суммы списания.
- `_orderCloseButton: HTMLButtonElement` — Кнопка закрытия.

**Методы:**
- `set total(price: number): void`
  - **Параметры:** `price: number` — сумма списания.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает текст с суммой списания.

#### Класс `ItemCard`
Компонент для отображения карточки товара.

**Поля:**
- `events: IEvents` — Экземпляр брокера событий.
- `_category: HTMLSpanElement` — Элемент категории товара.
- `_title: HTMLElement` — Элемент заголовка товара.
- `_image: HTMLImageElement` — Элемент изображения товара.
- `_price: HTMLSpanElement` — Элемент цены товара.
- `itemId: string` — Идентификатор товара.

**Методы:**
- `set id(id: string): void`
  - **Параметры:** `id: string` — идентификатор товара.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает ID товара.
- `get id(): string`
  - **Параметры:** Нет.
  - **Возвращает:** `string` — идентификатор товара.
  - **Описание:** Возвращает ID товара.
- `set category(category: ItemCategories): void`
  - **Параметры:** `category: ItemCategories` — категория товара.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает категорию и CSS-класс.
- `set title(title: string): void`
  - **Параметры:** `title: string` — заголовок товара.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает заголовок и alt-текст изображения.
- `set image(imageUrl: string): void`
  - **Параметры:** `imageUrl: string` — URL изображения.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает изображение товара.
- `set price(price: number | null): void`
  - **Параметры:** `price: number | null` — цена товара.
  - **Возвращает:** `void`
  - **Описание:** Устанавливает цену товара.

#### Класс `Page`
Компонент для управления основной страницей.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents)` - принимает корневой DOM-элемент основной страницы и экземпляр брокера событий (IEvents).

**Поля:**
- `_counter: HTMLElement` — Элемент счетчика корзины.
- `_catalog: HTMLElement` — Контейнер каталога товаров.
- `_wrapper: HTMLElement` — Основной контейнер страницы.
- `_basket: HTMLElement` — Кнопка открытия корзины.
- `events: IEvents` — Экземпляр брокера событий.

**Методы:**
- `set counter(value: number): void`
  - **Параметры:** `value: number` — количество товаров в корзине.
  - **Возвращает:** `void`
  - **Описание:** Обновляет счетчик корзины.
- `set catalog(items: HTMLElement[]): void`
  - **Параметры:** `items: HTMLElement[]` — массив элементов каталога.
  - **Возвращает:** `void`
  - **Описание:** Рендерит каталог товаров.
- `set locked(value: boolean): void`
  - **Параметры:** `value: boolean` — статус блокировки.
  - **Возвращает:** `void`
  - **Описание:** Блокирует или разблокирует страницу.

### Слой коммуникации

#### Класс `LarekApi`
Расширяет класс `Api` для взаимодействия с сервером.

**Конструктор:**
`constructor(cdn: string, baseUrl: string, options: RequestInit = {})` - принимает базовый URL для загрузки изображений (CDN), базовый URL сервера для HTTP-запросов и глобальные опции для всех запросов (опционально).

**Поля:**
- `cdn: string` — Базовый URL для изображений.
- `baseUrl: string` — Базовый URL сервера.
- `options: RequestInit` — Настройки запросов.

**Методы:**
- `getItems(): Promise<IItem[]>`
  - **Параметры:** Нет.
  - **Возвращает:** `Promise<IItem[]>` — промис с массивом товаров.
  - **Описание:** Получает список товаров с сервера.
- `sendOrder(order: IOrder): Promise<IOrderResult>`
  - **Параметры:** `order: IOrder` — данные заказа.
  - **Возвращает:** `Promise<IOrderResult>` — промис с результатом заказа.
  - **Описание:** Отправляет заказ на сервер.

## Взаимодействие компонентов
Взаимодействие организовано через брокер событий (`EventEmitter`) в файле `index.ts`, который выступает в роли презентера. Экземпляры классов создаются в `index.ts`, где также настраиваются обработчики событий.

### Список событий
- **События изменения данных**:
  - `items:changed` — Изменение списка товаров.
  - `basket:change` — Изменение содержимого корзины.
  - `order:updated` — Обновление данных заказа.
- **События интерфейса**:
  - `item:select` — Выбор товара для просмотра.
  - `basketButton:click` — Добавление/удаление товара в корзине.
  - `bids:open` — Открытие корзины.
  - `orderbutton:clicked` — Переход к оформлению заказа.
  - `paymentmethod:set` — Выбор способа оплаты.
  - `address:input` — Ввод адреса.
  - `email:input` — Ввод email.
  - `phone:input` — Ввод телефона.
  - `orderData:received` — Переход к вводу контактных данных.
  - `order:submited` — Отправка заказа.
  - `order:close` — Закрытие окна успешного заказа.
  - `basketitem:deleted` — Удаление товара из корзины.
  - `modal:open` — Открытие модального окна.
  - `modal:close` — Закрытие модального окна.
  - `page:initialized` — Инициализация страницы.
  - `initialData:loaded` — Загрузка начальных данных.