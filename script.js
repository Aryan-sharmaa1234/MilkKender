const inputs = document.querySelectorAll('.qty-input');
const rateInput = document.getElementById('basePrice');
const literDisplay = document.getElementById('totalLiters');
const priceDisplay = document.getElementById('totalPrice');

function calculate() {
    let totalLiters = 0;
    const ratePerLiter = parseFloat(rateInput.value) || 0;

    inputs.forEach(input => {
        const bottleSize = parseFloat(input.getAttribute('data-size'));
        const quantity = parseFloat(input.value) || 0;
        totalLiters += (bottleSize * quantity);
    });

    const totalPrice = totalLiters * ratePerLiter;
    literDisplay.innerText = totalLiters.toFixed(1);
    priceDisplay.innerText = Math.round(totalPrice).toLocaleString('en-IN');
}

function generateReceipt() {
    const receiptCard = document.getElementById('receipt-card');
    const receiptList = document.getElementById('receipt-list');
    const receiptTotal = document.getElementById('receipt-grand-total');
    const rate = parseFloat(rateInput.value) || 0;
    
    receiptList.innerHTML = ''; // Clear previous data
    let hasData = false;

    inputs.forEach(input => {
        const qty = parseFloat(input.value) || 0;
        if (qty > 0) {
            hasData = true;
            const size = input.getAttribute('data-size');
            const itemTotal = (qty * parseFloat(size)) * rate;
            
            const itemRow = document.createElement('div');
            itemRow.style.display = 'flex';
            itemRow.style.justifyContent = 'space-between';
            itemRow.style.padding = '8px 0';
            itemRow.innerHTML = `
                <span>${size}L Bottle (x${qty})</span>
                <span>₹${Math.round(itemTotal).toLocaleString('en-IN')}</span>
            `;
            receiptList.appendChild(itemRow);
        }
    });

    if (hasData) {
        receiptCard.style.display = 'block';
        receiptTotal.innerText = '₹' + priceDisplay.innerText;
        receiptCard.scrollIntoView({ behavior: 'smooth' });
    } else {
        alert("Please enter quantities before generating a receipt.");
    }
}

function clearAll() {
    inputs.forEach(input => input.value = '');
    document.getElementById('receipt-card').style.display = 'none';
    calculate();
}

inputs.forEach(input => {
    input.addEventListener('input', calculate);
});

rateInput.addEventListener('input', calculate);
calculate();