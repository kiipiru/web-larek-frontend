import { IItem, IItemsData } from "../types";
import { IEvents } from "./base/events";
import { Model } from "./base/model";

export class ItemsData extends Model<IItemsData> {
    protected _items: IItem[] = []
    protected events: IEvents
    protected _changed() {
        this.emitChanges('items:changed', {items: this._items})
    }
    set items(items: IItem[]) {
        this._items = items
        this._changed()
    }
    get items() {
        return this._items
    }
    getCard(id: string) {
        return this._items.find((item) => item.id === id)
    }
}

