import { IBasket, IItem, IItemsData, ItemCategories } from '../types';

import {
	ensureElement,
	getElementData,
	handlePrice,
	setElementData,
} from '../utils/utils';
import { IEvents } from './base/events';
import { Modal } from './base/ModalWindow';

export class ModalWithBasket extends Modal<IItemsData> {
	protected _cardInBasketTemplate: HTMLElement;
	protected _cardBasketList: HTMLElement;
	protected _itemIndex: HTMLSpanElement;
	protected _itemTitle: HTMLSpanElement;
	protected _itemPrice: HTMLSpanElement;
	protected _itemDeleteButton: HTMLButtonElement;
	protected _basketList: HTMLUListElement;
	protected _orderButton: HTMLButtonElement;
	protected _basketPrice: HTMLSpanElement;
	protected _items: IItem[];
	constructor(
		container: HTMLElement,
		events: IEvents,
		basketTemplate: HTMLElement,
		cardInBasketTemplate: HTMLElement
	) {
		super(container, events, basketTemplate);
		this._cardInBasketTemplate = cardInBasketTemplate;
		this._basketPrice = ensureElement<HTMLSpanElement>(
			'.basket__price',
			this.modalContent
		);
		this._cardBasketList = ensureElement<HTMLElement>(
			'.basket__list',
			this.modalContent
		);
		this._orderButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.modalContent
		);
		this.setDisabled(this._orderButton, true);
		this._itemIndex = ensureElement<HTMLSpanElement>(
			'.basket__item-index',
			this._cardInBasketTemplate
		);
		this._itemTitle = ensureElement<HTMLSpanElement>(
			'.card__title',
			this._cardInBasketTemplate
		);
		this._itemPrice = ensureElement<HTMLSpanElement>(
			'.card__price',
			this._cardInBasketTemplate
		);
		this._itemDeleteButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this._cardInBasketTemplate
		);
		this._orderButton.addEventListener('click', () => {
			this.events.emit('orderbutton:clicked');
		});
	}
	set items(items: IItem[]) {
		this._cardBasketList.innerHTML = '';
		items.forEach((item, index) => {
			const card = this.createBasketItem(item, index + 1);
			this._cardBasketList.append(card);
		});
	}

    disableOrderButton(state: boolean) {
        this.setDisabled(this._orderButton, state)
    }

	handleTotalPrice(totalPrice: number | null) {
		if (totalPrice != null) {
			this.setText(this._basketPrice, `${totalPrice} синапсов`);
		} else {
			this.setText(this._basketPrice, '0 синапсов');
		}
	}

	createBasketItem(item: IItem, index: number): HTMLElement {
		const cardElement = this._cardInBasketTemplate.cloneNode(
			true
		) as HTMLElement;
		const itemIndex = cardElement.querySelector(
			'.basket__item-index'
		) as HTMLSpanElement;
		const itemTitle = cardElement.querySelector(
			'.card__title'
		) as HTMLSpanElement;
		const itemPrice = cardElement.querySelector(
			'.card__price'
		) as HTMLSpanElement;
		const deleteButton = cardElement.querySelector(
			'.basket__item-delete'
		) as HTMLButtonElement;
		deleteButton.addEventListener('click', () => {
			this.events.emit(
				'basketitem:deleted',
				getElementData<{ id: string }>(cardElement, { id: String })
			);
		});
		setElementData(cardElement, { id: item.id });
		this.setText(itemIndex, index.toString());
		this.setText(itemTitle, item.title);
		this.setText(itemPrice, handlePrice(item.price));
		return cardElement;
	}

	removeBasketItem(id: string) {
		this._cardBasketList.querySelector(`[data-id="${id}"]`).remove();
		const remainingItems =
			this._cardBasketList.querySelectorAll('.basket__item');
		remainingItems.forEach((el, index) => {
			const indexEl = el.querySelector(
				'.basket__item-index'
			) as HTMLSpanElement;
			this.setText(indexEl, (index + 1).toString());
		});
	}
}
