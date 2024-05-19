export class Scene {

    domPath = undefined;
    stylePath = undefined;

    changeSceneMethod = undefined;
    sceneDom = undefined;

    constructor(changeSceneM)
    {
        this.changeSceneMethod = changeSceneM;
    }

    onLoad() {}

    async loadDom()
    {

        if (this.domPath == undefined)
        {
            alert(`${this.constructor.name} does not declarate an dom Path!`);
            return undefined;
        }

        const globalPath = this.getMeta().resolve.bind(this)(this.domPath);
        
        let res = await fetch(globalPath);
        let text = await res.text();

        const doc = document.createElement("body");
        doc.id = this.constructor.name;
        doc.innerHTML = text;

        this.sceneDom = doc;

        return doc;
    }

    async loadStylesheet()
    {
        if (this.stylePath == undefined) return "";

        const globalPath = this.getMeta().resolve.bind(this)(this.stylePath);

        let res = await fetch(globalPath);
        res = await res.text();
        
        return res.replaceAll("\n", '').replaceAll("\r", '');
    }

}