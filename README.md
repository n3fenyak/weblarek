# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

В проекте используются данные, которые описывают сущности интернет-магазина. Для работы с данными используются интерфейсы TypeScript, которые определяют структуру объектов и применяются в моделях данных.

### Интерфейс IProduct

Интерфейс описывает товар, который находится в каталоге и доступен для добавления в корзину

```ts
interface IProduct {
  id: string
  title: string
  image: string
  category: string
  price: number | null
  description: string
}
```

Поля интерфейса: id: string — уникальный идентификатор товара; title: string — название товара; image: string — ссылка на изображение товара; category: string — категория товара; price: number | null — цена товара, null, если цена отсутствует; description: string — описание товара

### Интерфейс IBuyer

Интерфейс описывает данные покупателя, необходимые для оформления заказа

```ts
interface IBuyer {
  payment: TPayment
  address: string
  email: string
  phone: string
}
```

Поля интерфейса: payment: TPayment — выбранный способ оплаты; address: string — адрес доставки; email: string — электронная почта покупателя; phone: string — номер телефона покупателя

## Модели данных

### Класс Products

Класс отвечает за хранение и управление данными о товарах
Конструктор не принимает параметров

`products: IProduct[]` - массив всех товаров
`previewProduct: IProduct | null` - выбранный товар

Методы:
` setProducts(products: IProduct[]): void` — сохраняет массив товаров, полученный с сервера
` getProducts(): IProduct[]` — возвращает массив товаров
` getProductById(id: string): IProduct | undefined` — возвращает товар по его ID
` setPreviewProduct(product: IProduct): void` — сохраняет товар для просмотра
` getPreviewProduct(): IProduct | null` — возвращает товар, выбранный для просмотра

### Класс Basket

Класс отвечает за хранение товаров, добавленных пользователем в корзину
Конструктор класса не принимает параметров

`items: IProduct[]` - массив товаров, добавленных в корзину
`previewProduct: IProduct | null` - выбранный товар

Методы:
` getItems(): IProduct[]` — возвращает массив товаров, которые в корзине
` addItem(product: IProduct): void` — добавляет товар в корзину
` removeItem(product: IProduct): void` — удаляет товар из корзины
` clear(): void` — очистка корзины
` getTotalPrice(): number` — возвращает общую стоимость товаров в корзине
` getItemsCount(): number` — возвращает количество товаров в корзине
` hasItem(id: string): boolean` - проверка наличия товара в корзине по ID

### Класс Buyer

Класс отвечает за хранение и валидацию данных покупателя
Конструктор класса не принимает параметров

` payment: TPayment | null` — вид оплаты
` address: string` — адрес
` email: string` — email
` phone: string` — телефон

Методы:
`setData(data: Partial): void` — сохраняет данные покупателя
`getData(): IBuyer` — возвращает данные покупателя
`clear(): void` — очищает данные покупателя
`validate(): Partial<Record<keyof IBuyer, string>>` — валидация данных

Пример результата валидации:
`{ payment: 'Не выбран вид оплаты', email: 'Укажите email' }`

### Тип TPayment

Тип описывает способы оплаты заказа

```ts
type TPayment = 'card' | 'cash'
```

### Тип IErrorBuyer

Тип описывает объект ошибок валидации данных покупателя.

```ts
type IErrorBuyer = Partial<Record<keyof IBuyer, string>>
```

Ключами объекта являются поля покупателя, значениями — текст ошибки

### Интерфейс IProductsResponse

Интерфейс описывает объект, который приложение получает от сервера при запросе списка товаров.

```ts
interface IProductsResponse {
  total: number
  items: IProduct[]
}
```

## Слой коммуникации

Отвечает за взаимодействие приложения с сервером

### Класс WebLarekApi

Класс отвечает за взаимодействие приложения с сервером API интернет-магазина. Основная задача — использовать методы get и post

Конструктор:
`constructor(api: IApi)`
`api: IApi` — объект API, который используется для выполнения запросов

Методы:
`getProducts(): Promise<IProduct[]>` - выполняет GET-запрос на эндпоинт `/product/` и возвращает массив товаров
`createOrder(order: IOrder): Promise<IOrderResult>` - выполняет POST-запрос на эндпоинт `/order/` и отправляет данные заказа на сервер.

Возвращает объект с подтверждением заказа и суммой покупки

## Слой Views

### Интерфейс IHeader

Назначение: Класс отвечает за отображение шапки сайта, включая иконку корзины и счетчик товаров.

Конструктор:
`constructor(events: IEvents, container: HTMLElement)`

IEvents — брокер событий для взаимодействия с приложением. container: HTMLElement — HTML-элемент, в котором рендерится шапка.

Поля: counterElement: HTMLElement — DOM-элемент для отображения количества товаров. basketButton: HTMLButtonElement — кнопка открытия корзины.

Методы: set counter(value: number) — обновляет отображаемое количество товаров в шапке

## Gallery

### Интерфейс IGallery

interface IGallery { catalog: HTMLElement[]; // Массив элементов карточек каталога }

Назначение: Класс отвечает за отображение каталога товаров на странице.

Конструктор:
`constructor(events: IEvents, container: HTMLElement)`

events: IEvents — брокер событий. container: HTMLElement — контейнер для галереи.

Поля: нет дополнительных полей, используется container из Component.

Методы: set catalog(items: HTMLElement[]) — заменяет содержимое галереи на новые карточки товаров.

## Modal

### Интерфейс IModal

interface IModal { content: HTMLElement; // Содержимое модального окна }

Назначение: Класс управляет модальными окнами, включая показ и скрытие.

Конструктор: constructor(events: IEvents, container: HTMLElement)

events: IEvents — брокер событий. container: HTMLElement — контейнер модального окна.

Поля: modalContainer: HTMLElement — корневой контейнер модального окна. modalContent: HTMLElement — контейнер для динамического контента. modalButton: HTMLButtonElement — кнопка закрытия модального окна.

Методы : show(): void — открывает модальное окно и блокирует прокрутку страницы. hide(): void — закрывает окно и разблокирует прокрутку. set content(element: HTMLElement) — устанавливает содержимое окна.

## BasketView

### Интерфейс IBasketView

interface IBasketView { items: HTMLElement[]; // Список товаров в корзине total: number; // Общая стоимость disabled: boolean; // Флаг блокировки кнопки оформления }

Назначение: Отвечает за визуальное отображение корзины товаров и управление кнопкой оформления заказа.

Конструктор: constructor(container: HTMLElement, events: IEvents)

container: HTMLElement — контейнер для корзины. events: IEvents — брокер событий.

Поля: basketList: HTMLElement — список элементов корзины. totalPrice: HTMLElement — элемент для отображения суммы. basketButton: HTMLButtonElement — кнопка оформления заказа. emptyText: HTMLElement — текст для пустой корзины.

Методы: set items(items: HTMLElement[]) — обновляет список товаров. set total(value: number) — обновляет общую стоимость корзины. set disabled(value: boolean) — блокирует/разблокирует кнопку оформления.

## SuccessView

### Интерфейс ISuccessView

interface ISuccessView { total: number; // Сумма, списанная за заказ }

Назначение: Отображает сообщение об успешном оформлении заказа.

Конструктор: constructor(container: HTMLElement, events: IEvents)

container: HTMLElement — контейнер для успешного уведомления. events: IEvents — брокер событий.

Поля: description: HTMLElement — элемент для текста уведомления. successButton: HTMLButtonElement — кнопка закрытия окна.

Методы: set total(value: number) — отображает списанную сумму.

## Card

### Интерфейс ICard

interface ICard { title: string; price: string; }

Назначение: Базовый класс для карточек товаров (каталог, просмотр, корзина).

Конструктор: constructor(container: HTMLElement)

container: HTMLElement — контейнер карточки.

Поля: titleCard: HTMLElement — элемент для заголовка. priceCard: HTMLElement — элемент для цены.

Методы: set title(value: string) — обновляет заголовок. set price(value: string) — обновляет цену.

## CardCatalog

## Интерфейс ICardCatalog

interface ICardCatalog extends ICard { category: string; image: string; }

Назначение: Отображает карточку товара в каталоге. При клике вызывает переданную функцию (обычно используется для открытия превью).

Конструктор: constructor(container: HTMLElement, onClick: () => void)

container: HTMLElement — контейнер карточки. onClick — callback, вызываемый при клике на карточку.

Поля: imageCard: HTMLImageElement — изображение товара (.card**image) categoryCard: HTMLElement — элемент категории (.card**category) onClick: () => void — обработчик клика по карточке

Методы: set category(value: string) — устанавливает текст категории и применяет CSS-модификатор из categoryMap. set image(src: string) — устанавливает источник изображения. render(data?: Partial): HTMLElement Рендерит карточку и обновляет category и image при передаче данных

## CardPreview

### Интерфейс ICardPreview

interface ICardPreview extends ICard { category: string; image: string; text: string; inBasket: boolean; available: boolean; }

Назначение: Карточка полного просмотра товара. Позволяет добавить товар в корзину или удалить из неё.

Конструктор: constructor(container: HTMLElement, onAction: () => void)

container: HTMLElement — контейнер карточки. onAction — callback, вызываемый при нажатии на кнопку действия.

Поля: imageCard: HTMLImageElement — изображение товара categoryCard: HTMLElement — категория textCard: HTMLElement — описание товара (.card**text) buttonCard: HTMLButtonElement — кнопка действия (.card**button) onAction: () => void — обработчик клика по кнопке

Методы: set category(value: string) — обновляет категорию и CSS-класс. set image(src: string) — обновляет изображение. set text(value: string) — обновляет описание. set available(value: boolean) — влючает/выключает кнопку. Если товар недоступен — кнопка блокируется и получает текст "Недоступно". set inBasket(value: boolean) — меняет текст кнопки: "Удалить из корзины" — если товар уже в корзине "Купить" — если товара нет в корзине Не изменяется, если кнопка disabled. render(data?: Partial): HTMLElement Обновляет карточку данными и возвращает контейнер.

## CardBasket

### Интерфейс ICardBasket

interface ICardBasket extends ICard { index: number; } Назначение: Отображает товар внутри корзины. Позволяет удалить товар из корзины.

Конструктор: constructor(container: HTMLElement, onClick: () => void)

container: HTMLElement — контейнер карточки. onClick — callback, вызываемый при клике на кнопку в карточке.

Поля класса: indexElement: HTMLElement — элемент позиции в корзине (.basket**item-index) button: HTMLButtonElement — кнопка удаления (.card**button) onClick: () => void — обработчик клика по кнопки в карточке

Методы: set index(value: number) — устанавливает порядковый номер товара в корзине.

## Form

### Интерфейс IForm

export interface IForm { valid: boolean; // Флаг валидности формы errors: string; // Строка с сообщениями об ошибках }

Назначение: Базовый класс для всех форм приложения. Отвечает за: привязку HTML-формы к компоненту, управление кнопкой отправки (активация/деактивация), отображение ошибок в форме, генерацию событий при вводе данных и отправке формы.

Конструктор: constructor(container: HTMLElement, events: IEvents)

container: HTMLElement — контейнер формы, может быть

или любой другой элемент-шаблон. events: IEvents — брокер событий для взаимодействия с остальной частью приложения.
Поля класса: form: HTMLFormElement — HTML-форма, привязанная к компоненту. submitButton: HTMLButtonElement — кнопка отправки формы. errorContainer: HTMLElement — контейнер для вывода ошибок формы. submitEvent: string — имя события, которое генерируется при отправке формы.

Методы и свойства класса: set valid(value: boolean) — включает или отключает кнопку отправки формы. value: boolean — true означает, что форма валидна и кнопку можно нажимать. set errors(value: string) — устанавливает текст ошибки в форме. value: string — текст ошибок, которые будут показаны пользователю.

## OrderForm

### Интерфейс IOrderForm

interface IOrderForm extends IForm { address: string; // Адрес доставки товара payment: string; // Выбранный способ оплаты }

Назначение: Класс управляет формой оформления заказа: выбором способа оплаты и вводом адреса. Обеспечивает генерацию событий при изменении данных и выборе оплаты.

Конструктор: constructor(container: HTMLElement, events: IEvents)

container: HTMLElement — контейнер формы (обычно шаблон формы). events: IEvents — брокер событий для взаимодействия с остальной частью приложения.

Поля: paymentContainer: HTMLElement — контейнер для кнопок выбора способа оплаты. paymentButtons: NodeListOf — кнопки внутри контейнера оплаты. addressInput: HTMLInputElement — поле ввода адреса. submitEvent = 'order:submit' — событие отправки формы (переход к следующему шагу).

Методы: set payment(value: string) — подсвечивает выбранную кнопку оплаты. set address(value: string) — устанавливает значение поля адреса.

## ContactsForm

### Интерфейс IContactsForm

interface IContactsForm extends IForm { email: string; // Адрес электронной почты покупателя phone: string; // Телефон покупателя }

Назначение: Класс управляет формой контактных данных покупателя. Отвечает за обработку ввода email и телефона, а также за генерацию событий для обновления данных и отправки формы.

Конструктор: constructor(container: HTMLElement, events: IEvents)

container: HTMLElement — контейнер формы (шаблон формы контактов). events: IEvents — брокер событий для взаимодействия с приложением.

Поля: emailInput: HTMLInputElement — поле ввода email. phoneInput: HTMLInputElement — поле ввода телефона. submitEvent = 'contacts:submit' — событие отправки формы контактов.

Методы: set email(value: string) — обновляет значение поля email. set phone(value: string) — обновляет значение поля телефона.
