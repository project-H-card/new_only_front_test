const cardContentsDiv = document.querySelector(".cardContents");
const rankSelect = document.querySelector("#rankSelect");

rankSelect.addEventListener("change", () => {
    let rank = rankSelect.value;
    if(document.querySelector(".rankIMG")) {
        document.querySelector(".rankIMG").src = `./assets/images/default/rank${rank}.png`;
    } else {
        cardContentsDiv.innerHTML += `<img src="./assets/images/default/rank${rank}.png" alt="" class="rankIMG">`;
    }
});




// let cardContents = `
// <div class="cardContents">
//             <img src="images/default/rank${row[RANK] || "0"}.png" alt="" class="rankIMG">
//             <div class="powerMarkDiv">${powerMark}</div>
//             <p class="name vertical ${row[NAME].includes("<ruby>") ? "": "noRuby"} ${countNoRubyLength(row[NAME]) >= longNameLength ? "longName" : ""}">${row[NAME]}</p>
//             <p class="power">${row[POWER]}</p>
//             <div class="skillBox ${has2Skill ? "has2Skill" : ""}">
//                 <div class="skillEffect1">
//                     <div class="skill1 skill ${mark1Class} ${isLongSkill(row[SKILL1]) ? "longSkill" : ""}"
//                         style="${row[BG_COLOR] ? "background-color:" + row[BG_COLOR] + ";" : ""}"
//                     >${row[SKILL1]}
//                         <div class="before"></div>
//                     </div>
//                     <p class="effect1 effect ${longEffectOrBlank}">${row[EFFECT1].replace(/\n/g, "<br>")}</p>
//                 </div>
//                 ${skill2Div}
//             </div>
//             <p class="type ${isLongType(row[TYPE]) ? "longType" : ""}">${row[TYPE]}</p>
//             <p class="column stroke vertical">${row[COLUMN].replace(/\n/g, "<br>").replace(/\.\.\./g, `<span lang="ja" class="santen">…</span>`)}</p>
//             <div class="cardFooter">
//                 ${row[PACK_NUM] ? `<p class="packNum">`+row[PACK_NUM]+`</p>` : ``}
//                 ${row[CARD_NUM] ? `<p class="cardNum">`+row[CARD_NUM]+row[ALL_CARD_NUM]+`</p>`: ``}
//                 ${row[RARE] ? `<img src="images/default/rarity/`+row[RARE]+`.svg" alt="" class="rarity">`: ""}
//             </div>
//         </div>`;