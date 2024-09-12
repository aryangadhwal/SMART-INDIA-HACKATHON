const bedCounts = {
    hospital1: 50,
    hospital2: 40,
    hospital3: 30
};
const hospitalNames = {
    hospital1: "Hospital A",
    hospital2: "Hospital B",
    hospital3: "Hospital C"
};
let bedStatus = [];
let selectedHospital = 'hospital1';
const bedsContainer = document.getElementById('beds');
const timeSlotSelect = document.getElementById('timeSlotSelect');
const datePicker = document.getElementById('datePicker');
const bookedBedsBody = document.getElementById('bookedBedsBody');
const userName = document.getElementById('userName');
const userAge = document.getElementById('userAge');
const userGender = document.getElementById('userGender');
const slipContainer = document.getElementById('slipContainer');
const slipDetails = document.getElementById('slipDetails');
const hospitalSelect = document.getElementById('hospitalSelect');

const timeSlots = [];
for (let i = 0; i < 24; i++) {
    const hour = i < 10 ? '0' + i : i;
    timeSlots.push(`${hour}:00 - ${hour}:59`);
}

function updateTimeSlots() {
    timeSlotSelect.innerHTML = '<option value="">--Select Time Slot--</option>';
    timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        timeSlotSelect.appendChild(option);
    });
    updateBeds();
}

function generateBedStatus() {
    const selectedDate = datePicker.value;
    const selectedTimeSlot = timeSlotSelect.value;
    const key = `bedStatus_${selectedHospital}_${selectedDate}_${selectedTimeSlot}`;
    const storedStatus = localStorage.getItem(key);

    if (storedStatus) {
        bedStatus = JSON.parse(storedStatus);
    } else {
        bedStatus = Array(bedCounts[selectedHospital]).fill(0); 
        for (let i = 0; i < bedCounts[selectedHospital]; i++) {
            if (Math.random() > 0.8) { 
                bedStatus[i] = 1; 
            }
        }
        localStorage.setItem(key, JSON.stringify(bedStatus));
    }
    renderBeds();
    updateBookedBedsTable();
}

function renderBeds() {
    bedsContainer.innerHTML = '';
    bedStatus.forEach((status, index) => {
        const bedDiv = document.createElement('div');
        bedDiv.classList.add('bed');
        bedDiv.textContent = `Bed ${index + 1}`;

        if (status === 0) {
            bedDiv.classList.add('available');
            bedDiv.addEventListener('click', () => bookBed(index));
        } else if (status === 1) {
            bedDiv.classList.add('unavailable');
        } else if (status === 2) {
            bedDiv.classList.add('booked');
        }

        bedsContainer.appendChild(bedDiv);
    });
}

function updateBeds() {
    const selectedDate = datePicker.value;
    const selectedTimeSlot = timeSlotSelect.value;
    selectedHospital = hospitalSelect.value;

    if (selectedHospital && selectedDate && selectedTimeSlot) {
        generateBedStatus();
    }
}

function bookBed(bedIndex) {
    const selectedDate = datePicker.value;
    const selectedTimeSlot = timeSlotSelect.value;
    const bedKey = `bedStatus_${selectedHospital}_${selectedDate}_${selectedTimeSlot}`;
    
    bedStatus[bedIndex] = 2; 
    localStorage.setItem(bedKey, JSON.stringify(bedStatus));
    
    renderBeds();
    updateBookedBedsTable();
}

function updateBookedBedsTable() {
    bookedBedsBody.innerHTML = '';

    const selectedDate = datePicker.value;
    const selectedTimeSlot = timeSlotSelect.value;

    bedStatus.forEach((status, index) => {
        if (status === 2) {
            const row = document.createElement('tr');

            const bedNumberCell = document.createElement('td');
            bedNumberCell.textContent = index + 1;
            row.appendChild(bedNumberCell);

            const dateCell = document.createElement('td');
            dateCell.textContent = selectedDate;
            row.appendChild(dateCell);

            const emergencyCell = document.createElement('td');
            emergencyCell.textContent = 'Yes';
            row.appendChild(emergencyCell);

            const timeSlotCell = document.createElement('td');
            timeSlotCell.textContent = selectedTimeSlot;
            row.appendChild(timeSlotCell);

            const placeCell = document.createElement('td');
            placeCell.textContent = document.getElementById('placeName').value; 
            row.appendChild(placeCell); 

            const unbookButtonCell = document.createElement('td');
            const unbookButton = document.createElement('button');
            unbookButton.textContent = 'Unbook';
            unbookButton.classList.add('unbook-button');
            unbookButton.addEventListener('click', () => unbookBed(index));
            unbookButtonCell.appendChild(unbookButton);
            row.appendChild(unbookButtonCell);

            const downloadSlipCell = document.createElement('td');
            const downloadSlipButton = document.createElement('button');
            downloadSlipButton.textContent = 'Download Slip';
            downloadSlipButton.classList.add('download-slip-button');
            downloadSlipButton.addEventListener('click', () => generateSlip(index + 1, selectedDate, selectedTimeSlot));
            downloadSlipCell.appendChild(downloadSlipButton);
            row.appendChild(downloadSlipCell);

            bookedBedsBody.appendChild(row);
        }
    });
}

function unbookBed(bedIndex) {
    const selectedDate = datePicker.value;
    const selectedTimeSlot = timeSlotSelect.value;
    const bedKey = `bedStatus_${selectedHospital}_${selectedDate}_${selectedTimeSlot}`;
    
    bedStatus[bedIndex] = 0; 
    localStorage.setItem(bedKey, JSON.stringify(bedStatus));
    
    renderBeds();
    updateBookedBedsTable();
}

function generateSlip(bedNumber, date, timeSlot) {
    const placeName = document.getElementById('placeName').value;
    const name = userName.value;
    const age = userAge.value;
    const gender = userGender.value;

    slipDetails.innerHTML = `
        <strong>Booking Details:</strong><br>
        Bed Number: ${bedNumber}<br>
        Booking Date: ${date}<br>
        Time Slot: ${timeSlot}<br>
        Hospital: ${hospitalNames[selectedHospital]}<br>
        Name of Place: ${placeName}<br>
        Name: ${name}<br>
        Age: ${age}<br>
        Gender: ${gender}
    `;
    
    slipContainer.style.display = 'block';
    setTimeout(() => downloadPDF(), 500);
}

function downloadPDF() {
    html2canvas(slipContainer).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('booking_slip.pdf');
    });

    slipContainer.style.display = 'none';
}

updateTimeSlots();
