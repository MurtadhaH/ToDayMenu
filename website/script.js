"use strict";

const isAr = document.documentElement.lang === "ar";


const state = {
  data: null,
  activeCategoryId: null,
  activeItem: null
};

const elements = {
  intro: document.getElementById("intro"),
  categories: document.getElementById("categories"),
  menuItems: document.getElementById("menuItems"),
  categoryTitle: document.getElementById("categoryTitle"),
  categoryIcon: document.getElementById("categoryIcon"),
  itemCount: document.getElementById("itemCount"),
  itemModal: document.getElementById("itemModal"),
  modalBackdrop: document.getElementById("modalBackdrop"),
  modalClose: document.getElementById("modalClose"),
  modalImage: document.getElementById("modalImage"),
  modalCategory: document.getElementById("modalCategory"),
  modalTitle: document.getElementById("modalTitle"),
  modalPrice: document.getElementById("modalPrice"),
  modalDescription: document.getElementById("modalDescription"),
  modalIngredients: document.getElementById("modalIngredients"),
  modalOrder: document.getElementById("modalOrder"),
  currentYear: document.getElementById("currentYear")
};

function hideIntroWhenFinished() {
  const alreadyPlayed = sessionStorage.getItem("todayIntroPlayed");

  if (alreadyPlayed) {
    elements.intro.classList.add("is-hidden");
    return;
  }

  sessionStorage.setItem("todayIntroPlayed", "true");
  window.setTimeout(() => {
    elements.intro.classList.add("is-hidden");
  }, 4600);
}

async function loadMenuData() {
  // On Hostinger/http, the JSON file is loaded normally.
  // When index.html is opened directly from a computer, the fallback text file is used.
  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    try {
      const response = await fetch("data/menu.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Menu file could not be loaded.");
      return await response.json();
    } catch (error) {
      console.warn("Using direct-open fallback menu data.", error);
    }
  }

  if (window.MENU_FALLBACK) {
    return window.MENU_FALLBACK;
  }

  throw new Error("No menu data is available.");
}

function setupRestaurantInformation(data) {
  const restaurant = data.restaurant;

  document.title = isAr ? `${restaurant.name} | القائمة` : `${restaurant.name} | Menu`;
  document.getElementById("headerName").textContent = restaurant.name;
  document.getElementById("headerPhone").textContent = restaurant.phoneDisplay;
  document.getElementById("heroTagline").textContent = restaurant.tagline;
  document.getElementById("restaurantAddress").textContent = restaurant.address;


  const phoneHref = `tel:${restaurant.phoneLink}`;
  document.getElementById("phoneButton").href = phoneHref;
  document.getElementById("visitPhoneButton").href = phoneHref;

  const whatsappHref = `https://wa.me/${restaurant.whatsappLink}`;
  document.getElementById("whatsappButton").href = whatsappHref;
}

function createCategoryButtons(categories) {
  elements.categories.replaceChildren();

  categories.forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-button";
    button.dataset.categoryId = category.id;
    button.innerHTML = `
      <span class="category-button__icon" aria-hidden="true">${category.icon}</span>
      <span>${escapeHTML(category.name)}</span>
    `;

    button.addEventListener("click", () => {
      renderCategory(category.id);
      button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });

    elements.categories.appendChild(button);
  });
}

function renderCategory(categoryId) {
  const category = state.data.categories.find(item => item.id === categoryId);
  if (!category) return;

  state.activeCategoryId = categoryId;
  sessionStorage.setItem('lastCategoryId', state.activeCategoryId);

  document.querySelectorAll(".category-button").forEach(button => {
    const isActive = button.dataset.categoryId === categoryId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  elements.categoryTitle.textContent = category.name;
  elements.categoryIcon.textContent = category.icon;
  elements.itemCount.textContent = isAr
    ? `${category.items.length} ${(category.items.length < 2 || category.items.length > 10) ? "وجبة" : "وجبات"}`
    : `${category.items.length} ${category.items.length < 2 ? "item" : "items"}`;
  elements.menuItems.replaceChildren();

  category.items.forEach((item, index) => {
    elements.menuItems.appendChild(createMenuCard(item, category, index));
  });
}

function createMenuCard(item, category, index) {
  const card = document.createElement("article");
  card.className = "menu-card";
  card.tabIndex = 0;
  card.style.animationDelay = `${Math.min(index * 75, 300)}ms`;
  card.setAttribute("aria-label", isAr ? `عرض التفاصيل لـ ${item.name}` : `View details for ${item.name}`);

  const componentsText = isAr
    ? `${item.ingredients.length} ${item.ingredients.length === 1 ? "مكون" : "مكونات"}`
    : `${item.ingredients.length} ${item.ingredients.length === 1 ? "component" : "components"}`;

  const viewDetailsText = isAr ? "عرض التفاصيل" : "View details";

  card.innerHTML = `
    <div class="menu-card__image-wrap">
      <img  class="menu-card__image" 
        onerror="this.onerror=null; this.src='${isAr ? "../" : ""}assets/menu-images/no-image.jpeg'"
      src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.name)}" loading="lazy">
      <span class="menu-card__open" aria-hidden="true">＋</span>
    </div>
    <div class="menu-card__body">
      <div class="menu-card__top">
        <h4>${escapeHTML(item.name)}</h4>
        <span class="menu-card__price">${escapeHTML(item.price)} ${escapeHTML(state.data.restaurant.currency)}</span>
      </div>
      <p class="menu-card__description">${escapeHTML(item.description)}</p>
      <div class="menu-card__footer">
        <span>${componentsText}</span>
        <strong>${viewDetailsText}</strong>
      </div>
    </div>
  `;

  const open = () => openItemModal(item, category);
  card.addEventListener("click", open);
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });

  return card;
}

function openItemModal(item, category) {
  state.activeItem = item;

  elements.modalImage.src = item.image;
  elements.modalImage.alt = item.name;
  elements.modalImage.onerror = () => {
    elements.modalImage.src = isAr ? "../assets/menu-images/no-image.jpeg" : "assets/menu-images/no-image.jpeg";
  };
  elements.modalCategory.textContent = category.name.toUpperCase();
  elements.modalTitle.textContent = item.name;
  elements.modalPrice.textContent = `${item.price} ${state.data.restaurant.currency}`;
  elements.modalDescription.textContent = item.description;
  elements.modalIngredients.replaceChildren();

  item.ingredients.forEach(ingredient => {
    const li = document.createElement("li");
    li.textContent = ingredient;
    elements.modalIngredients.appendChild(li);
  });

  const orderText = encodeURIComponent(
    isAr
      ? `مرحباً ${state.data.restaurant.name}، أود طلب: ${item.name}.`
      : `Hello ${state.data.restaurant.name}, I would like to order: ${item.name}.`
  );
  elements.modalOrder.href = `https://wa.me/${state.data.restaurant.whatsappLink}?text=${orderText}`;

  elements.itemModal.classList.add("is-open");
  elements.itemModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  elements.modalClose.focus();
}

function closeItemModal() {
  elements.itemModal.classList.remove("is-open");
  elements.itemModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHTML(value);
}

async function initialize() {
  hideIntroWhenFinished();
  elements.currentYear.textContent = new Date().getFullYear();

  elements.modalBackdrop.addEventListener("click", closeItemModal);
  elements.modalClose.addEventListener("click", closeItemModal);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && elements.itemModal.classList.contains("is-open")) {
      closeItemModal();
    }
  });

  console.log(sessionStorage.getItem('lastCategoryId'))
  state.activeCategoryId = sessionStorage.getItem('lastCategoryId');


  try {
    state.data = await loadMenuData();
    setupRestaurantInformation(state.data);
    createCategoryButtons(state.data.categories);

    if (state.data.categories.length > 0) {
      if (!state.activeCategoryId) {
        renderCategory(state.data.categories[0].id);
        return true;
      }
      if (!state.data.categories.find(item => item.id === state.activeCategoryId)) {
        console.log('clear');
        sessionStorage.removeItem('lastCategoryId');
        state.activeCategoryId = state.data.categories[0].id
      }
      renderCategory(state.activeCategoryId);
    }
  } catch (error) {
    console.error(error);
    elements.menuItems.innerHTML = isAr
      ? `
        <p style="grid-column:1/-1;padding:30px;border-radius:20px;background:#fff;text-align:center;">
          تعذر تحميل بيانات القائمة. 
        </p>
      `
      : `
        <p style="grid-column:1/-1;padding:30px;border-radius:20px;background:#fff;">
          The menu data could not be loaded.
        </p>
      `;
  }
}

initialize();
