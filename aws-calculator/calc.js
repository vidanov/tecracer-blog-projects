const runsPerHourOptions = [1, 2, 3, 4, 5, 6, 10, 12, 15, 30, 60];
const numberOfCanariesOptions = Array.from({ length: 7 }, (_, i) => i + 1);
let pricingData = {};
let pricePerRun = 0;

async function fetchPricingData() {
    try {
        const response = await fetch('https://awsgem.com/canarycalc/prices.json');
        if (!response.ok) throw new Error('Failed to fetch pricing data');
        pricingData = await response.json();
        populateRegionSelect();  // Populate regions and set default
    } catch (error) {
        console.error(error);
        alert('Failed to fetch pricing data');
    }
}

function populateRegionSelect() {
    const regionSelect = document.getElementById('regionSelect');
    const sortedRegions = Object.keys(pricingData).sort();
    sortedRegions.forEach(region => {
        const regionPricing = pricingData[region];
        const pricePerRun = parseFloat(Object.values(regionPricing)[0]);

        if (pricePerRun === 0) {
            return;
        }

        const option = document.createElement('option');
        option.value = region;
        option.textContent = `${region} - $${pricePerRun.toFixed(4)}`;
        regionSelect.appendChild(option);
    });

    // Set default region to 'eu-central-1' if available
    if (sortedRegions.includes('eu-central-1')) {
        regionSelect.value = 'eu-central-1';
        updatePricingInfo();  // Update pricing information based on the default region
    }
    
    // Add event listener after setting the default
    regionSelect.addEventListener('change', updatePricingInfo);
}

function updatePricingInfo() {
    const regionSelect = document.getElementById('regionSelect');
    const selectedRegion = regionSelect.value;
    const pricingSection = document.getElementById('pricingSection');
    
    if (selectedRegion === "") {
        pricingSection.classList.add('hidden');
        return;
    }
    
    pricingSection.classList.remove('hidden');
    const regionPricing = pricingData[selectedRegion];
    pricePerRun = parseFloat(Object.values(regionPricing)[0]);
    document.getElementById('freeRuns').textContent = '100';
    document.getElementById('pricePerRun').textContent = pricePerRun.toFixed(4);
    updatePricingTable();
}

function updatePricingTable() {
    const pricingTableBody = document.querySelector('#pricingTable tbody');
    pricingTableBody.innerHTML = '';
    runsPerHourOptions.forEach(runs => {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.textContent = runs;
        row.appendChild(cell);
        numberOfCanariesOptions.forEach(canaries => {
            const cell = document.createElement('td');
            cell.textContent = calculateMonthlyPrice(canaries, runs).toFixed(2);
            row.appendChild(cell);
        });
        pricingTableBody.appendChild(row);
    });
}

function calculateMonthlyPrice(canaries, runs) {
    const totalRuns = canaries * runs * 24 * 30;
    const freeRuns = 100;
    const paidRuns = Math.max(0, totalRuns - freeRuns);
    return paidRuns * pricePerRun;
}

function calculatePrice() {
    const numberOfCanaries = document.getElementById('numberOfCanaries').value;
    const runsPerHour = document.getElementById('runsPerHour').value;
    const estimatedPrice = calculateMonthlyPrice(numberOfCanaries, runsPerHour);
    const result = document.getElementById('result');
    result.innerHTML = `Estimated monthly price: $${estimatedPrice.toFixed(2)}`;
    
    const totalRuns = numberOfCanaries * runsPerHour * 24 * 30;
    const paidRuns = Math.max(0, totalRuns - 100);
    const example = document.getElementById('example');
    example.innerHTML = `
        <strong>For example, with ${numberOfCanaries} canary/canaries running ${runsPerHour} time(s) per hour:</strong><br>
        - Total runs = ${numberOfCanaries} × ${runsPerHour} × 24 × 30 = ${totalRuns}<br>
        - Paid runs = ${paidRuns}<br>
        - Monthly price = ${paidRuns} × $${pricePerRun.toFixed(4)} = $${estimatedPrice.toFixed(2)}
    `;
    
    document.getElementById('calculationResults').classList.remove('hidden');
}

document.getElementById('calculate').addEventListener('click', calculatePrice);
document.getElementById('year').textContent = new Date().getFullYear();

fetchPricingData();