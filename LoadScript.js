const equipmentList = document.getElementById('equipmentList');
const extensionsList = document.getElementById('extensionsList');

const item = {
    category: 'Main equipment',
    name: 'OpnetLW',
    wattsNormal: 300,
    wattsPeak: 600,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&h=200',
    alt: 'OpnetLW',
}

const cardHTML = `
  <li class="equipment-item">
  <h4 class="equipment">${item.name}</h4>
    <p class="normal-usage">${'Normal Usage: ' + item.wattsNormal}W</p>
    <p class="peak-usage">${'Peak Usage: ' + item.wattsPeak}W</p>
    <img src="${item.image}" alt="${item.alt}">
<span class="quantity">Quantity: <span class="qty-count">0</span></span>
                <button class="decrease">−</button>
      <button class="increase">+</button>
  </li>
`;

equipmentList.insertAdjacentHTML('beforeend', cardHTML);

console.log(item);
console.log(item.name);

console.log('Equipment List:', equipmentList);
console.log('Extensions List:', extensionsList);