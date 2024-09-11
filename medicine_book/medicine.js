const bookingEntries = [];

const form = document.getElementById('medicineSearchForm');
const storeResults = document.getElementById('storeResults');
const storesDiv = document.getElementById('stores');
const slipDiv = document.getElementById('slip');
const slipDetails = document.getElementById('slipDetails');
const bookingTable = document.getElementById('bookingTable');
const bookingsBody = document.getElementById('bookings');

const mrp = 10; // Assume MRP per unit

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const parentName = document.getElementById('parentName').value;
    const location = document.getElementById('location').value;
    const medicine = document.getElementById('medicine').value;

    const stores = [
        { name: 'HealthCare Pharmacy', location: location, medicine: medicine, quantity: Math.floor(Math.random() * 11) + 10 },
        { name: 'City Meds Store', location: location, medicine: medicine, quantity: Math.floor(Math.random() * 11) + 10 },
        // More stores...
    ];

    storesDiv.innerHTML = ''; // Clear previous results
    stores.forEach(store => {
        const storeItem = document.createElement('div');
        storeItem.classList.add('store-item');
        const storePrice = mrp;
        storeItem.innerHTML = `
            <strong>${store.name}</strong> - ${store.location}<br>
            Medicine: ${store.medicine}<br>
            Quantity Available: ${store.quantity}<br>
            Price per Unit: INR ${storePrice}<br>
            Select Quantity: <input type="range" min="1" max="${store.quantity}" value="1" id="quantity_${store.name}" onchange="updatePrice('${store.name}', ${storePrice}, this.value)">
            <span id="quantityDisplay_${store.name}">1</span> Units<br>
            Total Price: INR <span id="price_${store.name}">${storePrice}</span><br>
            <button onclick="bookStore('${store.name}', '${store.location}', '${store.medicine}', '${parentName}', document.getElementById('quantity_${store.name}').value, ${storePrice})">Book Now</button>
        `;
        storesDiv.appendChild(storeItem);
    });

    storeResults.style.display = 'block';
});

function updatePrice(storeName, pricePerUnit, quantity) {
    const totalPrice = pricePerUnit * quantity;
    document.getElementById(`price_${storeName}`).innerText = totalPrice;
    document.getElementById(`quantityDisplay_${storeName}`).innerText = quantity;
}

function bookStore(storeName, location, medicine, parentName, quantity, pricePerUnit) {
    const totalPrice = pricePerUnit * quantity;
    const payment = prompt(`Total amount is INR ${totalPrice}. Please enter payment amount in INR:`);
    if (payment === null || payment === '' || parseInt(payment) < totalPrice) {
        alert('Insufficient amount paid. Booking failed.');
        return;
    }

    const booking = { parentName, medicine, storeName, totalAmountPaid: totalPrice };
    bookingEntries.push(booking);

    slipDetails.innerHTML = `Store: ${storeName}<br>Location: ${location}<br>Medicine: ${medicine}<br>Quantity: ${quantity}<br>Total Price: INR ${totalPrice}`;
    slipDiv.style.display = 'block';

    const bookingRow = document.createElement('tr');
    bookingRow.innerHTML = `<td>${parentName}</td><td>${medicine}</td><td>${storeName}</td><td>INR ${totalPrice}</td>`;
    bookingsBody.appendChild(bookingRow);
    bookingTable.style.display = 'table';
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const logoUrl = 'https://static.toiimg.com/thumb/msid-51767839,width-400,resizemode-4/51767839.jpg';
    const imgWidth = 40;
    const imgHeight = 20;
    const marginX = (doc.internal.pageSize.getWidth() - imgWidth) / 2;

    doc.addImage(logoUrl, 'PNG', marginX, 10, imgWidth, imgHeight);

    doc.setFontSize(20);
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = 'HealthCare24';
    const textWidth = doc.getTextWidth(title);
    const xPosition = (pageWidth - textWidth) / 2;
    doc.text(title, xPosition, imgHeight + 20);

    doc.setFontSize(12);
    doc.text(slipDetails.innerText, 10, imgHeight + 40);

    doc.save('booking-slip.pdf');
}
