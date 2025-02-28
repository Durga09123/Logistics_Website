function toggleMenu() {
    const navbarMobile = document.querySelector(".navbar-mobile");
    navbarMobile.classList.toggle("active");
}

function closeMenuOnLinkClick() {
    const navbarMobile = document.querySelector(".navbar-mobile");
    const navLinks = navbarMobile.querySelectorAll("a");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navbarMobile.classList.remove("active");
        });
    });
}

closeMenuOnLinkClick();

const servicesData = [
    {
        icon: "fa fa-truck",
        title: "Road Freight",
        description: "Efficient and reliable road freight services for all your cargo needs. We ensure timely delivery across the region.",
        image: "./Image/service/Road_freight.webp"
    },
    {
        icon: "fa fa-road",
        title: "Intercity Transport",
        description: "Seamless intercity transport solutions for businesses and individuals. We connect cities with speed and reliability.",
        image: "./Image/service/Intercity_Transport.webp"
    },
    {
        icon: "fa fa-map-marker",
        title: "Last-Mile Delivery",
        description: "Reliable last-mile delivery services to get your goods to their final destination. Perfect for e-commerce and retail.",
        image: "./Image/service/Last-Mile Delivery.webp"
    },
    {
        icon: "fa fa-warehouse",
        title: "Warehousing",
        description: "Safe and scalable warehousing solutions to store your goods. Our facilities are strategically located for easy access.",
        image: "./Image/service/Ware_Housing.webp"
    },
    {
        icon: "fa fa-box",
        title: "Packaging Solutions",
        description: "Professional packaging services to ensure your items are secure during transit. We handle fragile and bulky items with care.",
        image: "./Image/service/Packaging Solutions.webp"
    },
    {
        icon: "fa fa-calendar",
        title: "Scheduled Deliveries",
        description: "Flexible scheduled delivery options to meet your business needs. Plan your shipments in advance with CargoHive.",
        image: "./Image/service/Scheduled Deliveries.webp"
    },
    {
        icon: "fa fa-truck-moving",
        title: "Heavy Haulage",
        description: "Specialized heavy haulage services for oversized and heavy cargo. We handle the toughest logistics challenges.",
        image: "./Image/service/Heavy Haulage.webp"
    },
    {
        icon: "fa fa-temperature-low",
        title: "Refrigerated Transport",
        description: "Temperature-controlled transport for perishable goods. Ensure your products arrive fresh and in perfect condition.",
        image: "./Image/service/Refrigerated Transport.webp"
    }
];

function renderServices() {
    const servicesContainer = document.querySelector(".services-container");

    servicesData.forEach(service => {
        const serviceCard = document.createElement("div");
        serviceCard.classList.add("service-card");

        serviceCard.innerHTML = `
            <img src="${service.image}" alt="${service.title}" class="service-image">
            <i class="${service.icon}"></i>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        `;

        servicesContainer.appendChild(serviceCard);
    });
}

renderServices();

async function fetchTrackingData(trackingNumber) {
    try {
        const response = await fetch("./tracking-data.json");
        if (!response.ok) {
            throw new Error("Failed to fetch tracking data.");
        }
        const data = await response.json();
        const result = data.find(item => item.trackingNumber === trackingNumber);
        if (!result) {
            throw new Error("Tracking number not found.");
        }
        return result;
    } catch (error) {
        console.error("Error fetching tracking data:", error);
        return null;
    }
}
async function getLocationName(lat, lng) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        if (!response.ok) {
            throw new Error("Failed to fetch location name.");
        }
        const data = await response.json();
        const addressParts = [
            data.address.road,
            data.address.suburb,
            data.address.city,
            data.address.state,
            data.address.country
        ];
        const cleanedAddress = addressParts.filter(part => part).join(", ");

        return cleanedAddress || "Unknown Location";
    } catch (error) {
        console.error("Error fetching location name:", error);
        return "Unknown Location";
    }
}

async function displayTrackingResult(result) {
    const trackingResult = document.getElementById("tracking-result");
    trackingResult.style.display = "block";

    if (result) {
        const locationName = await getLocationName(result.location.lat, result.location.lng);
        trackingResult.innerHTML = `
            <h3>Shipment Details</h3>
            <p><strong>Tracking Number:</strong> ${result.trackingNumber}</p>
            <p><strong>Status:</strong> <span class="status">${result.status}</span></p>
            <p><strong>Location:</strong> ${locationName}</p>
            <p><strong>Details:</strong> ${result.details}</p>
        `;
    } else {
        trackingResult.innerHTML = `<p class="error">Invalid tracking number. Please try again.</p>`;
    }
}

document.getElementById("track-button").addEventListener("click", async () => {
    const trackingNumber = document.getElementById("tracking-number").value.trim();
    const trackingResult = document.getElementById("tracking-result");

    if (!trackingNumber) {
        alert("Please enter a tracking number.");
        trackingResult.style.display = "none";
        return;
    }

    const result = await fetchTrackingData(trackingNumber);
    displayTrackingResult(result);
});



const slidesContainer = document.querySelector(".slides-container");
const prevButton = document.querySelector(".slider-button.prev");
const nextButton = document.querySelector(".slider-button.next");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;

function showSlide(index) {
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;

    if (index >= totalSlides) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalSlides - 1;
    } else {
        currentIndex = index;
    }
    const offset = -currentIndex * 100;
    slidesContainer.style.transform = `translateX(${offset}%)`;
    updateDots(currentIndex);
}

function updateDots(index) {
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[index].classList.add("active");
}

prevButton.addEventListener("click", () => {
    showSlide(currentIndex - 1);
});

nextButton.addEventListener("click", () => {
    showSlide(currentIndex + 1);
});

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        showSlide(index);
    });
});

setInterval(() => {
    showSlide(currentIndex + 1);
}, 5000);