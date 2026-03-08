// Load Data
let milkData = JSON.parse(localStorage.getItem('milkLogs')) || [];
let pricePerLiter = localStorage.getItem('milkPrice') || 0;

// Set default date to today in the input
const dateInput = document.getElementById('entry-date');
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;

document.getElementById('milk-price').value = pricePerLiter;

// Listen for price changes
document.getElementById('milk-price').addEventListener('input', (e) => {
    pricePerLiter = e.target.value;
    localStorage.setItem('milkPrice', pricePerLiter);
    renderReport();
});

function saveEntry() {
    const selectedDate = dateInput.value;
    const morn = parseFloat(document.getElementById('morning-input').value) || 0;
    const eve = parseFloat(document.getElementById('evening-input').value) || 0;

    if (!selectedDate) return alert("Please select a date!");

    // Find if the date already exists in our records
    const existingIndex = milkData.findIndex(item => item.date === selectedDate);

    if (existingIndex > -1) {
        milkData[existingIndex] = { date: selectedDate, morning: morn, evening: eve };
    } else {
        milkData.push({ date: selectedDate, morning: morn, evening: eve });
    }

    // Sort data by date so the table looks organized
    milkData.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem('milkLogs', JSON.stringify(milkData));
    
    // Clear inputs for next use
    document.getElementById('morning-input').value = "";
    document.getElementById('evening-input').value = "";
    
    renderReport();
    alert(`Success: Entry for ${selectedDate} updated!`);
}

function renderReport() {
    const tbody = document.getElementById('report-body');
    tbody.innerHTML = "";
    let totalLiters = 0;

    milkData.forEach(entry => {
        const dayTotal = entry.morning + entry.evening;
        totalLiters += dayTotal;

        const row = `<tr>
            <td>${entry.date}</td>
            <td>${entry.morning}L</td>
            <td>${entry.evening}L</td>
            <td><strong>${dayTotal.toFixed(1)}L</strong></td>
        </tr>`;
        tbody.innerHTML += row;
    });

    const totalCost = totalLiters * pricePerLiter;
    document.getElementById('weekly-liters').innerText = totalLiters.toFixed(2);
    document.getElementById('weekly-cost').innerText = totalCost.toFixed(2);
}

function resetCycle() {
    if(confirm("This will clear ALL current entries and reset the bill to $0. Continue?")) {
        milkData = [];
        localStorage.setItem('milkLogs', JSON.stringify(milkData));
        renderReport();
    }
}

// Initial render
renderReport();