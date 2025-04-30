import { IBasket} from "../types";
import { Model } from "./base/model";


export class ItemsBasket extends Model<IBasket> {
    protected _items: Map<string, number> = new Map()
    protected _totalPrice: number;
    protected _changed() {
        this.emitChanges('basket:change', {items: Array.from(this.items.keys())})
    }
    addItem(id: string): void {
        if (!this.items.has(id)) this.items.set(id, 0)
        this.items.set(id, this.items.get(id)! + 1)
        this._changed()}
    deleteItem(id: string): void {
        if (!this.items.has(id)) return
        if (this.items.get(id) > 0) {this.items.set(id, this.items.get(id)! - 1)}
        if (this.items.get(id) === 0) {this.items.delete(id)}
        this._changed()
    }
    set items(items: Map<string, number>) {
        this._items = items
    }
    get items(): Map<string, number> {
        return this._items
    }
    set totalPrice(price: number) {
        this._totalPrice = price
    }
    get totalPrice() {
        return this._totalPrice
    }
}