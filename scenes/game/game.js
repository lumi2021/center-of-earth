import { Scene } from "../../system/scene.js";
import { Congratulations } from "../congrats/congrats.js";

export class GameScene extends Scene {

    domPath = "./game.html";
    stylePath = "./game.css";

    layersColumnsCount = 0;
    tileWorldSize = 64;

    mainContainer = null;

    fsize = [0, 0];
    fctx = null;

    chars = null;
    tiles = null;

    lastTimestamp = 0;

    audio = [];
    lastTrackIdx = 4;
    lavaPlaying = false;

    breakingAnim = [];
    breakingIdx = 0;
    breakingMax = 2;

    characters = [
        { "skin": [7,3], "depth": -1, "cooldown": 1000, "timer": 3000 },
    ];

    depthIndex = [
        [0,   1, 1,  0],
        [1,   1, 1,  1],
        [6,   1, 2,  1],
        [9,   1, 3,  2],
        [11,  1, 5,  2],
        [14,  1, 4,  2],
        [16,  1, 6,  2],
        [17,  1, 7,  2],
        [20,  1, 8,  3],
        [24,  1, 9,  3],
        [28,  1,10,  3],
        [32,  1,11,  3],
        [47,  3, 0,  2],
        [80,  3, 1,  2],
        [100, 3, 2,  2],
        [125, 3, 3,  2],
        [137, 3, 4,  2],
    ];

    unbind = undefined;

    onQuestion = false;

    onLoad()
    {
        this.setupScene();
        this.setupInformation();
        this.setupGame();
    }

    setupGame()
    {
        this.setupAssets();

        this.mainContainer = document.querySelector("#container");

        this.mainContainer.scrollTop = 0;

        this.unbind = this.onClick.bind(this);
        window.addEventListener('click', this.unbind);

        document.querySelector("#questionScreen").addEventListener('animationend', () => {
            let a = document.querySelector("#questionScreen");

            if (!a.classList.contains("hidden")) return;

            a.classList.remove("hidden");
            a.classList.add("noDisplay");
        });
    }

    onClick()
    {
        if (this.onQuestion) return;

        this.breakingIdx++;

        if (this.breakingIdx >= this.breakingMax)
        {
            this.breakingIdx = 0;
            this.digDown();
        }
        else
        {
            let rng = Math.floor(Math.random() * 4);
            if (rng == this.lastTrackIdx)
            {
                if (rng == 0) rng++;
                else rng--;
            }

            this.lastTrackIdx = rng;
            let sfxo = 0;

            this.depthIndex.forEach(e => {
                if (e[0] > this.characters[0].depth) return;
                sfxo = e[3] * 8;
            });

            switch (rng)
            {
                case 0: this.audio[sfxo+0].play(); break;
                case 1: this.audio[sfxo+1].play(); break;
                case 2: this.audio[sfxo+2].play(); break;
                case 3: this.audio[sfxo+3].play(); break;
            }
        }

        this.drawForeground();
    }

    digDown()
    {
        this.characters[0].depth += 1;
        this.mainContainer.scrollTop = (this.characters[0].depth + 1) * this.tileWorldSize;
        
        let rng = Math.floor(Math.random() * 4);
        if (rng == this.lastTrackIdx)
        {
            if (rng == 0) rng++;
            else rng--;
        }

        this.lastTrackIdx = rng;
        
        let sfxo = 0;
        this.depthIndex.forEach(e => {
            if (e[0] > this.characters[0].depth) return;
            sfxo = e[3] * 8 + 4;
        });

        switch (rng)
        {
            case 0: this.audio[sfxo+0].play(); break;
            case 1: this.audio[sfxo+1].play(); break;
            case 2: this.audio[sfxo+2].play(); break;
            case 3: this.audio[sfxo+3].play(); break;
        }

        if (this.characters[0].depth > 30 && this.characters[0].depth < 80 && !this.lavaPlaying)
        {
            this.lavaPlaying = true;
            this.audio[32].play();
        }
        else if (this.characters[0].depth >= 80 && this.lavaPlaying)
        {
            this.lavaPlaying = false;
            this.audio[32].pause();
        }

        if (this.characters[0].depth >= 149)
        {
            window.removeEventListener('click', this.unbind);
            this.changeSceneMethod(Congratulations);
        }

        if (this.characters[0].depth > 9 && this.characters[0].depth < 149 && this.characters[0].depth % 10 == 0)
        {
            this.runQuestion();   
        }
    }


    runQuestion()
    {
        let questionList = [
            {
                "text" : "Quantas camadas principais a Terra possui?",
                "ops" : [
                    "4", "7", "6", "3"
                ]
            },
            {
                "text" : "Qual é a camada mais externa da Terra?",
                "ops" : [
                    "Crosta",
                    "Exterior",
                    "Manto",
                    "Superfície"
                ]
            },
            {
                "text" : "Qual camada da Terra está localizada entre a crosta e o núcleo?",
                "ops" : [
                    "Manto",
                    "Magma",
                    "Interior",
                    "Crosta"
                ]
            },
            {
                "text" : "Qual é a camada mais interna da Terra?",
                "ops" : [
                    "Núcleo Superior",
                    "Núcleo Inferior",
                    "Núcleo Externo",
                    "Manto Interno"
                ]
            },
            {
                "text" : "O núcleo da Terra é composto por duas partes. Quais são elas?",
                "ops" : [
                    "Interno e Externo",
                    "Maior e Menor",
                    "Quente e Frio",
                    "Líquido e Sólido"
                ]
            },
            {
                "text" : "Qual camada da Terra é responsável pela tectônica de placas?",
                "ops" : [
                    "Manto",
                    "Crosta",
                    "Núcleo Inferior",
                    "Núcleo Superior"
                ]
            },
            {
                "text" : "Qual elemento é o mais abundante na composição do núcleo da Terra?",
                "ops" : [
                    "Ferro",
                    "Níquel",
                    "Hélio",
                    "Plutônio"
                ]
            },
            {
                "text" : "Qual é a camada mais fina da Terra?",
                "ops" : [
                    "Crosta",
                    "Manto Superior",
                    "Manto Inferior",
                    "Núcleo"
                ]
            },
        ];

        this.onQuestion = true;

        let questionEl = document.querySelector("#questionScreen");

        questionEl.classList.remove("noDisplay");
        questionEl.classList.remove("hidden");
        questionEl.classList.add("shown");

        let questionText = questionEl.querySelector(".text");
        let optionsContainer = questionEl.querySelector(".options");
        let options = optionsContainer.getElementsByClassName("option");
        let timer = questionEl.querySelector("#timeBar");

        optionsContainer.classList.remove("answered");

        timer.style.width = '100%';

        let question = questionList[Math.floor(Math.random() * questionList.length)];

        questionText.innerText = question.text;

        let rightAnswer = question.ops[0];
        let questionOps = question.ops.slice(0);

        questionOps = questionOps.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        
        let enabled = false;

        const onOptionClicked = () => {
            if (enabled) destroy();
        }

        for (let i = 0; i < 4; i++)
        {
            options[i].innerText = questionOps[i];   
            if (questionOps[i] == rightAnswer)
            {
                options[i].classList.add("correct");
                options[i].classList.remove("wrong");
            }
            else
            {
                options[i].classList.add("wrong");
                options[i].classList.remove("correct");
            }

            options[i].addEventListener('click', onOptionClicked.bind(this));
        }

        optionsContainer.classList.add("disabled");

        let timeout = undefined;
        const showOptions = () => {
            optionsContainer.classList.remove("disabled");
            timeout = window.setInterval(ontime.bind(this), 1000/60);
            enabled = true;
        }

        let time = 10;
        const ontime = () => {
            time -= 1/60;
            timer.style.width = (time / 10 * 100) + '%';

            if (time <= 0) destroy();
        }

        window.setTimeout(showOptions.bind(this), 2000);

        const destroy = () => {
            window.clearTimeout(timeout);
            optionsContainer.classList.add("answered");
            questionEl.classList.remove("sown");
            questionEl.classList.add("hidden");

            enabled = false;
            time = 5;

            this.onQuestion = false;
        }

    }


    async setupAssets()
    {
        this.audio.push(new Audio('assets/game/step/grass1.ogg')); // 0
        this.audio.push(new Audio('assets/game/step/grass2.ogg')); // 1
        this.audio.push(new Audio('assets/game/step/grass3.ogg')); // 2
        this.audio.push(new Audio('assets/game/step/grass4.ogg')); // 3

        this.audio.push(new Audio('assets/game/dig/gravel1.ogg')); // 4
        this.audio.push(new Audio('assets/game/dig/gravel2.ogg')); // 5
        this.audio.push(new Audio('assets/game/dig/gravel3.ogg')); // 6
        this.audio.push(new Audio('assets/game/dig/gravel4.ogg')); // 7

        this.audio.push(new Audio('assets/game/step/gravel1.ogg')); // 8
        this.audio.push(new Audio('assets/game/step/gravel2.ogg')); // 9
        this.audio.push(new Audio('assets/game/step/gravel3.ogg')); // 10
        this.audio.push(new Audio('assets/game/step/gravel4.ogg')); // 11

        this.audio.push(new Audio('assets/game/dig/gravel1.ogg')); // 12
        this.audio.push(new Audio('assets/game/dig/gravel2.ogg')); // 13
        this.audio.push(new Audio('assets/game/dig/gravel3.ogg')); // 14
        this.audio.push(new Audio('assets/game/dig/gravel4.ogg')); // 15

        this.audio.push(new Audio('assets/game/step/stone1.ogg')); // 16
        this.audio.push(new Audio('assets/game/step/stone2.ogg')); // 17
        this.audio.push(new Audio('assets/game/step/stone3.ogg')); // 18
        this.audio.push(new Audio('assets/game/step/stone4.ogg')); // 19

        this.audio.push(new Audio('assets/game/dig/stone1.ogg')); // 20
        this.audio.push(new Audio('assets/game/dig/stone4.ogg')); // 21
        this.audio.push(new Audio('assets/game/dig/stone1.ogg')); // 22
        this.audio.push(new Audio('assets/game/dig/stone4.ogg')); // 23

        this.audio.push(new Audio('assets/game/step/cloth1.ogg')); // 24
        this.audio.push(new Audio('assets/game/step/cloth2.ogg')); // 25
        this.audio.push(new Audio('assets/game/step/cloth3.ogg')); // 26
        this.audio.push(new Audio('assets/game/step/cloth4.ogg')); // 27

        this.audio.push(new Audio('assets/game/dig/cloth1.ogg')); // 28
        this.audio.push(new Audio('assets/game/dig/cloth2.ogg')); // 29
        this.audio.push(new Audio('assets/game/dig/cloth3.ogg')); // 30
        this.audio.push(new Audio('assets/game/dig/cloth4.ogg')); // 31

        this.audio.push(new Audio('assets/game/lava.ogg')); // 32
        this.audio[32].loop = true;

        for (var i = 0; i < 10; i++)
        {
            let sprite = await new Promise((resolve, reject) => {
                let sprite = new Image();
                sprite.onload = () => resolve(sprite);
                sprite.onerror = () => reject;
                sprite.src = "assets/game/destroy_stage_" + i + ".png";
            });
            this.breakingAnim.push(sprite);
        }
    }

    setupScene()
    {
        this.setupClouds();
        this.setupLayers();
        this.setupForeground();
    }

    setupClouds()
    {
        const sky = document.getElementsByClassName("sky-bg")[0];
        const cloud = document.getElementsByClassName("cloud")[0];

        for (let i = 0; i < 20; i++) {
            const nc = cloud.cloneNode(true);
            
            nc.style.top = -100 + (10 * i) + 'px';
            nc.style.animationDelay = -(Math.random() * 20) + 's';
            nc.style.animationDuration = (Math.random() * 5) + 15 + 's';

            sky.appendChild(nc);
        }
    }

    drawForeground()
    {
        this.fctx.clearRect(0, 0, this.fsize[0], this.fsize[1]);

        let columnSpace = Math.floor(this.layersColumnsCount / (this.characters.length + 1));
        let surfacePos = window.innerHeight - 64 - document.querySelector('#container').scrollTop;

        let dlt = window.screenTop - 128 - 64;
        let dlb = window.screenTop + window.innerHeight;
        
        for (var i = 0; i < this.characters.length; i++)
        {
            let char = this.characters[i];
            
            let currentTile = [0, 0];
            for (var j = 0; j <= char.depth; j++)
            {
                let tile = this.depthIndex.find(e => e[0] == j);
                if (tile) { currentTile[0] = tile[1]; currentTile[1] = tile[2]; }
                
                if (surfacePos + (j * 64) < dlt) continue;
                if (surfacePos + (j * 64) > dlb) break;

                this.fctx.drawImage(
                    this.tiles,
                    currentTile[0] * 16, currentTile[1] * 16, 16, 16,
                    columnSpace * (i+1) * 64, surfacePos + (j * 64),
                    this.tileWorldSize, this.tileWorldSize
                );
            }

            this.fctx.drawImage(
                this.chars,
                char.skin[0] * 16, char.skin[1] * 16, 16, 16,
                columnSpace * (i+1) * 64, surfacePos + (char.depth * 64),
                this.tileWorldSize, this.tileWorldSize
            );

            let idx = Math.floor(this.breakingIdx / this.breakingMax * this.breakingAnim.length);
            let frame = this.breakingAnim[idx];

            if (frame)
            {
                this.fctx.drawImage(
                    this.breakingAnim[idx],
                    0, 0, 16, 16,
                    columnSpace * (i+1) * 64, surfacePos + ((char.depth+1) * 64),
                    this.tileWorldSize, this.tileWorldSize
                );
            }
        }
    }

    async setupForeground()
    {
        this.chars = await new Promise((resolve, reject) => {
            let sprite = new Image();
            sprite.onload = () => resolve(sprite);
            sprite.onerror = () => reject;
            sprite.src = "assets/characters.png";
        });

        let foregroundCanvas = document.querySelector("#foreground-canvas");
        this.fctx = foregroundCanvas.getContext("2d");

        foregroundCanvas.width = window.innerWidth;
        foregroundCanvas.height = window.innerHeight;
        foregroundCanvas.style.position = "fixed";
        foregroundCanvas.style.top = "0";
        foregroundCanvas.style.left = "0";
        this.fctx.imageSmoothingEnabled = false;

        this.fsize[0] = foregroundCanvas.width;
        this.fsize[1] = foregroundCanvas.height;

        this.drawForeground();
    }

    async setupLayers()
    {
        this.tiles = await new Promise((resolve, reject) => {
            let sprite = new Image();
            sprite.onload = () => resolve(sprite);
            sprite.onerror = () => reject;
            sprite.src = "assets/game/tiles.png";
        });

        this.layersColumnsCount = Math.ceil(window.innerWidth / this.tileWorldSize);

        this.setupCrust();
        this.setupMantle();
        this.setupCore();
    }

    async setupCrust()
    {
        // +/- 80km - escala: 1 tile : 5km (16 tiles)

        let crustCanvas = document.querySelector("#crust");
        let ctx = crustCanvas.getContext("2d");

        crustCanvas.width = crustCanvas.parentElement.clientWidth;
        crustCanvas.height = 17 * this.tileWorldSize;
        ctx.imageSmoothingEnabled = false;

        const setTile = (px, py, tx, ty) => {
            ctx.drawImage(
                this.tiles,
                tx * 16, ty * 16, 16, 16,
                px * this.tileWorldSize, py * this.tileWorldSize,
                this.tileWorldSize, this.tileWorldSize
            );
        };

        for (let i = 0; i < this.layersColumnsCount; i++) {

            setTile(i,  0, 0, 0);

            setTile(i,  1, 0, 1);
            setTile(i,  2, 0, 1);
            setTile(i,  3, 0, 1);
            setTile(i,  4, 0, 1);
            setTile(i,  5, 0, 1);
            setTile(i,  6, 0, 2);
            setTile(i,  7, 0, 2);
            setTile(i,  8, 0, 2);

            setTile(i,  9, 0, 3);
            setTile(i, 10, 0, 3);
            setTile(i, 11, 0, 5);
            setTile(i, 12, 0, 5);
            setTile(i, 13, 0, 5);

            setTile(i, 14, 0, 4);
            setTile(i, 15, 0, 4);
            setTile(i, 16, 0, 6);

        }

    }

    async setupMantle()
    {
        // superior: +/-   465km - escala: 1 tile : 31km (15 tiles)
        // inferior: +/- 2.425km - escala: 1 tile : 50km (48 tiles)

        let mantleCanvas = document.querySelector("#mantle");
        let ctx = mantleCanvas.getContext("2d");

        mantleCanvas.width = mantleCanvas.parentElement.clientWidth;
        mantleCanvas.height = (15 + 48) * this.tileWorldSize;
        ctx.imageSmoothingEnabled = false;

        const setTile = (px, py, tx, ty) => {
            ctx.drawImage(
                this.tiles,
                tx * 16, ty * 16, 16, 16,
                px * this.tileWorldSize, py * this.tileWorldSize,
                this.tileWorldSize, this.tileWorldSize
            );
        };

        for (let i = 0; i < this.layersColumnsCount; i++) {

            setTile(i,  0, 0, 7);
            setTile(i,  1, 0, 7);
            setTile(i,  2, 0, 7);

            setTile(i,  3, 0, 8);
            setTile(i,  4, 0, 8);
            setTile(i,  5, 0, 8);
            setTile(i,  6, 0, 8);

            setTile(i,  7, 0, 9);
            setTile(i,  8, 0, 9);
            setTile(i,  9, 0, 9);
            setTile(i, 10, 0, 9);

            setTile(i, 11, 0, 10);
            setTile(i, 12, 0, 10);
            setTile(i, 13, 0, 10);
            setTile(i, 14, 0, 10);

            for (let j = 0; j < 15; j++) setTile(i, 15 + j, 0, 11);
            for (let j = 0; j < 48; j++) setTile(i, 30 + j, 2, 0);

        }
    }

    async setupCore()
    {
        // superior: +/-  2.260km - escala: 1 tile : 50km (45 tiles)
        // inferior: +/-  1.220km - escala: 1 tile : 50km (24 tiles)

        let coreCanvas = document.querySelector("#core");
        let ctx = coreCanvas.getContext("2d");

        coreCanvas.width = coreCanvas.parentElement.clientWidth;
        coreCanvas.height = (45 + 24) * this.tileWorldSize;
        ctx.imageSmoothingEnabled = false;

        const setTile = (px, py, tx, ty) => {
            ctx.drawImage(
                this.tiles,
                tx * 16, ty * 16, 16, 16,
                px * this.tileWorldSize, py * this.tileWorldSize,
                this.tileWorldSize, this.tileWorldSize
            );
        };

        for (let i = 0; i < this.layersColumnsCount; i++) {

            for (let j = 0; j < 20; j++) setTile(i,      j, 2, 1);
            for (let j = 0; j < 25; j++) setTile(i, 20 + j, 2, 2);

            for (let j = 0; j < 12; j++) setTile(i, 45 + j, 2, 3);
            for (let j = 0; j < 12; j++) setTile(i, 57 + j, 2, 4);

        }
    }

    setupInformation()
    {
        let infoEl = document.querySelector("#information");
        let offsetTop = window.innerHeight;

        const addTxt = (content, posX, posY, width, height, aligin) =>
        {
            let tex = document.createElement("p");
            infoEl.appendChild(tex);

            tex.style.top = offsetTop + posY + 'px';
            tex.style.left = posX + 'px';
            
            if (("" + width).endsWith('%'))
                tex.style.width = width;
            else
                tex.style.width = width + 'px';
            
            tex.style.height = height + 'px';
            
            if (aligin)
                tex.style.textAlign = aligin; 

            tex.innerHTML = content;
        }
        const addLine = (text, km, height) =>
        {
            let container = document.createElement("div");
            container.style.width = window.innerWidth - 30 + 'px';
            container.style.top = offsetTop + (height * this.tileWorldSize) - 5 + 'px';
            container.style.position = 'absolute';

            let line = document.createElement("div");
            line.style.background = "url('assets/game/line.png')";
            line.style.backgroundSize = 'auto 100%';
            line.style.backgroundPosition = 'center';
            line.style.width = '100%';
            line.style.height = '10px';

            let hlabel = document.createElement("p");
            hlabel.classList.add("title");
            hlabel.innerText = km;
            hlabel.style.left = '10px';
            hlabel.style.top = '-2px';

            let title = document.createElement("p");
            title.classList.add("title");
            title.innerText = text;
            title.style.right = '10px';
            title.style.top = '-2px';

            container.appendChild(line);
            container.appendChild(hlabel);
            container.appendChild(title);
            infoEl.appendChild(container);

        }

        // crosta
        addTxt(
            `
            <spam class='title'>A crosta terrestre</spam>
            É a camada mais externa, fina e sólida, onde vivemos.
            A crosta terrestre varia em espessura, sendo mais fina
            sob os oceanos e mais espessa sob os continentes.
            `,
            10, 0, 300, 200
        );

        addTxt(
            `
            É composta principalmente por silicatos
            de alumínio e silicatos de magnésio e ferro.
            A crosta continental é rica em granito, enquanto a
            crosta oceânica é rica em basalto.
            `,
            window.innerWidth - 40 - 300, 500, 300, 200
        );

        // Manto
        addTxt(
            `
            <spam class='title'>O Manto Terrestre</spam>
            Localiza-se abaixo da crosta e se estende até cerca de 2.900 km de profundidade.
            É composto por rochas silicatadas e é dividido em manto superior e inferior.
            `,
            window.innerWidth - 40 - 300, 1400, 300, 200
        );

        addTxt(
            `
            O manto superior inclui a astenosfera, uma zona semi-líquida que permite o movimento
            das placas tectônicas.

            `,
            10, 1800, 300, 200
        );

        addTxt(
            `
            As temperaturas no manto inferior variam de cerca de 1.000°C
            a 3.700°C, aumentando com a profundidade.
            `,
            10, 3200, 300, 200
        );
        addTxt(
            `
            Apesar das altas temperaturas, o manto inferior é sólido devido
            à pressão extrema que impede a fusão dos minerais.
            `,
            10, 4000, 300, 200
        );

        // Núcleo
        addTxt(
            `
            <spam class='title'>O Núcleo terrestre</spam>
            Situado abaixo do manto, estendendo-se de 2.900 km
            a 5.150 km de profundidade. É composto principalmente
            por ferro e níquel em estado líquido. O movimento do
            líquido no núcleo externo gera o campo magnético da Terra.

            `,
            window.innerWidth - 40 - 300, 5300, 300, 200
        );

        addTxt(
            `
            <spam class='title'>O Núcleo Interno</spam>
            É a camada mais interna da terra, composta principalmente por ferro e
            níquel em estado sólido, devido à alta pressão.
            `,
            10, 8000, 300, 200
        );

        addTxt(
            `
            Você está quase no final da jornada.
            `,
            0, 8500, '100%', 200, 'center'
        );

        addLine("Manto superior", "80 Km", 16);
        addLine("Manto inferior", "535 Km", 46);
        addLine("Núcleo superior", "2.890 Km", 79);
        addLine("Núcleo inferior", "5.165 Km", 124);

    }


    getMeta() { return import.meta; }
}
