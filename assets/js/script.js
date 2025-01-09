document.addEventListener("DOMContentLoaded", function () {
    const enterButton = document.getElementById("enterButton");

    // Show the "Enter" button after 2 seconds
    setTimeout(() => {
        enterButton.style.display = "block";
    }, 2000);

    // Portfolio carousel functionality
    let currentSlide = 0;
    const carouselItems = document.querySelectorAll(".carousel-item");
    const totalSlides = carouselItems.length;

    function updateCarousel() {
        carouselItems.forEach((item, index) => {
            item.classList.remove("active");
            if (index === currentSlide) {
                item.classList.add("active");
            }
        });
    }

    window.navigateCarousel = function (direction) {
        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
        updateCarousel();
    };

    window.openPortfolio = function () {
        document.getElementById("home").style.display = "none";
        document.getElementById("portfolioCarousel").style.display = "flex";
        updateCarousel();
    };

    window.closePortfolio = function () {
        document.getElementById("portfolioCarousel").style.display = "none";
        document.getElementById("home").style.display = "block";
    };

    // Open About Us section
    window.openAboutUs = function () {
        document.getElementById("home").style.display = "none";
        document.getElementById("aboutUs").style.display = "flex";
    };

    // Close About Us section
    window.closeAboutUs = function () {
        document.getElementById("aboutUs").style.display = "none";
        document.getElementById("home").style.display = "block";
    };

    // Open Contact Us section
    window.openContactUs = function () {
        document.getElementById("home").style.display = "none";
        document.getElementById("contactUs").style.display = "flex";
    };

    // Close Contact Us section
    window.closeContactUs = function () {
        document.getElementById("contactUs").style.display = "none";
        document.getElementById("home").style.display = "block";
    };

    // Open the Our Game page
    window.openOurGame = function () {
        document.getElementById("home").style.display = "none";
        const gamePage = document.getElementById("ourGamePage");
        gamePage.style.display = "flex";

        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        // Set up canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Initialize game variables
        let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, vx: 0, vy: 0, color: "#ff0000" };
        const gravity = 0.5;
        const jumpForce = -10;
        const blockWidth = 40;
        const blockHeight = 20;
        const platformGap = { min: 150, max: 250 };
        const maxJumpHeight = 150; // Ensure the ball can jump to higher platforms
        let platforms = [];
        let score = 0;

        // Generate platforms with proper spacing and no overlap
        function generateLevel() {
            platforms = [];
            const numPlatforms = 6;
            const startY = canvas.height - 100;
            let previousX = Math.random() * canvas.width;
            let previousY = startY;

            for (let i = 0; i < numPlatforms; i++) {
                const platformWidth = Math.random() * (300 - 100) + 100;
                const numBlocks = Math.floor(platformWidth / blockWidth);
                const gapX = Math.random() * (platformGap.max - platformGap.min) + platformGap.min;
                const gapY = Math.random() * (maxJumpHeight / 2) + 50; // Ensure reachable height

                let x = Math.min(canvas.width - platformWidth, Math.max(0, previousX + (Math.random() < 0.5 ? -gapX : gapX)));
                let y = Math.max(blockHeight, previousY - gapY);

                // Generate individual blocks for the platform
                const blocks = [];
                for (let j = 0; j < numBlocks; j++) {
                    blocks.push({
                        x: x + j * blockWidth,
                        y: y,
                        width: blockWidth,
                        height: blockHeight,
                        color: "#ffffff",
                        changed: false,
                    });
                }

                platforms.push(blocks);
                previousX = x;
                previousY = y;
            }

            // Start the ball safely above the first platform
            ball.x = platforms[0][0].x + platforms[0][0].width / 2;
            ball.y = platforms[0][0].y - ball.radius;
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw platforms
            platforms.forEach(blocks => {
                blocks.forEach(block => {
                    ctx.fillStyle = block.color;
                    ctx.fillRect(block.x, block.y, block.width, block.height);
                });
            });

            // Draw ball
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = ball.color;
            ctx.fill();
            ctx.closePath();

            // Draw score
            ctx.fillStyle = "#ffffff";
            ctx.font = "20px Arial";
            ctx.fillText(`Score: ${score}`, 10, 30);
        }

        function update() {
            ball.vy += gravity;
            ball.x += ball.vx;
            ball.y += ball.vy;

            let onPlatform = false;

            // Check collision with platforms
            platforms.forEach(blocks => {
                blocks.forEach(block => {
                    if (
                        ball.x + ball.radius > block.x &&
                        ball.x - ball.radius < block.x + block.width &&
                        ball.y + ball.radius > block.y &&
                        ball.y + ball.radius < block.y + block.height
                    ) {
                        ball.vy = 0;
                        ball.y = block.y - ball.radius;
                        onPlatform = true;

                        // Change block color and increase score
                        if (!block.changed) {
                            block.color = "#00ff00";
                            block.changed = true;
                            score += 10;
                        }
                    }
                });
            });

            // Check if the ball falls below the canvas bottom
            if (ball.y - ball.radius > canvas.height) {
                alert(`Game Over! Final Score: ${score}`);
                generateLevel();
                score = 0;
            }

            // Check if all blocks are green
            if (platforms.every(blocks => blocks.every(block => block.changed))) {
                generateLevel();
            }
        }

        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }

        // Ball movement controls
        window.addEventListener("keydown", (e) => {
            if (e.key === "a") ball.vx = -5; // Move left
            if (e.key === "d") ball.vx = 5; // Move right
            if (e.key === " " && ball.vy === 0) ball.vy = jumpForce; // Jump
        });

        window.addEventListener("keyup", () => ball.vx = 0);

        generateLevel();
        gameLoop();
    };

    // Close the Our Game page and return to home
    window.closeOurGame = function () {
        document.getElementById("ourGamePage").style.display = "none";
        document.getElementById("home").style.display = "block";
    };
});

// Navigate to the home page when the user clicks the "Enter" button
function goToHome() {
    const intro = document.getElementById("intro");
    const home = document.getElementById("home");

    // Hide all other sections
    intro.style.display = "none"; // Hide the intro section
    home.style.display = "block"; // Show the home section
    document.getElementById("portfolioCarousel").style.display = "none"; // Hide portfolio
    const contactUs = document.getElementById("contactUs");
    if (contactUs) {
        contactUs.style.display = "none"; // Hide contact us form if it exists
    }
}
