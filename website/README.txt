TODAY CAFETERIA — DIGITAL MENU
================================

This project uses only:
- HTML
- CSS
- JavaScript
- JSON
- Local image files

RUN IT DIRECTLY
---------------
1. Extract the ZIP file.
2. Open index.html in Chrome, Edge, Firefox, or Safari.

It also works when uploaded to Hostinger.

UPLOAD TO HOSTINGER
-------------------
Upload all project files and folders to public_html.
Keep the folder structure unchanged.

EDIT RESTAURANT INFORMATION
---------------------------
Edit:
data/menu.json
data/menu-fallback.js

Change:
- Restaurant phone
- WhatsApp number
- Address
- Categories
- Item names
- Prices
- Descriptions
- Ingredients
- Image paths

IMPORTANT:
The website reads data/menu.json when hosted online.
When index.html is opened directly from your computer, it reads data/menu-fallback.js.

Therefore, after editing menu.json, make the same changes in menu-fallback.js.
The data begins after:
window.MENU_FALLBACK =

REPLACE FOOD IMAGES
-------------------
1. Put your new images in:
   assets/menu-images/

2. Recommended formats:
   .webp, .jpg, .png, or .svg

3. Change each item's "image" value, for example:
   "image": "assets/menu-images/my-burger.webp"

REPLACE BUILDING BACKGROUNDS
----------------------------
Replace:
assets/images/building.webp
assets/images/building2.webp

REPLACE LOGO
------------
Replace:
assets/images/logo.png

Keep the same filename to avoid changing the code.

LOGO ANIMATION
--------------
The opening animation appears once per browser tab/session.
To test it again:
- Close the browser tab and reopen it, or
- Open the website in a private/incognito tab.

FILES
-----
index.html              Main HTML structure
style.css               Design, responsive layout, animation
script.js               Creates categories, cards, modal, DOM
data/menu.json          Main hosted menu data
data/menu-fallback.js   Direct-opening fallback menu data
assets/images/          Logo and building backgrounds
assets/menu-images/     Menu item images
