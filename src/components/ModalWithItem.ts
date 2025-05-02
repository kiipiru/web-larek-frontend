import { IItem, ItemCategories } from '../types';
import { categoryMapping } from '../utils/constants';
import { ensureElement, handlePrice } from '../utils/utils';
import { IEvents } from './base/events';
import { Modal } from './base/ModalWindow';

export class ModalWithItem extends Modal<IItem> {
	protected _itemImage: HTMLImageElement;
	protected _itemCategory: HTMLSpanElement;
	protected _itemTitle: HTMLElement;
	protected _itemDescription: HTMLElement;
	protected _itemPrice: HTMLSpanElement;
	protected _basketButton: HTMLButtonElement;
	protected itemId: string;
	constructor(
		container: HTMLElement,
		events: IEvents,
		cardTemplate: HTMLElement
	) {
		super(container, events, cardTemplate);

		this._itemImage = ensureElement<HTMLImageElement>(
			'.card__image',
			this.modalContent
		);
		this._itemCategory = ensureElement<HTMLSpanElement>(
			'.card__category',
			this.modalContent
		);
		this._itemTitle = ensureElement<HTMLElement>(
			'.card__title',
			this.modalContent
		);
		this._itemDescription = ensureElement<HTMLElement>(
			'.card__text',
			this.modalContent
		);
		this._itemPrice = ensureElement<HTMLSpanElement>(
			'.card__price',
			this.modalContent
		);
		this._basketButton = ensureElement<HTMLButtonElement>(
			'.button',
			this.modalContent
		);
		this._basketButton.addEventListener('click', () => {
			this.events.emit('basketButton:click', { id: this.itemId });
		});
	}
	set image(img: string) {
		this._itemImage.src = img;
	}

	set category(category: ItemCategories) {
		this.setText(this._itemCategory, category);
		Object.values(categoryMapping).forEach((className) => {
			this.toggleClass(this._itemCategory, className, false);
		});
		this.toggleClass(this._itemCategory, categoryMapping[category], true);
	}

	set title(title: string) {
		this.setText(this._itemTitle, title)
		this._itemImage.alt = title
	}

	set description(description: string) {
		this.setText(this._itemDescription, description)
	}

	set price(price: number | null) {
		this.setText(this._itemPrice, handlePrice(price))
		this.setDisabled(this._basketButton, price === null);
	}
	set id(id: string) {
		this.itemId = id;
	}
	set basketButtonText(text: string) {
		this.setText(this._basketButton, text)
	}
	get id(): string {
		return this.itemId;
	}

}
