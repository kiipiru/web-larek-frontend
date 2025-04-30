export type ItemCategories = "софт-скил" | "другое" | "дополнительное" | "кнопка" | "хард-скил"
export type PaymentMethod = 'card' | 'cash'

export interface IItem {
    id: string
    description: string
    image: string
    title: string
    category: ItemCategories
    price: number | null
}

export interface IItemsData {
    items: IItem[]
    preview: string | null
    totalCost: number | null
    getItem(id: string): IItem
}

export interface IBasket {
    items: Map<string, number>
    addItem(id: string): void
    deleteItem(id: string): void
}

export interface IOrder {
    payment: PaymentMethod
    email: string
    phone: string
    address: string
    items: string[]
    total: number
}

export interface IOrderResult {
    id: string
    total: number
}
