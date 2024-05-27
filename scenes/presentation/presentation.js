import { Scene } from "../../system/scene.js";
import { GameScene } from "../game/game.js";

export class PresentationScene extends Scene {

    domPath = "./presentation.html";
    stylePath = "./presentation.css";

    animations = {};

    step = 0;

    textLines = [
        [0, "Este é o planeta terra<br/>O planeta onde vivemos"],
        [1, "De todas as coisas que nele existem, o seu interior<br/>é uma das que mais intrigam o ser humano."],
        [2, "Ao que sabemos, o interior da terra é<br/>dividido em diversas classificações e camadas."],
        [3, "Algumas baseadas em suas propriedas físicas<br/>e outras, em suas propriedades químicas."],
        [4, "Vocês vão, agora, explorar cada<br/>uma dessas camadas mais de perto."],
    ];

    onLoad()
    {
        this.setupScene();
        //alert("setupped!");
    }


    setupScene()
    {
        this.setupBackground();
        this.setupAnimations();
        this.setupFunctionality();
    }

    setupFunctionality()
    {
        const m = () => {
                removeEventListener('click', m);
                removeEventListener('touchend', m);
    
                const presentText = document.querySelector("#presentation-text");
    
                presentText.style.animation = "fading-off 1s";
                presentText.addEventListener('animationend', () => presentText.remove());
    
                this.setupGame();
        };

        addEventListener('click', m);
        addEventListener('touchend', m);
    }

    setupGame()
    {
        this.gameStarted = true;
        this.step = 0;

        const clickEv = () => {

            if (this.step < 5)
            {
                document.querySelector('#info-text').hidden = false;
                document.querySelector('#info-text-content').innerHTML = this.textLines[this.step][1];
                this.updateAnimation(this.textLines[this.step][0]);
            }
            else
            {
                removeEventListener('click', clickEv);
                removeEventListener('touchend', clickEv);
                this.warp();
            }

            this.step++;

        };

        addEventListener('click', clickEv);
        addEventListener('touchend', clickEv);
    }

    updateAnimation(step)
    {
        switch (step)
        {
            case 0:
                document.querySelector("#default-earth").style.opacity = 1;
                document.querySelector("#divided-earth").style.opacity = 0;
                break;
            
            case 1:
                document.querySelector("#default-earth").style.opacity = 1;
                document.querySelector("#divided-earth").style.opacity = 0;

                this.startAnim("changePlannets", () => {

                    let p1 = document.querySelector("#default-earth");
                    let p2 = document.querySelector("#divided-earth");

                    let transparency = Number(p1.style.getPropertyValue('opacity'));
                    transparency -= 1/24;

                    p1.style.setProperty('opacity' , transparency);
                    p2.style.setProperty('opacity' , 1 - transparency);

                    if (transparency <= 0)
                    {
                        p1.style.setProperty('opacity' , 0);
                        p2.style.setProperty('opacity' , 1);
                        this.stopAnim("changePlannets");
                    }

                }, 1000/24);

                break;
            
            case 2:
                this.stopAnim("changePlannets");
                document.querySelector("#default-earth").style.opacity = 0;
                document.querySelector("#divided-earth").style.opacity = 1;

                document.querySelector("#divided-earth").querySelector(".crust").style.position = "relative";
                document.querySelector("#divided-earth").querySelector(".mantle").style.position = "relative";
                document.querySelector("#divided-earth").querySelector(".core").style.position = "relative";

                document.querySelector("#divided-earth").style.width = "99%";

                break;
            
            case 3:
                document.querySelector("#divided-earth").querySelector(".crust").style.position = "absolute";
                document.querySelector("#divided-earth").querySelector(".mantle").style.position = "absolute";
                document.querySelector("#divided-earth").querySelector(".core").style.position = "absolute";

                document.querySelector("#divided-earth").style.width = "200px";

                break;

            case 4:
                document.querySelector("#default-earth").style.opacity = 0;
                document.querySelector("#divided-earth").style.opacity = 1;

                this.startAnim("changePlannets", () => {

                    let p1 = document.querySelector("#default-earth");
                    let p2 = document.querySelector("#divided-earth");

                    let transparency = Number(p1.style.getPropertyValue('opacity'));
                    transparency += 1/24;

                    p1.style.setProperty('opacity' , transparency);
                    p2.style.setProperty('opacity' , 1 - transparency);

                    if (transparency >= 1)
                    {
                        p1.style.setProperty('opacity' , 1);
                        p2.style.setProperty('opacity' , 0);
                        this.stopAnim("changePlannets");
                    }

                }, 1000/24);

                break;

            default: alert("animation " + step + " is undefined!");
        }
    }

    warp()
    {   
        window.history.pushState({}, "", window.location + "?scene=1");

        document.querySelector('#info-text').hidden = true;
        document.querySelector("#default-earth").style.zoom = 1;

        this.startAnim("warping", () => {
            const cover = document.getElementById("cover");
            const planet = document.getElementById("default-earth");

            const currentZoom = Number(planet.style.getPropertyValue('zoom'));
            planet.style.setProperty('zoom', currentZoom * 1.03);

            const brightness = currentZoom;
            const blur = Math.floor((currentZoom-1) * 5);

            cover.style.setProperty('backdrop-filter', `brightness(${brightness}) blur(${blur}px)`);

            if (blur >= 20)
            {
                this.stopAnim("warping");
                this.stopAnim("planetSpinning");
                this.changeSceneMethod(GameScene);
            }

        }, 1000/24);
    }

    setupAnimations()
    {
        // planet spinning
        this.startAnim('planetSpinning', () => {
            const p = document.getElementById("earth-container");

            let current = Number(p.style.getPropertyValue('--background-offset').slice(0, -2));

            if (current < -2000) current += 2000;

            p.style.setProperty('--background-offset', (current - (1 * 2000 / 500)) + "px");

        }, 1000/10);
    }

    setupBackground()
    {
        const spacebg = document.querySelector("#space");
        spacebg.style.backgroundImage = "url(\"./" + this.selectBackground() + "\")";
    }
    selectBackground()
    {
        const max = 9;
        const value = Math.floor(Math.random() * max);

        return `assets/presentation/spacebg-${value}.png`;
    }


    startAnim(label, func, time)
    {
        this.animations[label] = setInterval(func, time);
    }
    stopAnim(label)
    {
        clearInterval(this.animations[label]);
        this.animations[label] = undefined;
    }

    getMeta() { return import.meta; }
}