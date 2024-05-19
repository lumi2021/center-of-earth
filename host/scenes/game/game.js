import { Scene } from "../../system/scene.js";

export class GameScene extends Scene {

    domPath = "./game.html";
    stylePath = "./game.css";


    onLoad()
    {
        
    }


    getMeta() { return import.meta; }
}