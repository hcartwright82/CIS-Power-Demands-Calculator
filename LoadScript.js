const equipmentList = document.getElementById('equipmentList');
const extensionsList = document.getElementById('extensionsList');

const HOURS_IN_DAY = 24;
const GENERATOR_RATED_WATTS = 2000;
const DERATE_FACTOR = 0.8;
const GENERATOR_USABLE_WATTS = GENERATOR_RATED_WATTS * DERATE_FACTOR;

const FUEL_RATE_LOW = 0.50;
const FUEL_RATE_MID = 0.75;
const FUEL_RATE_HIGH = 1.35;


const LAPTOP_IMAGE = 'https://images.unsplash.com/vector-1739547092206-9a931584e6f4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wc3xlbnwwfHwwfHx8MA%3D%3D';
const SATELLITE_IMAGE = 'https://images.unsplash.com/photo-1786945625043-f5bf06e03a2d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2F0dGVsaXRlJTIwcmVjaWV2ZXJ8ZW58MHx8MHx8fDA%3D';
const OPNET_LAPTOP_IMAGE = 'https://images.unsplash.com/vector-1756376206471-5c5930bc84dd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGxhcHRvcHxlbnwwfHwwfHx8MA%3D%3D';
const RACK_IMAGE = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=60';

const items = [
    {
        category: 'primary',
        name: 'Opnet LW',
        wattsNormal: 300,
        wattsPeak: 600,
        image: RACK_IMAGE,
        alt: 'Server racks',
    },
    {
        category: 'primary',
        name: 'Raven DSOC',
        wattsNormal: 350,
        wattsPeak: 500,
        image: RACK_IMAGE,
        alt: 'Server racks',
    },
    {
        category: 'primary',
        name: 'LBS Small',
        wattsNormal: 150,
        wattsPeak: 300,
        image: RACK_IMAGE,
        alt: 'Server racks',
    },
    {
        category: 'primary',
        name: 'OLRT',
        wattsNormal: 600,
        wattsPeak: 900,
        image: RACK_IMAGE,
        alt: 'Server racks',
    },
    {
        category: 'primary',
        name: 'Osprey',
        wattsNormal: 300,
        wattsPeak: 500,
        image: RACK_IMAGE,
        alt: 'Server racks',
    },
    {
        category: 'primary',
        name: 'Snapper',
        wattsNormal: 300,
        wattsPeak: 500,
        image: SATELLITE_IMAGE,
        alt: 'Satellite dish',
    },
    {
        category: 'primary',
        name: 'CCT120',
        wattsNormal: 300,
        wattsPeak: 500,
        image: SATELLITE_IMAGE,
        alt: 'Satellite dish',
    },
    {
        category: 'primary',
        name: 'OneWeb',
        wattsNormal: 100,
        wattsPeak: 150,
        image: SATELLITE_IMAGE,
        alt: 'Satellite dish',
    },
    {
        category: 'primary',
        name: 'Triton',
        wattsNormal: 100,
        wattsPeak: 200,
        image: RACK_IMAGE,
        alt: 'Server racks',
    },
    {
        category: 'primary',
        name: 'Starshield',
        wattsNormal: 50,
        wattsPeak: 75,
        image: SATELLITE_IMAGE,
        alt: 'Satellite dish',
    },
    {
        category: 'extension',
        name: 'Modnet O Laptop',
        wattsNormal: 50,
        wattsPeak: 90,
        image: LAPTOP_IMAGE,
        alt: 'Laptop',
    },
    {
        category: 'extension',
        name: 'Modnet S Laptop',
        wattsNormal: 50,
        wattsPeak: 90,
        image: LAPTOP_IMAGE,
        alt: 'Laptop',
    },
    {
        category: 'extension',
        name: 'Opnet LW Laptop',
        wattsNormal: 50,
        wattsPeak: 90,
        image: OPNET_LAPTOP_IMAGE,
        alt: 'Opnet Laptop',
    },
    {
        category: 'extension',
        name: 'Opnet Blue Laptop',
        wattsNormal: 50,
        wattsPeak: 90,
        image: OPNET_LAPTOP_IMAGE,
        alt: 'Opnet Laptop',
    },
];

function buildCard(item, index) {
    return `
    <li class="equipment-item" data-index="${index}">
      <h4 class="equipment">${item.name}</h4>
      <p class="normal-usage">Normal Usage: ${item.wattsNormal}W</p>
      <p class="peak-usage">Peak Usage: ${item.wattsPeak}W</p>
      <img src="${item.image}" alt="${item.alt}">
      <span class="quantity">Quantity: <span class="qty-count">0</span></span>
      <button class="decrease">−</button>
      <button class="increase">+</button>
    </li>
  `;
}

items.forEach((item, index) => {
    const target = item.category === 'extension' ? extensionsList : equipmentList;
    target.insertAdjacentHTML('beforeend', buildCard(item, index));
});

const quantities = items.map(() => 0);

const cards = document.querySelectorAll('.equipment-item');

cards.forEach(function (card) {
    const index = Number(card.dataset.index);

    const plusButton = card.querySelector('.increase');
    const minusButton = card.querySelector('.decrease');
    const countSpan = card.querySelector('.qty-count');

    plusButton.addEventListener('click', function () {
        quantities[index] = quantities[index] + 1;
        countSpan.textContent = quantities[index];
        recalculate();
    });

    minusButton.addEventListener('click', function () {
        if (quantities[index] > 0) {
            quantities[index] = quantities[index] - 1;
        }
        countSpan.textContent = quantities[index];
        recalculate();
    });
});

const inputA = document.getElementById('DeploymentLength');
const inputB = document.getElementById('PeakRunningHours');

const outputs = {
    normalTotal: document.getElementById('outNormalTotal'),
    peakTotal: document.getElementById('outPeakTotal'),
    dailyWattHours: document.getElementById('outDailyWattHours'),
    generators: document.getElementById('outGenerators'),
    averageLoad: document.getElementById('outAverageLoad'),
    loadPercentage: document.getElementById('outLoadPercentage'),
    fuelRate: document.getElementById('outFuelRate'),
    totalFuel: document.getElementById('outTotalFuel'),
};

function readInput(input, min, max) {
    const value = Number(input.value);
    if (input.value === '' || Number.isNaN(value)) {
        return min;
    }
    return Math.min(Math.max(value, min), max);
}

function fuelRateFor(loadPercentage) {
    if (loadPercentage <= 25) {
        return FUEL_RATE_LOW;
    }
    if (loadPercentage <= 50) {
        return FUEL_RATE_MID;
    }
    return FUEL_RATE_HIGH;
}

function calculatePower(items, quantities, peakHours, deploymentDays) {
    let normalTotal = 0;
    let peakTotal = 0;

    items.forEach(function (item, index) {
        const quantity = quantities[index];
        normalTotal = normalTotal + item.wattsNormal * quantity;
        peakTotal = peakTotal + item.wattsPeak * quantity;
    });

    const normalHours = HOURS_IN_DAY - peakHours;
    const dailyWattHours = (normalTotal * normalHours) + (peakTotal * peakHours);

    const generators = Math.ceil(peakTotal / GENERATOR_USABLE_WATTS);
    const installedCapacity = generators * GENERATOR_RATED_WATTS;

    const averageLoad = dailyWattHours / HOURS_IN_DAY;

    const loadPercentage = installedCapacity === 0
        ? 0
        : (averageLoad / installedCapacity) * 100;

    const fuelRate = fuelRateFor(loadPercentage);
    const totalFuel = fuelRate * generators * HOURS_IN_DAY * deploymentDays;

    return {
        normalTotal: normalTotal,
        peakTotal: peakTotal,
        dailyWattHours: dailyWattHours,
        generators: generators,
        installedCapacity: installedCapacity,
        averageLoad: averageLoad,
        loadPercentage: loadPercentage,
        fuelRate: fuelRate,
        totalFuel: totalFuel,
    };
}

function formatNumber(value, decimals) {
    return value.toLocaleString('en-GB', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

function displayResults(results) {
    outputs.normalTotal.textContent = formatNumber(results.normalTotal, 0) + ' W';
    outputs.peakTotal.textContent = formatNumber(results.peakTotal, 0) + ' W';
    outputs.dailyWattHours.textContent = formatNumber(results.dailyWattHours, 0) + ' Wh';
    outputs.generators.textContent = formatNumber(results.generators, 0);
    outputs.averageLoad.textContent = formatNumber(results.averageLoad, 1) + ' W';
    outputs.loadPercentage.textContent = formatNumber(results.loadPercentage, 1) + '%';
    outputs.fuelRate.textContent = formatNumber(results.fuelRate, 2) + ' L/h';
    outputs.totalFuel.textContent = formatNumber(results.totalFuel, 1) + ' L';
}

function recalculate() {
    const deploymentDays = readInput(inputA, 1, 365);
    const peakHours = readInput(inputB, 0, HOURS_IN_DAY);

    const results = calculatePower(items, quantities, peakHours, deploymentDays);

    displayResults(results);
    return results;
}

inputA.addEventListener('input', recalculate);
inputB.addEventListener('input', recalculate);

recalculate();
