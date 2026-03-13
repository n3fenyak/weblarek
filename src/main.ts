import { Products } from './components/Models/Products'
import { Basket } from './components/Models/Basket'
import { Buyer } from './components/Models/Buyer'

import { apiProducts } from './utils/data'

const productsModel = new Products()
const basketModel = new Basket()
const buyerModel = new Buyer()
//products
productsModel.setItems(apiProducts.items)
console.log('Все товары:', productsModel.getItems())

const firstProduct = productsModel.getItems()[0]
console.log('Товар по ID:', productsModel.getItemById(firstProduct.id))

productsModel.setPreviewItem(firstProduct)
console.log('Preview товар:', productsModel.getPreviewItem())

//basket
basketModel.addItem(firstProduct)
console.log('Товары в корзине:', basketModel.getItems())
console.log('Количество товаров:', basketModel.getItemsCount())
console.log('Общая стоимость:', basketModel.getTotalPrice())
console.log('Есть ли товар в корзине:', basketModel.hasItem(firstProduct.id))

basketModel.removeItem(firstProduct.id)
console.log('Корзина после удаления:', basketModel.getItems())

//buyer
buyerModel.setData({
  email: 'email',
  phone: '1111',
})

console.log('Данные покупателя:', buyerModel.getData())
console.log('Ошибки валидации:', buyerModel.validate())
