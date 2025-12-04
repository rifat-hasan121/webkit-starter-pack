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


// hero banner background animation
const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();

let stars = [];
const STAR_COUNT = 250;

function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speed: 0.3 + Math.random() * 0.7,
            alpha: Math.random() * 0.7 + 0.3
        });
    }
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((s) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);

        s.y += s.speed;

        if (s.y > canvas.height) {
            s.y = -2;
            s.x = Math.random() * canvas.width;
        }
    });

    requestAnimationFrame(animateStars);
}

createStars();
animateStars();

window.addEventListener("resize", () => {
    resizeCanvas();
    createStars();
});
