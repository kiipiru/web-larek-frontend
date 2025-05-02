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
        this.setText(this._category, category);
        this.toggleClass(this._category, categoryMapping[category], true);
    }

    set title(title: string) {
        this.setText(this._title, title);
        this._image.alt = title
    }

    set image(imageUrl: string) {
        this.setImage(this._image, imageUrl);
    }

    set price(price: number | null) {
        this.setText(this._price, handlePrice(price));
    }
}