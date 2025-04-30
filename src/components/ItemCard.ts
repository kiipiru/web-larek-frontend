import { IItem, ItemCategories } from "../types";
import { categoryMapping } from "../utils/constants";
import { handlePrice } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


export class ItemCard extends Component<IItem> {
    protected events: IEvents;
    protected _category: HTMLSpanElement;
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _price: HTMLSpanElement;
    protected itemId: string;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this._category = this.container.querySelector('.card__category');
        this._title = this.container.querySelector('.card__title');
        this._image = this.container.querySelector('.card__image');
        this._price = this.container.querySelector('.card__price');
        this.container.addEventListener('click', () => {this.events.emit('item:select', { item: this })});
    }

    set id (id: string) {
        this.itemId = id
    }

    get id (): string {
        return this.itemId
    }

    set category(category: ItemCategories) {
        this._category.textContent = category;
        this._category.classList.add(categoryMapping[category]);
    }

    set title(title: string) {
        this._title.textContent = title;
        this._image.alt = title
    }

    set image(imageUrl: string) {
        this._image.src = imageUrl;
    }

    set imageAlt(alt: string) {
        this._image.alt = alt;
    }

    set price(price: number | null) {
        this._price.textContent = handlePrice   (price);
    }
}