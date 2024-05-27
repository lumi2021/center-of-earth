import { Congratulations } from "./scenes/congrats/congrats.js";
import { GameScene } from "./scenes/game/game.js";
import { PresentationScene } from "./scenes/presentation/presentation.js";

const contentViewer = document.querySelector("#content-container");
const contentStyle = document.querySelector("#content-style");

var scene = undefined;

function main()
{
    const params = new URLSearchParams(window.location.search);

    if (params.has('scene'))
    {
        if (params.get('scene') == 0) changeScene(PresentationScene);
        if (params.get('scene') == 1) changeScene(GameScene);
        if (params.get('scene') == 2) changeScene(Congratulations);
    }
    else changeScene(PresentationScene);
}

function changeScene(sceneClass)
{
    scene = new sceneClass(changeScene);
    refresh();
}
async function refresh()
{
    let dom = await scene.loadDom();
    let style = await scene.loadStylesheet();
    sceneLoaded(dom, style);
}

function sceneLoaded(dom, style)
{
    contentViewer.innerHTML = dom.innerHTML;
    contentStyle.innerText = style;

    scene.onLoad();
}

main();

