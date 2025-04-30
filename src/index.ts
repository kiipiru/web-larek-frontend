import { EventEmitter } from './components/base/events';
import { ItemCard } from './components/ItemCard';
import { ItemsBasket } from './components/ItemsBasket';
import { ItemsData } from './components/ItemsData';
import { LarekApi } from './components/LarekAPI';
import { ModalWithBasket } from './components/ModalWithBasket';
import { ModalWithContactInfo } from './components/ModalWithContactInfo';
import { ModalWithItem } from './components/ModalWithItem';
import { ModalWithOrder } from './components/ModalWithOrder';
import { ModalWithSuccess } from './components/ModalWithSuccess';
import { Order } from './components/Order';
import { Page } from './components/Page';
import './scss/styles.scss';
import { IOrder, PaymentMethod } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();
const larekApi = new LarekApi(CDN_URL, API_URL);

// Модели данных
const cardsData = new ItemsData(null, events);
const orderModel = new Order(null, events);
const itemsBasket = new ItemsBasket({ items: new Map() }, events);

// Темплейты для модальных окон
const cardTemplate = document.getElementById(
	'card-catalog'
) as HTMLTemplateElement;

const cardModalTemplate = document.getElementById(
	'card-preview'
) as HTMLTemplateElement;
const orderModalTemplate = document.getElementById(
	'order'
) as HTMLTemplateElement;
const contactsModalTemplate = document.getElementById(
	'contacts'
) as HTMLTemplateElement;
const successModalTemplate = document.getElementById(
	'success'
) as HTMLTemplateElement;
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const cardInBasketTemplate = document.getElementById(
	'card-basket'
) as HTMLTemplateElement;

// Модальные окна
const modalContainer = document.getElementById('modal-container');
const modalItem = new ModalWithItem(
	modalContainer,
	events,
	cloneTemplate(cardModalTemplate)
);
const modalOrder = new ModalWithOrder(
	modalContainer,
	events,
	cloneTemplate(orderModalTemplate)
);
const modalContacts = new ModalWithContactInfo(
	modalContainer,
	events,
	cloneTemplate(contactsModalTemplate)
);
const modalSuccess = new ModalWithSuccess(
	modalContainer,
	events,
	cloneTemplate(successModalTemplate)
);
const modalBasket = new ModalWithBasket(
	modalContainer,
	events,
	cloneTemplate(basketTemplate),
	cloneTemplate(cardInBasketTemplate)
);

events.on('page:initialized', () => {
	larekApi
		.getItems()
		.then((items) => {
			cardsData.items = items;
			events.emit('initialData:loaded');
		})
		.catch((err) => {
			console.log(err);
		});
});

const page = new Page(document.body, events);

events.on('initialData:loaded', () => {
	const initialCards = cardsData.items.map((item) => {
		const card = new ItemCard(cloneTemplate(cardTemplate), events);
		return card.render(item);
	});
	page.catalog = initialCards;
	page.counter = itemsBasket.items.size;
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('item:select', (payload: { item: ItemCard }) => {
	if (itemsBasket.items.has(payload.item.id)) {
		modalItem.basketButton.textContent = 'Убрать из корзины';
	} else {
		modalItem.basketButton.textContent = 'В корзину';
	}
	modalItem.render(cardsData.getCard(payload.item.id));
});

events.on('basketButton:click', (data: { id: string }) => {
	if (!itemsBasket.items.has(data.id)) {
		itemsBasket.addItem(data.id);
		modalItem.basketButton.textContent = 'Убрать из корзины';
	} else {
		itemsBasket.deleteItem(data.id);
		modalItem.basketButton.textContent = 'В корзину';
	}
});

events.on('basket:change', (data: { items: string[] }) => {
	page.counter = itemsBasket.items.size;
	const basketCards = data.items.map((id) => cardsData.getCard(id));
	itemsBasket.totalPrice = basketCards.reduce(
		(sum, card) => sum + card.price,
		0
	);
    modalBasket.orderButton.disabled = (itemsBasket.items.size === 0);
});

events.on('basketitem:deleted', (payload: { id: string }) => {
	itemsBasket.deleteItem(payload.id);
	modalBasket.removeBasketItem(payload.id);
	modalBasket.handleTotalPrice(itemsBasket.totalPrice);
});

events.on('bids:open', () => {
	const ids = Array.from(itemsBasket.items.keys());
	const cardsForBasket = ids.map((id) => cardsData.getCard(id));
	modalBasket.handleTotalPrice(itemsBasket.totalPrice);
	modalBasket.render({ items: cardsForBasket });
});

events.on('orderbutton:clicked', () => {
	orderModel.total = itemsBasket.totalPrice;
	modalOrder.render({payment: orderModel.payment, address: orderModel.address});
	orderModel.items = Array.from(itemsBasket.items.keys());
	console.log(orderModel.items);
	events.emit('order:updated', orderModel);
});

events.on('paymentmethod:set', (data: { payment: PaymentMethod }) => {
	orderModel.payment = data.payment;
	console.log(orderModel.payment);
});

events.on('address:input', (data: { address: string }) => {
	orderModel.address = data.address;
});

events.on('email:input', (data: { email: string }) => {
	orderModel.email = data.email;
});

events.on('phone:input', (data: { phone: string }) => {
	orderModel.phone = data.phone;
});

events.on('order:updated', (data: Partial<IOrder>) => {
	const isPaymentSet = !!orderModel.payment;
	const isAddressSet =
		typeof orderModel.address === 'string' &&
		orderModel.address.trim().length > 0;
	const isEmailSet =
		typeof orderModel.email === 'string' && orderModel.email.trim().length > 0;
	const isPhoneSet =
		typeof orderModel.phone === 'string' && orderModel.phone.trim().length > 0;
		modalOrder.payment = data.payment;
		const buttons = modalOrder.paymentOptionButtons;
		buttons.forEach((button) => {
			if (button.name === modalOrder.payment) {
				modalOrder.addActiveClass(button);
			} else {
				modalOrder.removeActiveClass(button);
			}
		});
	if (modalOrder.proceedButton) {
		const validOrder = isPaymentSet && isAddressSet;
		modalOrder.proceedButton.disabled = !validOrder;
		modalOrder.errorSpan = validOrder
			? ''
			: 'Необходимо заполнить все поля формы';
	}
	if (modalContacts.submitOrderButton) {
		const validOrder = isEmailSet && isPhoneSet;
		modalContacts.submitOrderButton.disabled = !validOrder;
		modalContacts.errorSpan = validOrder
			? ''
			: 'Необходимо заполнить все поля формы';
	}
});

events.on('orderData:received', () => {
	modalContacts.render({email: orderModel.email, phone: orderModel.phone});
});

events.on('order:submited', () => {
	larekApi
		.sendOrder(orderModel.makeOrder())
		.then((response) => {
			modalSuccess.render({total: response.total});
            const items = Array.from(itemsBasket.items.keys())
            modalOrder.getAddress().value = ''
            modalContacts.getInputs().forEach((el) => {el.value = ''})
    items.forEach((item) => itemsBasket.deleteItem(item))
		})
		.catch((err) => {
			console.log(err);
		});
});

events.on('order:close', () => {
	modalSuccess.close();
});
