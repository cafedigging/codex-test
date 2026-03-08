const cards = document.querySelectorAll('.card');
const selectedCafe = document.getElementById('selected-cafe');
const mapFrame = document.getElementById('map-frame');

function mapSrc(lat, lng) {
  const delta = 0.012;
  const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function selectCafe(card) {
  cards.forEach((item) => item.classList.remove('active'));
  card.classList.add('active');

  const { lat, lng, name } = card.dataset;
  selectedCafe.textContent = `Selected: ${name}`;
  mapFrame.src = mapSrc(Number(lat), Number(lng));
}

cards.forEach((card, index) => {
  card.querySelector('.card__button').addEventListener('click', () => selectCafe(card));

  if (index === 0) {
    selectCafe(card);
  }
});
