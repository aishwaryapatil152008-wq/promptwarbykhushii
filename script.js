
/* =========================================
   VAJRA — SMART CITY EXPLORER
   Complete dashboard JavaScript
   ========================================= */

// Illustrative demo data.
// Prices, ratings and descriptions are not live verified data.

const places = [
    {
        id: 1,
        name: "Shaniwar Wada",
        category: "culture",
        location: "Shaniwar Peth, Pune",
        rating: 4.7,
        cost: 25,
        tag: "HERITAGE",
        image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=800&q=80",
        description: "Discover one of Pune's best-known historical landmarks."
    },
    {
        id: 2,
        name: "FC Road Cafés",
        category: "food",
        location: "Fergusson College Road",
        rating: 4.5,
        cost: 200,
        tag: "FOOD & CAFÉS",
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
        description: "Explore cafés, snacks and popular local hangouts."
    },
    {
        id: 3,
        name: "Saras Baug",
        category: "nature",
        location: "Swargate, Pune",
        rating: 4.6,
        cost: 0,
        tag: "PARK & NATURE",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
        description: "Enjoy greenery and a peaceful outdoor walk."
    },
    {
        id: 4,
        name: "Local Food Spots",
        category: "food",
        location: "Camp, Pune",
        rating: 4.3,
        cost: 120,
        tag: "BUDGET PICK",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
        description: "Discover sample budget-friendly food options."
    },
    {
        id: 5,
        name: "Aga Khan Palace",
        category: "culture",
        location: "Kalyani Nagar, Pune",
        rating: 4.7,
        cost: 25,
        tag: "HISTORIC SITE",
        image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=800&q=80",
        description: "Explore an important heritage site and its history."
    },
    {
        id: 6,
        name: "Vetal Tekdi",
        category: "nature",
        location: "Paud Road, Pune",
        rating: 4.5,
        cost: 0,
        tag: "OUTDOOR",
        image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
        description: "Enjoy nature and scenic walking trails."
    }
];

// -----------------------------------------
// ELEMENT SELECTORS
// -----------------------------------------

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const savedPlaces = new Set();
let toastTimer;

// -----------------------------------------
// NOTIFICATION MESSAGE
// -----------------------------------------

function showToast(message) {
    const toast = $("#toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// -----------------------------------------
// NAVIGATION
// -----------------------------------------

function goPage(pageName) {
    const targetPage = document.getElementById(pageName);

    if (!targetPage) return;

    $$(".page").forEach(page => {
        page.classList.remove("active");
    });

    targetPage.classList.add("active");

    $$(".nav-link").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageName
        );
    });

    $("#sidebar").classList.remove("open");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageName === "explore") {
        renderExplore();
    }

    if (pageName === "food") {
        renderPlaces(
            places.filter(place => place.category === "food"),
            "foodPlaces"
        );
    }

    if (pageName === "culture") {
        renderPlaces(
            places.filter(place => place.category === "culture"),
            "culturePlaces"
        );
    }

    if (pageName === "saved") {
        renderSavedPlaces();
    }
}

// -----------------------------------------
// SAFE TEXT DISPLAY
// -----------------------------------------

function escapeHTML(value) {
    const replacements = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return String(value).replace(/[&<>"']/g, character => {
        return replacements[character];
    });
}

// -----------------------------------------
// CREATE PLACE CARDS
// -----------------------------------------

function createPlaceCard(place) {
    const isSaved = savedPlaces.has(place.id);

    return `
        <article class="place-card">

            <div class="place-image">

                <img
                    src="${escapeHTML(place.image)}"
                    alt="${escapeHTML(place.name)}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://placehold.co/800x450/eaf0ff/315bea?text=VAJRA+City+Explorer'">

                <span class="place-tag">
                    ${escapeHTML(place.tag)}
                </span>

                <button
                    class="save-btn ${isSaved ? "saved" : ""}"
                    data-save="${place.id}"
                    aria-label="${isSaved ? "Remove saved place" : "Save place"}: ${escapeHTML(place.name)}"
                    aria-pressed="${isSaved}">
                    ${isSaved ? "♥" : "♡"}
                </button>

            </div>

            <div class="place-info">

                <div class="place-title-row">
                    <div>
                        <h3>${escapeHTML(place.name)}</h3>

                        <div class="place-location">
                            📍 ${escapeHTML(place.location)}
                        </div>
                    </div>

                    <span class="rating">
                        ★ ${place.rating.toFixed(1)}
                    </span>
                </div>

                <p class="place-description">
                    ${escapeHTML(place.description)}
                </p>

                <div class="place-meta">
                    <span>
                        <strong>
                            ${place.cost === 0
                                ? "Free"
                                : "₹" + place.cost}
                        </strong>
                        / person est.
                    </span>

                    <button data-details="${place.id}">
                        Details ↗
                    </button>
                </div>

            </div>
        </article>
    `;
}

// -----------------------------------------
// RENDER PLACE COLLECTIONS
// -----------------------------------------

function renderPlaces(list, containerId) {
    const container = document.getElementById(containerId);

    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `
            <div class="panel">
                <h3>No places found</h3>
                <p>Try another search or category.</p>
            </div>
        `;

        return;
    }

    container.innerHTML = list.map(createPlaceCard).join("");
}

// -----------------------------------------
// SAVED PLACES
// -----------------------------------------

function renderSavedPlaces() {
    const saved = places.filter(place => savedPlaces.has(place.id));

    renderPlaces(saved, "savedPlaces");

    $("#savedEmpty").style.display =
        saved.length === 0 ? "block" : "none";
}

// -----------------------------------------
// SEARCH AND FILTER
// -----------------------------------------

function renderExplore() {
    const searchText = ($("#placeSearch").value || "")
        .trim()
        .toLowerCase();

    const category = $("#categoryFilter").value;
    const sortBy = $("#sortFilter").value;

    let results = places.filter(place => {
        const text = [
            place.name,
            place.location,
            place.description,
            place.tag,
            place.category
        ].join(" ").toLowerCase();

        const matchesSearch = text.includes(searchText);

        const matchesCategory =
            category === "all" || place.category === category;

        return matchesSearch && matchesCategory;
    });

    if (sortBy === "rating") {
        results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price") {
        results.sort((a, b) => a.cost - b.cost);
    }

    renderPlaces(results, "explorePlaces");
}

// -----------------------------------------
// INITIALISE DASHBOARD
// -----------------------------------------

function initialiseDashboard() {
    renderPlaces(places.slice(0, 3), "homePlaces");
    renderPlaces(places, "explorePlaces");

    renderPlaces(
        places.filter(place => place.category === "food"),
        "foodPlaces"
    );

    renderPlaces(
        places.filter(place => place.category === "culture"),
        "culturePlaces"
    );

    renderSavedPlaces();
}

// -----------------------------------------
// CITYMATE DEMO ASSISTANT
// -----------------------------------------

function getCityMateReply(message) {
    const text = message.toLowerCase();

    if (
        text.includes("budget") ||
        text.includes("cheap") ||
        text.includes("affordable") ||
        text.includes("cost")
    ) {
        return "For a budget-friendly outing, explore Saras Baug and compare estimated prices at local food spots. These are sample listings, so verify costs before visiting.";
    }

    if (
        text.includes("food") ||
        text.includes("cafe") ||
        text.includes("café") ||
        text.includes("restaurant") ||
        text.includes("eat")
    ) {
        return "You can explore cafés around FC Road and food spots around Camp. Open Food & Cafés in VAJRA to browse the sample places.";
    }

    if (
        text.includes("history") ||
        text.includes("historic") ||
        text.includes("culture") ||
        text.includes("heritage")
    ) {
        return "You can start with Shaniwar Wada and Aga Khan Palace. Check official sources for opening hours, entry fees and visitor guidance.";
    }

    if (
        text.includes("safe") ||
        text.includes("safety") ||
        text.includes("danger") ||
        text.includes("route")
    ) {
        return "Check trusted local advisories and live navigation before travelling. This prototype has no verified safety feed, so it cannot confirm whether a specific area is safe. In an emergency in India, call 112.";
    }

    if (
        text.includes("traffic") ||
        text.includes("weather") ||
        text.includes("rain")
    ) {
        return "Please check a live navigation service and the India Meteorological Department for current conditions. VAJRA's demo does not have live traffic or weather data connected.";
    }

    if (
        text.includes("one day") ||
        text.includes("itinerary") ||
        text.includes("trip") ||
        text.includes("tour")
    ) {
        return "Sample Pune itinerary: visit Aga Khan Palace in the morning, enjoy local food for lunch, explore Shaniwar Wada in the afternoon and relax at Saras Baug. Check opening times and travel conditions before leaving.";
    }

    return "Hello! Welcome to VAJRA. I can suggest food places, historical attractions, budget outings and general travel tips. Try asking me to plan a one-day trip around Pune.";
}

// -----------------------------------------
// CHAT MESSAGES
// -----------------------------------------

function sendChat(message) {
    const cleanMessage = message.trim();

    if (!cleanMessage) return;

    const messages = $("#chatMessages");

    const userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.textContent = cleanMessage;

    messages.appendChild(userMessage);

    const reply = document.createElement("div");
    reply.className = "bot-message";
    reply.textContent = getCityMateReply(cleanMessage);

    messages.appendChild(reply);

    $("#chatInput").value = "";

    messages.scrollTop = messages.scrollHeight;
}

// -----------------------------------------
// CLICK EVENTS
// -----------------------------------------

document.addEventListener("click", event => {
    const navigationButton = event.target.closest("[data-page]");

    if (navigationButton) {
        goPage(navigationButton.dataset.page);
        return;
    }

    const goButton = event.target.closest("[data-go]");

    if (goButton) {
        goPage(goButton.dataset.go);
        return;
    }

    // Quick assistant prompts.
    const promptButton = event.target.closest("[data-prompt]");

    if (promptButton) {
        goPage("assistant");
        sendChat(promptButton.dataset.prompt);
        return;
    }

    // Save or remove a place.
    const saveButton = event.target.closest("[data-save]");

    if (saveButton) {
        const id = Number(saveButton.dataset.save);

        if (savedPlaces.has(id)) {
            savedPlaces.delete(id);
        } else {
            savedPlaces.add(id);
        }

        // Update all displayed copies of this place.
        document.querySelectorAll(`[data-save="${id}"]`).forEach(button => {
            const isSaved = savedPlaces.has(id);

            button.classList.toggle("saved", isSaved);
            button.textContent = isSaved ? "♥" : "♡";
            button.setAttribute("aria-pressed", String(isSaved));
        });

        renderSavedPlaces();

        showToast(
            savedPlaces.has(id)
                ? "Place added to your saved collection."
                : "Place removed from your saved collection."
        );

        return;
    }

    // Place details.
    const detailsButton = event.target.closest("[data-details]");

    if (detailsButton) {
        const id = Number(detailsButton.dataset.details);
        const place = places.find(item => item.id === id);

        if (place) {
            showToast(
                `${place.name} · ${place.location} · ` +
                (place.cost === 0
                    ? "Free estimated entry"
                    : `Estimated ₹${place.cost} per person`)
            );
        }

        return;
    }

    // Illustrative map markers.
    const mapPin = event.target.closest("[data-place]");

    if (mapPin) {
        showToast(
            `${mapPin.dataset.place} · Sample marker, not a live map.`
        );
    }
});

// -----------------------------------------
// GLOBAL SEARCH
// -----------------------------------------

$("#globalSearch").addEventListener("keydown", event => {
    if (event.key === "Enter") {
        $("#placeSearch").value = event.target.value;
        goPage("explore");
        renderExplore();
    }
});

$("#placeSearch").addEventListener("input", renderExplore);
$("#categoryFilter").addEventListener("change", renderExplore);
$("#sortFilter").addEventListener("change", renderExplore);

// -----------------------------------------
// MOBILE SIDEBAR
// -----------------------------------------

$("#menuToggle").addEventListener("click", () => {
    $("#sidebar").classList.toggle("open");
});

// -----------------------------------------
// CITIZEN REPORT FORM
// -----------------------------------------

$("#reportForm").addEventListener("submit", event => {
    event.preventDefault();

    const category = $("#reportType").value;
    const location = $("#reportLocation").value.trim();
    const description = $("#reportDescription").value.trim();

    if (!category || !location || !description) {
        showToast("Please complete all report fields.");
        return;
    }

    const report = document.createElement("div");
    report.className = "report-item";

    const title = document.createElement("strong");
    title.textContent = `${category} · ${location}`;

    const details = document.createElement("p");
    details.textContent = description;

    const status = document.createElement("small");
    status.textContent =
        "Demo submission · Not independently verified or sent to authorities";
    status.style.color = "#b87922";

    report.append(title, details, status);

    const reportList = $("#reportList");

    // Remove the initial empty-state message.
    const emptyMessage = reportList.querySelector("p");

    if (emptyMessage && !reportList.querySelector(".report-item")) {
        emptyMessage.remove();
    }

    reportList.prepend(report);

    event.target.reset();

    showToast("Your report was added to this demo session.");
});

// -----------------------------------------
// CHAT FORM
// -----------------------------------------

$("#chatForm").addEventListener("submit", event => {
    event.preventDefault();
    sendChat($("#chatInput").value);
});

// -----------------------------------------
// START VAJRA
// -----------------------------------------

initialiseDashboard();

console.log("VAJRA Smart City Explorer is ready!");