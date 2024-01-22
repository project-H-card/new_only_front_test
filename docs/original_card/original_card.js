const cardContentsDiv = document.querySelector(".cardContents");
const rankSelect = document.querySelector("#rankSelect");
const markSelect = document.querySelector("#markSelect");
const powerSelect = document.querySelector("#powerSelect");
const typeSelect = document.querySelector("#typeSelect");
const nameSelect = document.querySelector("#nameSelect");
const columnSelect = document.querySelector("#columnSelect");
const skill1Select = document.querySelector("#skill1Select");
const mark1Select = document.querySelector("#mark1Select");
const effect1Select = document.querySelector("#effect1Select");
const skill2Select = document.querySelector("#skill2Select");
const mark2Select = document.querySelector("#mark2Select");
const effect2Select = document.querySelector("#effect2Select");


rankSelect.addEventListener("change", () => {
    const rank = rankSelect.value;
    if(document.querySelector(".rankIMG")) {
        document.querySelector(".rankIMG").src = `./assets/images/default/rank${rank}.png`;
    } else {
        cardContentsDiv.innerHTML += `<img src="./assets/images/default/rank${rank}.png" alt="" class="rankIMG">`;
    }
});


markSelect.addEventListener("change", () => {
    const mark = markSelect.value;
    let markHTML = `<img src="./assets/images/default/sword.png" alt="">`;

    if(mark == "sword") {
        markHTML = `<img src="./assets/images/default/sword.png" alt="">`;
    } else if(mark == "shield") {
        markHTML = `<img src="./assets/images/default/shield.png" alt="">`;
    } else {
        markHTML = `<img src="./assets/images/default/sword.png" alt="">
        <img src="./assets/images/default/shield.png" alt="">`;
    }

    if(document.querySelector(".powerMarkDiv")) {
        document.querySelector(".powerMarkDiv").innerHTML = markHTML;
    } else {
        cardContentsDiv.innerHTML += `<div class="powerMarkDiv">${markHTML}</div>`;
    }
});


powerSelect.addEventListener("change", () => {
    const power = powerSelect.value;

    if(document.querySelector(".power")) {
        document.querySelector(".power").innerHTML = power;
    } else {
        cardContentsDiv.innerHTML += `<p class="power">${power}</p>`;
    }
});


typeSelect.addEventListener("change", () => {
    const type = typeSelect.value;

    if(document.querySelector(".type")) {
        document.querySelector(".type").innerHTML = type;
    } else {
        cardContentsDiv.innerHTML += `<p class="type">${type}</p>`;
    }
});


nameSelect.addEventListener("change", () => {
    const name = nameSelect.value;

    if(document.querySelector(".name")) {
        document.querySelector(".name").innerHTML = name;
    } else {
        cardContentsDiv.innerHTML += `<p class="name">${name}</p>`;
    }
});


columnSelect.addEventListener("change", () => {
    const column = columnSelect.value;

    if(document.querySelector(".column")) {
        document.querySelector(".column").innerHTML = column;
    } else {
        cardContentsDiv.innerHTML += `<p class="column">${column}</p>`;
    }
});


skill1Select.addEventListener("change", () => {
    const skill1 = skill1Select.value;

    if(document.querySelector(".skill1")) {
        document.querySelector(".skill1").innerHTML = skill1;
    } else {
        cardContentsDiv.innerHTML += `<div class="skill1 skill">${skill1}</div>`;
    }
});


mark1Select.addEventListener("change", () => {
    const mark1 = mark1Select.value;
    document.querySelector(".skill1").classList.remove("sho", "one");
    if(mark1 == "sho" || mark1 == "one") {
        document.querySelector(".skill1").classList.add(mark1);
    }
    if(!document.querySelector(".skill1 .before")) {
        document.querySelector(".skill1").innerHTML += `<div class="before"></div>`;
    }
});


effect1Select.addEventListener("change", () => {
    const effect1 = effect1Select.value;

    if(document.querySelector(".effect1")) {
        document.querySelector(".effect1").innerHTML = effect1;
    } else {
        cardContentsDiv.innerHTML += `<p class="effect1 effect">${effect1}</p>`;
    }
});


skill2Select.addEventListener("change", () => {
    const skill2 = skill2Select.value;

    if(document.querySelector(".skill2")) {
        document.querySelector(".skill2").innerHTML = skill2;
    } else {
        cardContentsDiv.innerHTML += `<div class="skill2 skill">${skill2}</div>`;
    }
});


mark2Select.addEventListener("change", () => {
    const mark2 = mark2Select.value;
    document.querySelector(".skill2").classList.remove("sho", "one");
    if(mark2 == "sho" || mark2 == "one") {
        document.querySelector(".skill2").classList.add(mark2);
    }
    if(!document.querySelector(".skill2 .before")) {
        document.querySelector(".skill2").innerHTML += `<div class="before"></div>`;
    }
});


effect2Select.addEventListener("change", () => {
    const effect2 = effect2Select.value;

    if(document.querySelector(".effect2")) {
        document.querySelector(".effect2").innerHTML = effect2;
    } else {
        cardContentsDiv.innerHTML += `<p class="effect2 effect">${effect2}</p>`;
    }
});


async function trySaveIMG(elem, path) {
    try {
        const dl = document.createElement("a");
        dl.href = await domtoimage.toPng(elem, {
            width: elem.clientWidth,
            height: elem.clientHeight
        });
        dl.download = path;
        dl.click();
    } catch(e) {
        console.log(`${path}のダウンロードに失敗。`);
    }
}


document.querySelector("#downloadBtn").addEventListener("click", async (e) => {
    const cardElement = document.querySelector(".cardContents");
    trySaveIMG(cardElement, "ハイスト_オリジナルカード.png");
})



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