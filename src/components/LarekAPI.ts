import {IItem, IOrder, IOrderResult} from "../types"
import { Api, ApiListResponse } from "./base/api";

interface ILarekApi {
    cdn: string
    getItems: () => Promise<IItem[]>
    sendOrder: (order: IOrder) => Promise<IOrderResult>; 
}

export class LarekApi extends Api implements ILarekApi {
    readonly cdn: string
    constructor (cdn: string, baseUrl: string, options: RequestInit = {}) { 
        super(baseUrl, options)
        this.cdn = cdn
    }
    getItems(): Promise<IItem[]> {return this.get('/product').then((data: ApiListResponse<IItem>) => data.items.map((item) => ({...item, image: this.cdn + item.image})))
    }
    sendOrder(order: IOrder): Promise<IOrderResult> {return this.post('/order', order).then((data: IOrderResult) => data)}}
