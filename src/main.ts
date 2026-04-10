import { Products } from './components/Models/Products'
import { Basket } from './components/Models/Basket'
import { Buyer } from './components/Models/Buyer'

import { Api } from './components/base/Api'
import { EventEmitter } from './components/base/Events'

import { API_URL } from './utils/constants'
import { cloneTemplate } from './utils/utils'

import { IProduct, TPayment, IBuyer, IOrder } from './types'

import { WebLarekApi } from './components/Communicate/WebLarekApi'

import { CardCatalog } from './components/Views/Card/CardCatalog'
import { CardPreview } from './components/Views/Card/CardPreview'
import { CardBasket } from './components/Views/Card/CardBasket'

import { Header } from './components/Views/Header'
import { BasketView } from './components/Views/BasketView'
import { Gallery } from './components/Views/Gallery'
import { Modal } from './components/Views/Modal'
import { SuccessView } from './components/Views/SuccessView'

import { OrderForm } from './components/Views/Form/OrderForm'
import { ContactsForm } from './components/Views/Form/ContactsForm'

const events = new EventEmitter()
const api = new Api(API_URL)
const webLarekApi = new WebLarekApi(api)

const productsModel = new Products()
const basketModel = new Basket()
const buyerModel = new Buyer()

const header = new Header(events, document.querySelector('.header')!)
const gallery = new Gallery(events, document.querySelector('.gallery')!)
const modal = new Modal(events, document.querySelector('#modal-container')!)

const basketView = new BasketView(cloneTemplate('#basket'), events)
const successView = new SuccessView(cloneTemplate('#success'), events)

const orderForm = new OrderForm(cloneTemplate('#order'), events)
const contactsForm = new ContactsForm(cloneTemplate('#contacts'), events)

const cardPreview = new CardPreview(cloneTemplate('#card-preview'), () => {
  const item = productsModel.getPreviewItem()
  if (!item) return

  if (basketModel.hasItem(item.id)) {
    basketModel.removeItem(item.id)
  } else {
    basketModel.addItem(item)
  }

  modal.hide()
})

webLarekApi
  .getProducts()
  .then((data) => {
    productsModel.setItems(data.items)
  })
  .catch(console.error)

events.on('products:set', ({ items }: { items: IProduct[] }) => {
  const cards = items.map((item) => {
    const card = new CardCatalog(cloneTemplate('#card-catalog'), () =>
      events.emit('card:preview', { id: item.id })
    )

    return card.render({
      title: item.title,
      price: item.price !== null ? `${item.price} синапсов` : 'Бесценно',
      category: item.category,
      image: item.image,
    })
  })

  gallery.catalog = cards
})

events.on('basket:change', () => {
  const items = basketModel.getItems()

  const cards = items.map((item, index) => {
    const card = new CardBasket(cloneTemplate('#card-basket'), () =>
      events.emit('basket:remove', { id: item.id })
    )

    return card.render({
      title: item.title,
      price: `${item.price} синапсов`,
      index: index + 1,
    })
  })

  basketView.items = cards
  basketView.total = basketModel.getTotalPrice()

  header.counter = basketModel.getItemsCount()

  basketView.disabled = basketModel.getItemsCount() === 0

  if (items.length === 0) {
    // очистка форм
    buyerModel.clear()
    events.emit('buyer:clear')
  }
})

events.on('card:preview', ({ id }: { id: string }) => {
  const item = productsModel.getItemById(id)
  if (!item) return

  productsModel.setPreviewItem(item)

  cardPreview.render({
    title: item.title,
    price: item.price !== null ? `${item.price} синапсов` : 'Бесценно',
    category: item.category,
    image: item.image,
    text: item.description,
    inBasket: basketModel.hasItem(id),
    available: !!item.price,
  })

  modal.content = cardPreview.render()
  modal.show()
})

events.on('card:toggle', ({ id }: { id: string }) => {
  const item = productsModel.getItemById(id)
  if (!item) return

  const isPreviewOpen = modal.content?.querySelector('.card_full') !== null

  if (basketModel.hasItem(id)) {
    basketModel.removeItem(id)
  } else {
    basketModel.addItem(item)
  }

  if (isPreviewOpen) {
    modal.hide()
  }
})

events.on('basket:remove', ({ id }: { id: string }) => {
  basketModel.removeItem(id)
})

events.on('basket:open', () => {
  modal.content = basketView.render()
  modal.show()
})

events.on('order:open', () => {
  modal.content = orderForm.render()
  modal.show()
})

events.on('order:payment-select', ({ payment }: { payment: TPayment }) => {
  buyerModel.setData({ payment })
})

events.on(
  'order:submit:change',
  ({ field, value }: { field: string; value: string }) => {
    if (field === 'address') {
      buyerModel.setData({ address: value })
    }
  }
)

events.on(
  'contacts:submit:change',
  ({ field, value }: { field: string; value: string }) => {
    buyerModel.setData({ [field]: value })
  }
)

events.on('buyer:change', (data: IBuyer) => {
  const errors = buyerModel.validate()

  orderForm.payment = data.payment ?? ''
  orderForm.address = data.address ?? ''
  const orderErrors = [errors.payment, errors.address]
    .filter(Boolean)
    .join(', ')
  orderForm.errors = orderErrors
  orderForm.valid = !errors.payment && !errors.address

  contactsForm.email = data.email ?? ''
  contactsForm.phone = data.phone ?? ''

  const contactsErrors = Object.keys(data.email || data.phone ? errors : {})
    .length
    ? [errors.email, errors.phone].filter(Boolean).join(', ')
    : ''
  contactsForm.errors = contactsErrors
  contactsForm.valid = !errors.email && !errors.phone
})

events.on('order:submit', () => {
  const errors = buyerModel.validate()

  if (errors.payment || errors.address) {
    return
  }

  modal.content = contactsForm.render()
})

events.on('contacts:submit', () => {
  const errors = buyerModel.validate()

  if (errors.email || errors.phone) {
    return
  }

  const buyerData = buyerModel.getData()
  if (!buyerData.payment) return

  const orderData: IOrder = {
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    items: basketModel.getItems().map((item) => item.id),
  }

  webLarekApi
    .createOrder(orderData)
    .then((response) => {
      const total = response.total

      basketModel.clear()
      buyerModel.clear()

      successView.total = total

      modal.content = successView.render()
      modal.show()
    })
    .catch(console.error)
})

events.on('buyer:clear', () => {
  orderForm.address = ''
  orderForm.payment = ''
  orderForm.errors = ''
  orderForm.valid = false

  contactsForm.email = ''
  contactsForm.phone = ''
  contactsForm.errors = ''
  contactsForm.valid = false
})

events.on('success:close', () => {
  modal.hide()
})
