import { ensureElement } from "../../utils/utils";
import { Component } from "./Component";
import { IEvents } from "./events";

export class Modal <T> extends Component<T> {
    protected modal: HTMLElement;
    protected events: IEvents;
    protected modalContentContainer: HTMLElement
    protected modalContent: HTMLElement
    constructor(container: HTMLElement, events: IEvents, modalContent: HTMLElement) {
      super(container);
      this.events = events;
      this.modalContent = modalContent;
      this.modalContentContainer = ensureElement<HTMLElement>('.modal__content', this.container)
      const closeButtonElement = this.container.querySelector(".modal__close");
      closeButtonElement.addEventListener("click", this.close.bind(this));
      this.container.addEventListener("mousedown", (evt) => {
        if (evt.target === evt.currentTarget) {
          this.close();
        }
      });
      this.handleEscUp = this.handleEscUp.bind(this);
    }
  
    open() {
      this.container.classList.add("modal_active");
      document.addEventListener("keyup", this.handleEscUp);
      this.events.emit('modal:open')
        }
  
    close() {
      this.container.classList.remove("modal_active");
      document.removeEventListener("keyup", this.handleEscUp);
      this.events.emit('modal:close')
    }
  
    handleEscUp (evt: KeyboardEvent) {
        if (evt.key === "Escape") {
          this.close();
        }
      }

    render(data?: Partial<T>):HTMLElement {
      this.open()
      this.modalContentContainer.replaceChildren(this.modalContent)
      return super.render(data)
    }
  }
  