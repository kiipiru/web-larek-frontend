import { IOrder, PaymentMethod } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Modal } from './base/ModalWindow';

interface IModalWithOrder extends Partial<IOrder> {
	paymentMethod: PaymentMethod;
	address: string;
}

export class ModalWithOrder extends Modal<IModalWithOrder> {
	protected _modalTitle: HTMLElement;
	protected _paymentMethod: null | PaymentMethod;
	protected _paymentByCardButton: HTMLButtonElement;
	protected _paymentByCashButton: HTMLButtonElement;
	protected _paymentOptionsButtons: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;
	protected _proceedButton: HTMLButtonElement;
	protected _orderDataForm: HTMLFormElement;
	protected _errorSpan: HTMLSpanElement;
	constructor(
		container: HTMLElement,
		events: IEvents,
		orderTemplate: HTMLElement
	) {
		super(container, events, orderTemplate);
		this._modalTitle = ensureElement<HTMLElement>(
			'.modal__title',
			this.modalContent
		);
		this._orderDataForm =
			this.modalContent as HTMLFormElement
		this._paymentByCardButton = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			this.modalContent
		);
		this._paymentByCashButton = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			this.modalContent
		);
		this._paymentOptionsButtons = [
			this._paymentByCardButton,
			this._paymentByCashButton,
		];
		this._addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.modalContent
		);
		this._proceedButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.modalContent
		);
		this._errorSpan = ensureElement<HTMLSpanElement>(
			'.form__errors',
			this.modalContent
		);
		this._paymentOptionsButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.events.emit(`paymentmethod:set`, { payment: button.name });
			});
		});
		this._addressInput.addEventListener('input', () => {
			this.events.emit('address:input', { address: this._addressInput.value });
		});
		this._orderDataForm.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit('orderData:received');
		});
	}
	getAddress(): HTMLInputElement {
		return this._addressInput
	}
	set errorSpan(text: string) {
		this.setText(this._errorSpan, text);
	}
	set payment(paymentMethod: null | PaymentMethod) {
		this._paymentMethod = paymentMethod;
	}
	get payment(): PaymentMethod {
		return this._paymentMethod;
	}
	get paymentOptionButtons(): HTMLButtonElement[] {
		return this._paymentOptionsButtons;
	}
	get proceedButton(): HTMLButtonElement {
		return this._proceedButton;
	}
	addActiveClass(button: HTMLButtonElement) {
		button.classList.add('button_alt-active');
	}
	removeActiveClass(button: HTMLElement) {
		button.classList.remove('button_alt-active');
	}
}
