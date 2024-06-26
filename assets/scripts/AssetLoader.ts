
import Global from "./Global";

export const loadImgAtlas = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    cc.loader.loadRes(
      "images/Sprites",
      cc.SpriteAtlas,
      function (err, imgAtlas) {
        if (err) {
          console.log("Error loading card atlas", err);
          reject();
          return;
        }
        console.log("Loaded card atlas successfully!");
        Global.instance.imageAtlas = imgAtlas;
        resolve();
      }
    );
  });
};