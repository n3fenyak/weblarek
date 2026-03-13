import { IBuyer } from '../../types'

export class Buyer {
  protected payment: IBuyer['payment'] | null = null
  protected address: string = ''
  protected email: string = ''
  protected phone: string = ''

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment
    if (data.address !== undefined) this.address = data.address
    if (data.email !== undefined) this.email = data.email
    if (data.phone !== undefined) this.phone = data.phone
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

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {}

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
