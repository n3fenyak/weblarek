import { IBuyer, IErrorBuyer } from '../../types'
import { EventEmitter } from '../base/Events'

export class Buyer {
  protected payment: IBuyer['payment'] | null = null
  protected address: string = ''
  protected email: string = ''
  protected phone: string = ''

  constructor(protected events: EventEmitter) {}

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment
    if (data.address !== undefined) this.address = data.address
    if (data.email !== undefined) this.email = data.email
    if (data.phone !== undefined) this.phone = data.phone

    this.events.emit('buyer:change', this.getData())
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    }
  }

  clear(): void {
    this.payment = null
    this.address = ''
    this.email = ''
    this.phone = ''
  }

  //   validate(): Partial<Record<keyof IBuyer, string>> {
  //     const errors: Partial<Record<keyof IBuyer, string>> = {}

  //     if (!this.payment) {
  //       errors.payment = 'Не выбран вид оплаты'
  //     }

  //     if (!this.address) {
  //       errors.address = 'Укажите адрес'
  //     }

  //     if (!this.email) {
  //       errors.email = 'Укажите email'
  //     }

  //     if (!this.phone) {
  //       errors.phone = 'Укажите телефон'
  //     }

  //     return errors
  //   }
  // }

  validate(): IErrorBuyer {
    const errors: IErrorBuyer = {}

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты'
    }

    if (!this.address) {
      errors.address = 'Укажите адрес'
    }

    if (!this.email) {
      errors.email = 'Укажите email'
    }

    if (!this.phone) {
      errors.phone = 'Укажите телефон'
    }

    return errors
  }
}
