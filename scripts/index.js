// ============================================
// Constants
// ============================================
const API_URL = 'https://dc-coffeerun.herokuapp.com/api/coffeeOrders';

// ============================================
// DOM Selection
// ============================================
const orderForm = document.querySelector('[data-form]');
const notificationArea = document.querySelector('[data-notification]');
const resetButton = document.querySelector('[data-reset-button]');

const orderListingArea = document.querySelector('[data-order-area]');
const orderListingButton = document.querySelector('[data-load-orders]');

// ============================================
// Helper functions
// ============================================
function handleSubmit(event) {
	event.preventDefault();
	console.log('You get a coffee and you get a coffee and you get a coffee.');

	console.log(event.target);
	// debugger;
	// We're gonna Ajax that thing.
	// Call fetch()
	// pass it the URL
	// and an object with a method and a body
	// const url = event.target.action;
	const url = API_URL;
	const method = event.target.method;
	const elements = event.target.elements;
	const data = {
		strength: elements.strength.value,
		flavor: elements.flavor.value,
		size: elements.size.value,
		coffee: elements.coffee.value,
		emailAddress: elements.emailAddress.value
	};
	fetch(url, {
		method: method,
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
			// "Content-Type": "application/x-www-form-urlencoded",
		},
		body: JSON.stringify(data)
	})
		.then((r) => r.json())
		.then((orderInfo) => {
			// check the orderInfo for errors
			// && is a "falsey hunter"
			// It moves from left to right, and will stop moving
			// when it finds the first falsey expression.
			if (orderInfo.name && orderInfo.name === 'ValidationError') {
				notifyUser(`I'm sorry. 
				Please fill out the coffee field and the email address field. 
				Thanks. K. Byeeee.`);
			} else {
				notifyUser(`You coffee is totally (not) on its way!`);
			}
		}); // gotta wrap it in an anonymous function

	// debugger;
}

function notifyUser(notificationText) {
	// create a div
	const notificationBox = document.createElement('div');
	// add some text content
	notificationBox.textContent = notificationText;

	// Must check for the existence of a .firstChild
	// otherwise, the removeChild function call will fail.
	// if (notificationArea.firstChild) {
	//     notificationArea.removeChild(notificationArea.firstChild);
	// }
	notificationArea.innerHTML = '';

	// append to...something...somewhere...somehow...
	notificationArea.appendChild(notificationBox);
}

function confirmReset(e) {
	let doesWantToReset = confirm('Really?');
	if (!doesWantToReset) {
		e.preventDefault();
	}
}

// working with one coffee order
function convertOrderToElement(orderInfo) {
	// debugger;
	const orderElement = document.createElement('p');
	const orderText = `
		  ${orderInfo.size} ${orderInfo.flavor} ${orderInfo.coffee} for ${orderInfo.emailAddress} 
		  <br> 
		  (${orderInfo.strength})
	`;
	orderElement.innerHTML = orderText;  // Danger, Will Robinson!
	return orderElement;

}

// working with an array of coffee orders
function convertArrayOfOrdersToElements(giantFrickinOrderObject) {
	let orderArray = Object.values(giantFrickinOrderObject);
	let elementsArray = orderArray.map(convertOrderToElement);	
	return elementsArray;
}

function handleError(err) {
	console.log('you messed up chrisaquino');
}

function handleNetworkError(err) {
	console.log('no network. boo.');

	// 1. grab some old data from localStorage
	// 2. return that data to the next .then
	return JSON.parse(localStorage.getItem('coffee-orders'));
}

function getAndShowOrders(event) {
	console.log('1. hey! a click!');
	// console.log(event);
	console.log('2. about to fetch!');
	
	fetch(API_URL) // sends a GET
		.then(response => response.json())
		.catch(handleNetworkError)
		.then(convertArrayOfOrdersToElements)
		.then(elementsArray => {		
			console.log('4. working with the data');
			elementsArray.forEach(e => orderListingArea.appendChild(e))
		})
		.catch(handleError);

	console.log('3. yeah. we are fetching');
}

// ============================================
// Main Event Listeners
// ============================================
console.log('about to add event listener!');
orderForm.addEventListener('submit', handleSubmit);
resetButton.addEventListener('click', confirmReset);
orderListingButton.addEventListener('click', getAndShowOrders);
