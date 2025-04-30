import { IOrderResult } from '../types';
import { ensureElement, handlePrice } from '../utils/utils';
import { IEvents } from './base/events';
import { Modal } from './base/ModalWindow';

interface IModalWithSuccess extends Partial<IOrderResult> {
	total: number;
}

export class ModalWithSuccess extends Modal<IModalWithSuccess> {
	protected _totalPrice: HTMLElement;
	protected _orderCloseButton: HTMLButtonElement;
	constructor(
		container: HTMLElement,
		events: IEvents,
		successTemplate: HTMLElement
	) {
		super(container, events, successTemplate);
		this._totalPrice = ensureElement<HTMLElement>(
			'.order-success__description',
			this.modalContent
		);
		this._orderCloseButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.modalContent
		);
		this._orderCloseButton.addEventListener('click', () => {
			this.events.emit('order:close');
		});
	}

	set total(price: number) {
		this.setText(this._totalPrice, `Списано ${handlePrice(price)}`);
	}
}
