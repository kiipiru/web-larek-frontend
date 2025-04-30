import { IOrder, PaymentMethod } from '../types';
import { Model } from './base/model';

export class Order extends Model<IOrder> {
	private _payment: PaymentMethod;
	private _email: string;
	private _phone: string;
	private _address: string;
	private _items: string[] = [];
	private _total: number;

	// Геттеры
	get payment(): PaymentMethod {
		return this._payment;
	}

	get email(): string {
		return this._email;
	}

	get phone(): string {
		return this._phone;
	}

	get address(): string {
		return this._address;
	}

	get items(): string[] {
		return this._items;
	}

	get total() {
		return this._total;
	}

	// Сеттеры
	set payment(value: PaymentMethod) {
		this._payment = value;
		this.emitChanges('order:updated', { payment: this._payment });
	}

	set email(value: string) {
		this._email = value;
		this.emitChanges('order:updated', { email: this._email });
	}

	set phone(value: string) {
		this._phone = value;
		this.emitChanges('order:updated', { phone: this._phone });
	}

	set address(value: string) {
		this._address = value;
		this.emitChanges('order:updated', { address: this._address });
	}

	set items(value: string[]) {
		this._items = value;
		this.emitChanges('order:updated', { items: this._items });
	}

	set total(value: number) {
		this._total = value;
	}

	private validateOrder(): boolean {
		return !!(
			this._payment &&
			this._email &&
			this._phone &&
			this._address &&
			this._items.length > 0
		);
	}
	private clearOrder(): void {
        this._payment = null;
        this._email = '';
        this._phone = '';
        this._address = '';
        this._items = [];
        this._total = 0;
        this.emitChanges('order:updated', {});
    }

    makeOrder(): IOrder | null {
        if (!this.validateOrder()) {
            return null;
        }

        const order = {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address,
            items: this._items,
            total: this._total,
        };

        this.clearOrder();
        return order;
    }
}
