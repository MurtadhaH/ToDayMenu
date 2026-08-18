"use strict";

const isAr = document.documentElement.lang === "ar";

const MAX_SEARCH_SUGGESTIONS = 10;

const forbiddenSearchWords = [

  /* =========================
     عربي — خنزير
  ========================= */

  "خنزير",
  "خنازير",


  /* =========================
     عراقي / عربي — مشروبات محرمة
  ========================= */

  "عرك",
  "عرگ",

  "خمرة",
  "خمره",

  "ويسكي",
  "وسكي",

  "فودكا",

  "تكيلا",
  "تيكيلا",

  "براندي",

  "كونياك",

  "بوربون",

  "سكوتش",

  "شامبانيا",
  "شمبانيا",

  "ليكيور",

  "أوزو",
  "اوزو",

  "أبسنث",
  "ابسنث",

  "مزكال",

  "مارغريتا",


  /* =========================
     English — Pork
  ========================= */

  "pork",

  "prosciutto",
  "pancetta",
  "guanciale",

  "capicola",
  "capocollo",

  "chicharron",
  "chicharrón",


  /* =========================
     English — Alcohol
  ========================= */

  "whiskey",
  "whisky",

  "vodka",

  "tequila",

  "brandy",

  "cognac",

  "bourbon",

  "scotch",

  "champagne",

  "liqueur",

  "absinthe",

  "mezcal",

  "margarita",

  "arrack"

];


/* =====================================================
   STATE
===================================================== */

const state = {
  data: null,
  activeCategoryId: null,
  activeItem: null,

  // Built only once after menu.json loads
  searchIndex: [],

  // Current autocomplete results
  searchResults: [],

  // Keyboard-selected autocomplete result
  activeSuggestionIndex: -1
};


/* =====================================================
   ELEMENTS
===================================================== */

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

  currentYear: document.getElementById("currentYear"),

  // Search
  searchInput: document.getElementById("searchInput"),
  searchButton: document.getElementById("searchButton"),
  searchSuggestions: document.getElementById("searchSuggestions")
};


/* =====================================================
   INTRO
===================================================== */

function hideIntroWhenFinished() {

  const alreadyPlayed =
    sessionStorage.getItem("todayIntroPlayed");

  if (alreadyPlayed) {
    elements.intro.classList.add("is-hidden");
    return;
  }

  sessionStorage.setItem(
    "todayIntroPlayed",
    "true"
  );

  window.setTimeout(() => {
    elements.intro.classList.add("is-hidden");
  }, 4600);
}


/* =====================================================
   LOAD MENU DATA
===================================================== */

async function loadMenuData() {

  // On Hostinger/http, JSON loads normally.
  // When index.html is opened directly,
  // MENU_FALLBACK is used.

  if (
    window.location.protocol === "http:" ||
    window.location.protocol === "https:"
  ) {

    try {

      const response = await fetch(
        "data/menu.json",
        {
          cache: "no-store"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Menu file could not be loaded."
        );
      }

      return await response.json();

    } catch (error) {

      console.warn(
        "Using direct-open fallback menu data.",
        error
      );
    }
  }


  if (window.MENU_FALLBACK) {
    return window.MENU_FALLBACK;
  }


  throw new Error(
    "No menu data is available."
  );
}


/* =====================================================
   RESTAURANT INFORMATION
===================================================== */

function setupRestaurantInformation(data) {

  const restaurant = data.restaurant;

  document.title = isAr
    ? `${restaurant.name} | القائمة`
    : `${restaurant.name} | Menu`;


  document.getElementById(
    "headerName"
  ).textContent = restaurant.name;


  document.getElementById(
    "headerPhone"
  ).textContent = restaurant.phoneDisplay;


  document.getElementById(
    "heroTagline"
  ).textContent = restaurant.tagline;


  document.getElementById(
    "restaurantAddress"
  ).textContent = restaurant.address;


  const phoneHref =
    `tel:${restaurant.phoneLink}`;


  document.getElementById(
    "phoneButton"
  ).href = phoneHref;


  document.getElementById(
    "visitPhoneButton"
  ).href = phoneHref;


  const whatsappHref =
    `https://wa.me/${restaurant.whatsappLink}`;


  document.getElementById(
    "whatsappButton"
  ).href = whatsappHref;
}


/* =====================================================
   CATEGORY BUTTONS
===================================================== */

function createCategoryButtons(categories) {

  elements.categories.replaceChildren();


  categories.forEach(category => {

    const button =
      document.createElement("button");


    button.type = "button";

    button.className =
      "category-button";


    // Check if category icon is an image
    // instead of an emoji.

    if (category.icon.includes(".")) {

      button.innerHTML = `
        <img
          src="${category.icon}"
          alt="${category.name}"
        >

        <img
          src="${category.icon}"
          alt="${category.name}"
        >
      `;

    } else {

      button.innerHTML = `
        <span
          class="category-button__icon"
          aria-hidden="true"
        >
          ${category.icon}
        </span>
      `;
    }


    button.dataset.categoryId =
      category.id;


    button.innerHTML += `
      <span>
        ${escapeHTML(category.name)}
      </span>
    `;


    button.addEventListener(
      "click",
      () => {

        renderCategory(
          category.id
        );


        button.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    );


    elements.categories.appendChild(
      button
    );
  });
}


/* =====================================================
   RENDER CATEGORY
===================================================== */

function renderCategory(categoryId) {

  const category =
    state.data.categories.find(
      item =>
        item.id === categoryId
    );


  if (!category) {
    return;
  }


  state.activeCategoryId =
    categoryId;


  sessionStorage.setItem(
    "lastCategoryId",
    state.activeCategoryId
  );


  document
    .querySelectorAll(".category-button")
    .forEach(button => {

      const isActive =
        button.dataset.categoryId ===
        categoryId;


      button.classList.toggle(
        "is-active",
        isActive
      );


      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    });


  elements.categoryTitle.textContent =
    category.name;


  if (category.icon.includes(".")) {

    elements.categoryIcon.innerHTML = `
      <img
        src="${category.icon}"
        alt="${category.name}"
      >
    `;

  } else {

    elements.categoryIcon.innerHTML = `
      <span
        class="category-button__icon"
        aria-hidden="true"
      >
        ${category.icon}
      </span>
    `;
  }


  elements.itemCount.textContent =
    isAr
      ? `${category.items.length} ${(
        category.items.length < 2 ||
        category.items.length > 10
      )
        ? "وجبة"
        : "وجبات"
      }`

      : `${category.items.length} ${category.items.length < 2
        ? "item"
        : "items"
      }`;


  elements.menuItems.replaceChildren();


  category.items.forEach(
    (item, index) => {

      elements.menuItems.appendChild(
        createMenuCard(
          item,
          category,
          index
        )
      );
    }
  );
}


/* =====================================================
   CREATE MENU CARD
===================================================== */

function createMenuCard(
  item,
  category,
  index
) {

  const card =
    document.createElement("article");


  card.className =
    `menu-card ${item.special
      ? "special-menu-card"
      : ""
    }`;


  /*
   * Important:
   * Gives the HTML card the same ID
   * as its JSON menu item.
   */

  card.dataset.itemId =
    item.id;


  card.tabIndex = 0;


  card.style.animationDelay =
    `${Math.min(
      index * 75,
      300
    )}ms`;


  card.setAttribute(
    "aria-label",
    isAr
      ? `عرض التفاصيل لـ ${item.name}`
      : `View details for ${item.name}`
  );


  const componentsText =
    isAr
      ? `${item.ingredients.length} ${(
        item.ingredients.length < 2 ||
        item.ingredients.length > 10
      )
        ? "مكون"
        : "مكونات"
      }`

      : `${item.ingredients.length} ${item.ingredients.length === 1
        ? "component"
        : "components"
      }`;


  const viewDetailsText =
    isAr
      ? "عرض التفاصيل"
      : "View details";


  card.innerHTML = `

    ${item.special
      ? '<div class="prime-shimmer"></div>'
      : ""
    }

    <div class="menu-card__image-wrap">

      <img
        class="menu-card__image"

        onerror="
          this.onerror=null;
          this.src='${isAr
      ? "../"
      : ""
    }assets/menu-images/no-image.jpeg'
        "

        src="${escapeAttribute(
      item.image
    )}"

        alt="${escapeAttribute(
      item.name
    )}"

        loading="lazy"
      >

      <span
        class="menu-card__open"
        aria-hidden="true"
      >
        ＋
      </span>

    </div>


    <div class="menu-card__body">

      <div class="menu-card__top">

        <h4>
          ${escapeHTML(item.name)}
        </h4>

        <span class="menu-card__price">

          ${escapeHTML(item.price)}

          ${escapeHTML(
      state.data.restaurant.currency
    )}

        </span>

      </div>


      <p class="menu-card__description">

        ${escapeHTML(
      item.description
    )}

      </p>


      <div class="menu-card__footer">

        <span>
          ${componentsText}
        </span>

        <strong>
          ${viewDetailsText}
        </strong>

      </div>

    </div>
  `;


  const open = () =>
    openItemModal(
      item,
      category
    );


  card.addEventListener(
    "click",
    open
  );


  card.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        open();
      }
    }
  );


  return card;
}


/* =====================================================
   ITEM MODAL
===================================================== */

function openItemModal(
  item,
  category
) {

  state.activeItem =
    item;


  elements.modalImage.src =
    item.image;


  elements.modalImage.alt =
    item.name;


  elements.modalImage.onerror =
    () => {

      elements.modalImage.src =
        isAr
          ? "../assets/menu-images/no-image.jpeg"
          : "assets/menu-images/no-image.jpeg";
    };


  elements.modalCategory.textContent =
    category.name.toUpperCase();


  elements.modalTitle.textContent =
    item.name;


  elements.modalPrice.textContent =
    `${item.price} ${state.data.restaurant.currency
    }`;


  elements.modalDescription.textContent =
    item.description;


  elements.modalIngredients
    .replaceChildren();


  item.ingredients.forEach(
    ingredient => {

      const li =
        document.createElement("li");


      li.textContent =
        ingredient;


      elements.modalIngredients
        .appendChild(li);
    }
  );


  const orderText =
    encodeURIComponent(

      isAr
        ? `مرحباً ${state.data.restaurant.name}، أود طلب: ${item.name}.`
        : `Hello ${state.data.restaurant.name}, I would like to order: ${item.name}.`

    );


  elements.modalOrder.href =
    `https://wa.me/${state.data.restaurant.whatsappLink
    }?text=${orderText}`;


  elements.itemModal.classList.add(
    "is-open"
  );


  elements.itemModal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "modal-open"
  );


  elements.modalClose.focus();
}


function closeItemModal() {

  elements.itemModal.classList.remove(
    "is-open"
  );


  elements.itemModal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "modal-open"
  );
}


/* =====================================================
   SECURITY / ESCAPING
===================================================== */

function escapeHTML(value) {

  return String(value)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );
}


function escapeAttribute(value) {

  return escapeHTML(value);
}


/* =====================================================
   SEARCH NORMALIZATION
===================================================== */

/*
 * Example:
 *
 * مــطــافــي
 *
 * becomes internally:
 *
 * مطافي
 *
 * The displayed name is NEVER changed.
 */

function normalizeSearchText(value) {

  return String(value)

    .trim()

    .toLowerCase()

    // Remove Arabic tashkeel
    .replace(
      /[\u064B-\u065F\u0670]/g,
      ""
    )

    // Remove Arabic Tatweel: ـ
    .replace(
      /\u0640/g,
      ""
    )

    // Normalize different Alef forms
    .replace(
      /[أإآ]/g,
      "ا"
    )

    // Alef Maqsura -> Ya
    .replace(
      /ى/g,
      "ي"
    )

    // Waw with Hamza -> Waw
    .replace(
      /ؤ/g,
      "و"
    )

    // Ya with Hamza -> Ya
    .replace(
      /ئ/g,
      "ي"
    )

    // Remove repeated spaces
    .replace(
      /\s+/g,
      " "
    );
}

const normalizedForbiddenSearchWords =
  forbiddenSearchWords.map(word =>
    normalizeSearchText(word)
  );

function isForbiddenSearch(searchText) {

  const query =
    normalizeSearchText(searchText);


  if (!query) {
    return false;
  }


  return normalizedForbiddenSearchWords.some(
    forbiddenWord => {

      return (
        query === forbiddenWord ||
        query.includes(forbiddenWord)
      );

    }
  );
}




/* =====================================================
   BUILD SEARCH INDEX
===================================================== */

/*
 * This runs ONLY ONCE when menu.json loads.
 *
 * Example entry:
 *
 * {
 *   itemId: "falafel-normal",
 *   itemName: "فلافل عادي",
 *   normalizedName: "فلافل عادي",
 *   categoryId: "snacks"
 * }
 */

function buildSearchIndex() {

  state.searchIndex = [];


  for (
    const category
    of state.data.categories
  ) {

    for (
      const item
      of category.items
    ) {

      state.searchIndex.push({

        itemId:
          item.id,

        itemName:
          item.name,

        normalizedName:
          normalizeSearchText(
            item.name
          ),

        categoryId:
          category.id
      });
    }
  }
}


/* =====================================================
   GET SEARCH SUGGESTIONS
===================================================== */

function getSearchSuggestions(
  searchText
) {

  const query =
    normalizeSearchText(
      searchText
    );


  if (!query) {
    return [];
  }


  /*
   * Search normalized names.
   *
   * We do NOT normalize every item here.
   * That work was already done once
   * inside buildSearchIndex().
   */

  const matches =
    state.searchIndex.filter(
      entry =>
        entry.normalizedName.includes(
          query
        )
    );


  /*
   * Better sorting:
   *
   * 1. Exact match
   * 2. Name starts with query
   * 3. Query appears later in name
   */

  matches.sort(
    (a, b) => {

      const aExact =
        a.normalizedName === query;

      const bExact =
        b.normalizedName === query;


      if (
        aExact &&
        !bExact
      ) {
        return -1;
      }


      if (
        bExact &&
        !aExact
      ) {
        return 1;
      }


      const aStarts =
        a.normalizedName.startsWith(
          query
        );

      const bStarts =
        b.normalizedName.startsWith(
          query
        );


      if (
        aStarts &&
        !bStarts
      ) {
        return -1;
      }


      if (
        bStarts &&
        !aStarts
      ) {
        return 1;
      }


      return (
        a.normalizedName.indexOf(query) -
        b.normalizedName.indexOf(query)
      );
    }
  );


  return matches.slice(
    0,
    MAX_SEARCH_SUGGESTIONS
  );
}


/* =====================================================
   SHOW SEARCH SUGGESTIONS
===================================================== */

function showSearchSuggestions(
  searchText
) {

  if (
    !elements.searchSuggestions
  ) {
    return;
  }

  /*
 * Funny forbidden-food response
 */

  if (isForbiddenSearch(searchText)) {

    state.searchResults = [];

    state.activeSuggestionIndex = -1;

    elements.searchSuggestions
      .replaceChildren();


    const joke =
      document.createElement("div");


    joke.className =
      "search-suggestions__joke";


    joke.innerHTML = `
    <span class="search-suggestions__joke-icon">
      😂
    </span>

    <strong>
      استغفر الله
    </strong>
  `;


    elements.searchSuggestions
      .appendChild(joke);


    elements.searchSuggestions
      .classList.add("is-open");


    return;
  }


  const query =
    normalizeSearchText(
      searchText
    );


  if (!query) {

    hideSearchSuggestions();

    return;
  }


  const results =
    getSearchSuggestions(
      searchText
    );


  state.searchResults =
    results;


  state.activeSuggestionIndex =
    -1;


  elements.searchSuggestions
    .replaceChildren();


  /*
   * Nothing found
   */

  if (
    results.length === 0
  ) {

    const empty =
      document.createElement(
        "div"
      );


    empty.className =
      "search-suggestions__empty";


    empty.textContent =
      isAr
        ? "لا توجد نتائج مطابقة"
        : "No matching items";


    elements.searchSuggestions
      .appendChild(
        empty
      );


    elements.searchSuggestions
      .classList.add(
        "is-open"
      );


    return;
  }


  /*
   * Create suggestion buttons
   */

  results.forEach(
    (entry, index) => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "search-suggestions__item";


      button.dataset.index =
        index;


      button.setAttribute(
        "role",
        "option"
      );


      /*
       * Use textContent so the FULL
       * original item name is displayed.
       */

      const name =
        document.createElement(
          "span"
        );


      name.className =
        "search-suggestions__name";


      name.textContent =
        entry.itemName;


      const icon =
        document.createElement(
          "span"
        );


      icon.className =
        "search-suggestions__icon";


      icon.setAttribute(
        "aria-hidden",
        "true"
      );


      icon.textContent =
        "⌕";


      button.appendChild(
        icon
      );


      button.appendChild(
        name
      );


      button.addEventListener(
        "click",
        () => {

          selectSearchEntry(
            entry
          );
        }
      );


      elements.searchSuggestions
        .appendChild(
          button
        );
    }
  );


  elements.searchSuggestions
    .classList.add(
      "is-open"
    );
}


/* =====================================================
   HIDE SEARCH SUGGESTIONS
===================================================== */

function hideSearchSuggestions() {

  if (
    !elements.searchSuggestions
  ) {
    return;
  }


  elements.searchSuggestions
    .classList.remove(
      "is-open"
    );


  elements.searchSuggestions
    .replaceChildren();


  state.searchResults = [];

  state.activeSuggestionIndex =
    -1;
}


/* =====================================================
   KEYBOARD ACTIVE SUGGESTION
===================================================== */

function updateActiveSuggestion() {

  if (
    !elements.searchSuggestions
  ) {
    return;
  }


  const buttons =
    elements.searchSuggestions
      .querySelectorAll(
        ".search-suggestions__item"
      );


  buttons.forEach(
    (button, index) => {

      const isActive =
        index ===
        state.activeSuggestionIndex;


      button.classList.toggle(
        "is-active",
        isActive
      );


      button.setAttribute(
        "aria-selected",
        String(isActive)
      );


      if (isActive) {

        button.scrollIntoView({
          block: "nearest"
        });
      }
    }
  );
}


/* =====================================================
   SELECT SEARCH RESULT
===================================================== */

function selectSearchEntry(entry) {

  if (!entry) {
    return;
  }


  /*
   * Put FULL original name
   * inside search input.
   */

  elements.searchInput.value =
    entry.itemName;


  hideSearchSuggestions();


  /*
   * Switch to correct category.
   */

  renderCategory(
    entry.categoryId
  );


  /*
   * Bring category button into view.
   */

  const categoryButton =
    Array.from(
      document.querySelectorAll(
        ".category-button"
      )
    ).find(
      button =>
        button.dataset.categoryId ===
        entry.categoryId
    );


  if (categoryButton) {

    categoryButton.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  }


  /*
   * renderCategory() creates new cards.
   *
   * Wait for browser layout,
   * then scroll to requested item.
   */

  requestAnimationFrame(
    () => {

      requestAnimationFrame(
        () => {

          scrollToSearchedItem(
            entry.itemId
          );
        }
      );
    }
  );
}


/* =====================================================
   SEARCH BUTTON / ENTER
===================================================== */

function searchMenu() {

  if (
    !elements.searchInput
  ) {
    return;
  }


  const query =
    normalizeSearchText(
      elements.searchInput.value
    );


  if (!query) {

    elements.searchInput.focus();

    return;
  }


  /*
   * Try exact match first.
   */

  let entry =
    state.searchIndex.find(
      item =>
        item.normalizedName ===
        query
    );


  /*
   * Then starts-with.
   */

  if (!entry) {

    entry =
      state.searchIndex.find(
        item =>
          item.normalizedName.startsWith(
            query
          )
      );
  }


  /*
   * Finally partial match.
   */

  if (!entry) {

    entry =
      state.searchIndex.find(
        item =>
          item.normalizedName.includes(
            query
          )
      );
  }


  /*
   * Nothing found
   */

  if (!entry) {

    showSearchSuggestions(
      elements.searchInput.value
    );

    elements.searchInput.focus();

    return;
  }


  selectSearchEntry(
    entry
  );
}


/* =====================================================
   SCROLL TO SEARCHED ITEM
===================================================== */

function scrollToSearchedItem(
  itemId
) {

  const targetCard =
    Array.from(
      elements.menuItems
        .querySelectorAll(
          ".menu-card"
        )
    ).find(
      card =>
        card.dataset.itemId ===
        itemId
    );


  if (!targetCard) {
    return;
  }


  /*
   * Remove old highlights.
   */

  document
    .querySelectorAll(
      ".menu-card.search-highlight"
    )
    .forEach(
      card => {

        card.classList.remove(
          "search-highlight"
        );
      }
    );


  /*
   * Scroll to item.
   */

  targetCard.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest"
  });


  /*
   * Highlight item.
   */

  targetCard.classList.add(
    "search-highlight"
  );


  /*
   * Remove highlight after 3 seconds.
   */

  window.setTimeout(
    () => {

      targetCard.classList.remove(
        "search-highlight"
      );

    },
    3000
  );
}


/* =====================================================
   SEARCH EVENT LISTENERS
===================================================== */

function setupSearchEvents() {

  if (
    !elements.searchInput ||
    !elements.searchButton
  ) {
    return;
  }


  /*
   * Show suggestions while typing.
   */

  elements.searchInput.addEventListener(
    "input",
    event => {

      showSearchSuggestions(
        event.target.value
      );
    }
  );


  /*
   * Show suggestions again
   * when the user focuses the field.
   */

  elements.searchInput.addEventListener(
    "focus",
    () => {

      if (
        elements.searchInput.value.trim()
      ) {

        showSearchSuggestions(
          elements.searchInput.value
        );
      }
    }
  );


  /*
   * Keyboard navigation.
   */

  elements.searchInput.addEventListener(
    "keydown",
    event => {

      /*
       * Arrow Down
       */

      if (
        event.key === "ArrowDown" &&
        state.searchResults.length > 0
      ) {

        event.preventDefault();


        state.activeSuggestionIndex++;


        if (
          state.activeSuggestionIndex >=
          state.searchResults.length
        ) {

          state.activeSuggestionIndex =
            0;
        }


        updateActiveSuggestion();

        return;
      }


      /*
       * Arrow Up
       */

      if (
        event.key === "ArrowUp" &&
        state.searchResults.length > 0
      ) {

        event.preventDefault();


        state.activeSuggestionIndex--;


        if (
          state.activeSuggestionIndex < 0
        ) {

          state.activeSuggestionIndex =
            state.searchResults.length - 1;
        }


        updateActiveSuggestion();

        return;
      }


      /*
       * Enter
       */

      if (
        event.key === "Enter"
      ) {

        event.preventDefault();


        if (
          state.activeSuggestionIndex >= 0 &&
          state.searchResults[
          state.activeSuggestionIndex
          ]
        ) {

          selectSearchEntry(
            state.searchResults[
            state.activeSuggestionIndex
            ]
          );

        } else {

          searchMenu();
        }


        return;
      }


      /*
       * Escape
       */

      if (
        event.key === "Escape"
      ) {

        hideSearchSuggestions();
      }
    }
  );


  /*
   * Search button.
   */

  elements.searchButton.addEventListener(
    "click",
    searchMenu
  );


  /*
   * Close suggestions when clicking
   * outside the search area.
   */

  document.addEventListener(
    "click",
    event => {

      if (
        !event.target.closest(
          ".menu-search"
        )
      ) {

        hideSearchSuggestions();
      }
    }
  );
}


/* =====================================================
   INITIALIZE
===================================================== */

async function initialize() {

  hideIntroWhenFinished();


  elements.currentYear.textContent =
    new Date().getFullYear();


  elements.modalBackdrop
    .addEventListener(
      "click",
      closeItemModal
    );


  elements.modalClose
    .addEventListener(
      "click",
      closeItemModal
    );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        elements.itemModal
          .classList
          .contains(
            "is-open"
          )
      ) {

        closeItemModal();
      }
    }
  );


  state.activeCategoryId =
    sessionStorage.getItem(
      "lastCategoryId"
    );


  try {

    /*
     * Load JSON once.
     */

    state.data =
      await loadMenuData();


    /*
     * Build normalized search index ONCE.
     */

    buildSearchIndex();


    setupRestaurantInformation(
      state.data
    );


    createCategoryButtons(
      state.data.categories
    );


    /*
     * Search listeners are ready
     * after data/index are ready.
     */

    setupSearchEvents();


    if (
      state.data.categories.length > 0
    ) {

      if (
        !state.activeCategoryId
      ) {

        renderCategory(
          state.data.categories[0].id
        );

        return true;
      }


      if (
        !state.data.categories.find(
          item =>
            item.id ===
            state.activeCategoryId
        )
      ) {

        sessionStorage.removeItem(
          "lastCategoryId"
        );


        state.activeCategoryId =
          state.data.categories[0].id;
      }


      renderCategory(
        state.activeCategoryId
      );
    }


  } catch (error) {

    console.error(error);


    elements.menuItems.innerHTML =
      isAr

        ? `
          <p
            style="
              grid-column:1/-1;
              padding:30px;
              border-radius:20px;
              background:#fff;
              text-align:center;
            "
          >
            تعذر تحميل بيانات القائمة.
          </p>
        `

        : `
          <p
            style="
              grid-column:1/-1;
              padding:30px;
              border-radius:20px;
              background:#fff;
            "
          >
            The menu data could not be loaded.
          </p>
        `;
  }
}


initialize();