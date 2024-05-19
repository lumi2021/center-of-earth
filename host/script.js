import { PresentationScene } from "./scenes/presentation/presentation.js";

const contentViewer = document.querySelector("#content-container");
const contentStyle = document.querySelector("#content-style");

var scene = undefined;

function main()
{
    changeScene(PresentationScene);
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

