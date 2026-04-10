import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

export interface IGallery {
  catalog: HTMLElement[]
}

export class Gallery extends Component<IGallery> {
  constructor(protected events: IEvents, container: HTMLElement) {
    super(container)
  }

  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items)
  }
}
