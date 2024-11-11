let selectedFilters = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((Response) => Response.json())
    .then((Response) => ListJobs(Response))
    .catch((error) => console.log(error));
});

async function ListJobs(data) {
  let appendix = document.getElementById("container");

  data.forEach((card) => {
    let cardEntries = document.createElement("div");
    cardEntries.innerHTML = `
        <div class="card ${card.featured ? "featured" : ""}">
            <img src="${card.logo}" alt="logo">
            <div class="info">
                <div class="left">
                    <div class="top">
                        <h2 class="company-name">${card.company}</h2>
                        <div class="details">
                            <p style="display: ${card.new ? "block" : "none"};">New!</p>
                            <p style="display: ${card.featured ? "block" : "none"};">FEATURED</p>
                        </div>
                    </div>
                    <h2>${card.position}</h2>
                    <ul class="details-list">
                        <li>${card.postedAt}</li>
                        <li>${card.contract}</li>
                        <li>${card.location}</li>
                    </ul>
                </div>
                <hr>

                <div class="right">
                    <button class="filter-btn">${card.role}</button>
                    <button class="filter-btn">${card.level}</button>
                    ${card.languages
                      .map((language) => `<button class="filter-btn">${language}</button>`)
                      .join("")}
                </div>
            </div>
        </div>
        `;

    appendix.appendChild(cardEntries);

    cardEntries.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            addFilter(button.textContent);
        });
    });
  });
}

function addFilter(filter) {
    if (!selectedFilters.includes(filter)) {
        selectedFilters.push(filter);
        updateFilter();
        filterCards();
    }
}

function updateFilter() {
    const filterContainer = document.getElementById('filter-container');
    const selectedFiltersContainer = document.getElementById('selected-filters');

    selectedFiltersContainer.innerHTML = selectedFilters.map(filter => `
        <span class="filter-tag">
            ${filter}
            <button class="remove-filter" onclick="removeFilter('${filter}')">✕</button>
        </span>
    `).join('');
    
    filterContainer.style.display = selectedFilters.length > 0 ? 'flex' : 'none';
}

function removeFilter(filter) {
    selectedFilters = selectedFilters.filter(f => f !== filter);
    updateFilter();
    filterCards();
}

function filterCards() {
    const allCards = document.querySelectorAll('.card');

    allCards.forEach(card => {
        const cardRole = card.querySelector('.filter-btn').textContent;
        const cardLevel = card.querySelector('.filter-btn + .filter-btn').textContent;
        const cardLanguages = Array.from(card.querySelectorAll('.filter-btn'))
            .slice(2)
            .map(btn => btn.textContent);

        const matchesFilters = selectedFilters.every(filter =>
            [cardRole, cardLevel, ...cardLanguages].includes(filter)
        );

        card.style.display = matchesFilters ? 'flex' : 'none';
    });
}

document.getElementById('clear-filters').addEventListener('click', () => {
    selectedFilters = [];
    updateFilter();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.style.display = 'flex');
});
