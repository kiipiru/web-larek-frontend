import { IOrder } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Modal } from './base/ModalWindow';

interface IModalWithContactInfo extends Partial<IOrder> {
	email: string;
	phone: string;
}

export class ModalWithContactInfo extends Modal<IModalWithContactInfo> {
	protected _modalTitle: HTMLElement;
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;
	protected _submitOrderButton: HTMLButtonElement;
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
		this._emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			this.modalContent
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			this.modalContent
		);
		this._submitOrderButton = ensureElement<HTMLButtonElement>(
			'.button',
			this.modalContent
		);
		this._errorSpan = ensureElement<HTMLSpanElement>(
			'.form__errors',
			this.modalContent
		);

		this._emailInput.addEventListener('input', () => {
			this.events.emit('email:input', { email: this._emailInput.value });
		});

		this._phoneInput.addEventListener('input', () => {
			this.events.emit('phone:input', { phone: this._phoneInput.value });
		});

		this._submitOrderButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.events.emit('order:submited');
		});
	}
	get submitOrderButton(): HTMLButtonElement {
		return this._submitOrderButton;
	}
	set errorSpan(text: string) {
		this.setText(this._errorSpan, text);
	}
	getInputs(): HTMLInputElement[] {
		return [this._emailInput, this._phoneInput]
	}
}
