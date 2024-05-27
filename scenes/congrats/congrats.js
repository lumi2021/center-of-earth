import { Scene } from "../../system/scene.js";

export class Congratulations extends Scene {

    domPath = "./congrats.html";
    stylePath = "./congrats.css";


    onLoad()
    {
        
    }

    getMeta() { return import.meta; }
}