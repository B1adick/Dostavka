// Клас для страви
class Dish {
    constructor(name, price, type) {
        this.name = name;
        this.price = price;
        this.type = type;
    }
}

// Клас для ресторану
class Restaurant {
    constructor(name, address) {
        this.name = name;
        this.address = address;
        this.menu = [];
    }

    addDish(dish) {
        this.menu.push(dish);
    }

    removeDish(dishName) {
        this.menu = this.menu.filter(dish => dish.name !== dishName);
    }

    viewMenu() {
        return this.menu;
    }
}

// Клас для користувача
class User {
    constructor(name, address, phone) {
        this.name = name;
        this.address = address;
        this.phone = phone;
    }
}

// Клас для замовлення
class Order {
    constructor(user, restaurant) {
        this.user = user;
        this.restaurant = restaurant;
        this.dishes = [];  // Спочатку замовлення порожнє
        this.totalPrice = 0;
        this.status = 'Вибір страв';  // Початковий статус
        this.paymentMethod = '';
    }

    addDish(dish) {
        this.dishes.push(dish);
        this.calculateTotal();
    }

    removeDish(dishName) {
        this.dishes = this.dishes.filter(dish => dish.name !== dishName);
        this.calculateTotal();
    }

    calculateTotal() {
        this.totalPrice = this.dishes.reduce((total, dish) => total + dish.price, 0);
    }

    setPaymentMethod(method) {
        this.paymentMethod = method;
    }

    updateStatus(newStatus) {
        this.status = newStatus;
    }

    viewOrderInfo() {
        let dishList = this.dishes.map(dish => `${dish.name} - ${dish.price} грн`).join('<br>');
        return `Страви: <br>${dishList} <br> Загальна вартість: ${this.totalPrice} грн <br> Статус: ${this.status}`;
    }
}

// Клас для кур'єра
class Courier {
    constructor(name, transport) {
        this.name = name;
        this.transport = transport;
        this.currentOrder = null;
    }

    takeOrder(order) {
        this.currentOrder = order;
        order.status = 'В дорозі'; // Кур'єр бере замовлення і змінює статус на "в дорозі"
    }

    deliverOrder() {
        if (this.currentOrder) {
            this.currentOrder.status = 'Доставлено'; // Замовлення доставлено
            return `Кур'єр ${this.name} доставив замовлення`;
        }
        return 'Немає замовлення для доставки';
    }

    viewCourierInfo() {
        if (this.currentOrder) {
            return `Поточне замовлення: ${this.currentOrder.user.name}, статус: ${this.currentOrder.status}, Транспорт: ${this.transport}`;
        }
        return 'Немає поточного замовлення';
    }
}

// Функція для випадкового вибору імені та транспорту кур'єра
function getRandomCourier() {
    const names = ["Артем", "Назар", "Сірьожа", "Вадім"];
    const transports = ["Машина", "Мопед", "Велосипед", "Піший"];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomTransport = transports[Math.floor(Math.random() * transports.length)];
    
    return {
        name: randomName,
        transport: randomTransport
    };
}

// Створення ресторану та страв
const restaurant1 = new Restaurant("Pizza Hut", "вул. Підкова, 5");
const restaurant2 = new Restaurant("Sushi Time", "вул. Лева, 8");

const pizza = new Dish("Маргарита", 100, "основна страва");
const pasta = new Dish("Паста Болоньєзе", 120, "основна страва");
const salad = new Dish("Цезар", 80, "закуска");

const sushi = new Dish("Нігірі", 90, "основна страва");
const rolls = new Dish("Каліфорнія", 150, "основна страва");
const miso = new Dish("Міcо суп", 60, "суп");

// Додаємо страви в меню ресторанів
restaurant1.addDish(pizza);
restaurant1.addDish(pasta);
restaurant1.addDish(salad);

restaurant2.addDish(sushi);
restaurant2.addDish(rolls);
restaurant2.addDish(miso);

// Створення користувача
const user = new User("Іван", "вул. Центральна, 15", "1234567890");

// Створення замовлення
let order = new Order(user, restaurant1);

// Оновлення інформації про замовлення
document.getElementById("order-info").innerHTML = order.viewOrderInfo();

// Оновлення меню на сторінці
function updateMenu() {
    const restaurant1Menu = document.getElementById("restaurant1-menu");
    restaurant1Menu.innerHTML = restaurant1.viewMenu().map(dish => {
        return `<div class="dish">
                    <span>${dish.name} - ${dish.price} грн</span>
                    <button onclick="addToOrder('${dish.name}', 'restaurant1')">Додати</button>
                </div>`;
    }).join('');

    const restaurant2Menu = document.getElementById("restaurant2-menu");
    restaurant2Menu.innerHTML = restaurant2.viewMenu().map(dish => {
        return `<div class="dish">
                    <span>${dish.name} - ${dish.price} грн</span>
                    <button onclick="addToOrder('${dish.name}', 'restaurant2')">Додати</button>
                </div>`;
    }).join('');
}

updateMenu();

// Додати страву в замовлення
function addToOrder(dishName, restaurant = 'restaurant1') {
    const selectedRestaurant = restaurant === 'restaurant1' ? restaurant1 : restaurant2;
    const dish = selectedRestaurant.menu.find(d => d.name === dishName);
    if (dish) {
        order.addDish(dish);
        document.getElementById("order-info").innerHTML = order.viewOrderInfo();
        updateOrderItems();
    }
}

// Оновлення списку страв у замовленні
function updateOrderItems() {
    const orderItems = document.getElementById("order-items");
    orderItems.innerHTML = order.dishes.map(dish => {
        return `<div class="order-item">
                    <span>${dish.name}</span>
                    <button onclick="removeFromOrder('${dish.name}')">Видалити</button>
                </div>`;
    }).join('');
}

// Видалити страву з замовлення
function removeFromOrder(dishName) {
    order.removeDish(dishName);
    updateOrderItems();
    document.getElementById("order-info").innerHTML = order.viewOrderInfo();
}

// Обробка оформлення замовлення
function submitOrder() {
    if (order.dishes.length === 0) {
        alert("Будь ласка, виберіть хоча б одну страву для замовлення.");
        return;
    }

    const paymentMethod = document.getElementById("payment-method").value;
    order.setPaymentMethod(paymentMethod);
    
    // Змінюємо статус на "Готування замовлення" після натискання кнопки
    order.updateStatus('Готування замовлення');
    
    alert(`Замовлення оформлено! Спосіб оплати: ${paymentMethod === 'cash' ? 'Готівка' : 'Картка'}`);
    document.getElementById("order-info").innerHTML = order.viewOrderInfo();
}

// Зміна статусу замовлення (для тестування)
function changeOrderStatus() {
    order.updateStatus('Готування замовлення');
    document.getElementById("order-info").innerHTML = order.viewOrderInfo();
}

// Передача замовлення кур'єру
function assignOrderToCourier() {
    if (order.status === 'Готування замовлення') {
        const courierData = getRandomCourier();  // Отримуємо випадкове ім'я та транспорт
        const courier = new Courier(courierData.name, courierData.transport);
        
        courier.takeOrder(order);  // Кур'єр бере замовлення
        document.getElementById("order-info").innerHTML = order.viewOrderInfo();
        document.getElementById("courier-info").innerHTML = courier.viewCourierInfo();
        alert("Замовлення передано кур'єру. Статус: В дорозі");
    } else {
        alert("Замовлення ще не готове для передачі кур'єру.");
    }
}

// Оновлення інформації про кур'єра
function updateCourierInfo() {
    const courier = new Courier("Олексій", "Автомобіль");
    document.getElementById("courier-info").innerHTML = courier.viewCourierInfo();
}

updateCourierInfo();
