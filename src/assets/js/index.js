import "../css/main.css"


// active color btn
const listItems = document.querySelectorAll(".tabs li");
const itemsArray = Array.from(listItems);
const lightPages = document.querySelectorAll(".lightPages");
const darkPages = document.querySelectorAll(".darkPages");

// added active color and toggle dark and light
itemsArray.forEach((item) => {
    item.addEventListener("click", () => {
        itemsArray.forEach((item) => {
            item.classList.remove("active");
        });
        item.classList.add("active");
        const activeItem = document.querySelector(".tabs li.active");
        if (activeItem) {
            if (activeItem.innerText.trim() === "Dark") {
                lightPages.forEach((page) => {
                    page.classList.add("hidden");
                });
                darkPages.forEach((page) => {
                    page.classList.remove("hidden");
                });
            }
            else {
                lightPages.forEach((page) => {
                    page.classList.remove("hidden");
                });
                darkPages.forEach((page) => {
                    page.classList.add("hidden");
                });
            }
        }
    });
});


// handle mobile menu
const toggleMenu = document.getElementById("toggle-menu");
const dropDown = document.getElementById("drop-down");
const label = document.querySelector('label[for="toggle-menu"]');

// Handle open/close
toggleMenu.addEventListener("change", () => {
    if (toggleMenu.checked) {
        dropDown.classList.remove("hidden");
    } else {
        dropDown.classList.add("hidden");
    }
});
label.addEventListener("click", (e) => {
    e.stopPropagation();
});
window.addEventListener("click", (e) => {
    if (!label.contains(e.target) && !dropDown.contains(e.target)) {
        dropDown.classList.add("hidden");
        toggleMenu.checked = false;
    }
});


