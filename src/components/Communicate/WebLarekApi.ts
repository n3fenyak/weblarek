import { IApi, IProductsResponse, IOrder, IOrderResult } from '../../types'

export class WebLarekApi {
  constructor(private api: IApi) {}

  getProducts(): Promise<IProductsResponse> {
    return this.api.get('/product/')
  }

  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post('/order/', order)
  }
}
