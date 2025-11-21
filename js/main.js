

    const pixelBot = document.getElementById("pixel-bot");
    const juegoContenedor = document.getElementById("juego-contenedor");
    const mensajeJuego = document.getElementById("mensaje-juego");
    const puntuacionDisplay = document.getElementById("puntuacion");
    const nivelDisplay = document.getElementById("nivel-display");
    const nicknameDisplay = document.getElementById("nick-display");
    const suelo = document.getElementById("suelo");

    let isJumping = false;
    let botBottom = 30;
    let score = 0;
    let nivel = 1;
    let gameOver = true;
    let obstacleInterval;

    let nickname = "";


    /* -------------------- NICKNAME -------------------- */
    document.getElementById("nickname-btn").addEventListener("click", () => {
        const input = document.getElementById("nickname-input").value.trim();

        if (input !== "") {
            nickname = input;

            document.getElementById("nickname-container").style.display = "none";

            nicknameDisplay.textContent = "Nick: " + nickname;

            mensajeJuego.style.display = "block";
            mensajeJuego.textContent = `Bienvenido ${nickname}! Presiona ESPACIO para empezar`;
        }
    });



    /* -------------------- SALTO -------------------- */
    function jump() {
        if (isJumping) return;
        isJumping = true;

        let jumpHeight = 150;
        let jumpSpeed = 10;
        let currentJumpHeight = 0;

        const upTimerId = setInterval(() => {
            if (currentJumpHeight >= jumpHeight) {
                clearInterval(upTimerId);

                const downTimerId = setInterval(() => {
                    if (botBottom <= 30) {
                        clearInterval(downTimerId);
                        botBottom = 30;
                        pixelBot.style.bottom = botBottom + "px";
                        isJumping = false;
                    }
                    botBottom -= jumpSpeed;
                    pixelBot.style.bottom = botBottom + "px";
                }, 20);
            }

            botBottom += jumpSpeed;
            currentJumpHeight += jumpSpeed;
            pixelBot.style.bottom = botBottom + "px";
        }, 20);
    }



    /* -------------------- FONDO DIA/NOCHE -------------------- */
    function actualizarFondo() {
        if (score % 5 === 0) {
            juegoContenedor.classList.toggle("dia");
            juegoContenedor.classList.toggle("noche");
        }
    }


    /* -------------------- NIVEL -------------------- */
    function actualizarNivel() {
        nivel = Math.floor(score / 5) + 1;
        nivelDisplay.textContent = "Nivel: " + nivel;
    }



    /* -------------------- OBSTACULOS -------------------- */
    function generarObstaculo() {
        if (gameOver) return;

        let obstaclePosition = 900;
        const obstacle = document.createElement("div");
        obstacle.classList.add("obstaculo");
        juegoContenedor.appendChild(obstacle);

        const moverObstaculo = setInterval(() => {

            if (obstaclePosition < -30) {
                clearInterval(moverObstaculo);
                juegoContenedor.removeChild(obstacle);

                score++;
                puntuacionDisplay.textContent = "Puntuación: " + score;

                actualizarFondo();
                actualizarNivel();
            }

            if (
                obstaclePosition > 50 &&
                obstaclePosition < 100 &&
                botBottom < 80
            ) {
                clearInterval(moverObstaculo);
                clearInterval(obstacleInterval);
                gameOver = true;

                mensajeJuego.textContent =
                    `GAME OVER ${nickname}! Puntuación final: ${score}\nPresiona ESPACIO para reiniciar`;
                mensajeJuego.style.display = "block";
                suelo.style.animationPlayState = "pause";
            }

            obstaclePosition -= 10;
            obstacle.style.left = obstaclePosition + "px";

        }, 20);
    }



    /* -------------------- INICIO -------------------- */
    function iniciarJuego() {
        document.querySelectorAll(".obstaculo").forEach(o => o.remove());

        score = 0;
        nivel = 1;
        botBottom = 30;

        puntuacionDisplay.textContent = "Puntuación: 0";
        nivelDisplay.textContent = "Nivel: 1";

        pixelBot.style.bottom = "30px";

        juegoContenedor.classList.remove("noche");
        juegoContenedor.classList.add("dia");

        isJumping = false;
        gameOver = false;

        mensajeJuego.style.display = "none";
        suelo.style.animationPlayState = "running";

        obstacleInterval = setInterval(generarObstaculo, 2000);
    }



    /* -------------------- CONTROLES -------------------- */
    document.addEventListener("keydown", (e) => {

        if (e.code === "Space") {
            // SOLO inicia el juego
            if (gameOver) iniciarJuego();
        } else {
            // TODAS las otras teclas hacen saltar
            if (!gameOver) jump();
        }

    });

