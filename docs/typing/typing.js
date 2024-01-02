class Utils {
    static loadImage(path) {
        return new Promise(resolve => {
            const image = new Image();
            image.addEventListener('load', () => {
                resolve(image);
            });
            image.src = path;
        });
    }
    static loadMusic(path) {
        return new Promise(resolve => {
            const music = new Audio();
            music.addEventListener('canplaythrough', () => {
                resolve(music);
            });
            music.src = path;
        });
    }

    static async loadWords(path) {  
        // json を fetch して words の配列を返す。
        const response = await fetch(path);
        const json = await response.json();
        return json.words;
    }

    static getShuffledArray(array) {
        const arrayCopy = array.slice();
        for (let i = array.length - 1; i > 0; i--) {
            const rand = Math.floor(Math.random() * (i + 1));
            [arrayCopy[i], arrayCopy[rand]] = [arrayCopy[rand], arrayCopy[i]];
        }
        return arrayCopy;
    }
}



const MODE = {
    LOADING: "loading",
    SELECTING: "selecting",
    PRACTICE: "practice",
    TIME_ATTACK: "timeAttack",
    TIME_LIMIT: "timeLimit" 
}

const MODE_JA = {
    PRACTICE: "練習モード",
    TIME_ATTACK: "タイムアタックモード",
    TIME_LIMIT: "時間制限モード"
}

const GAME_STATUS = {
    NOT_STARTED: "notStarted",
    PLAYING: "playing",
    FINISHED: "finished"
}


class Game {
    constructor(
        canvasId, width, height, fontSize, fontFamily, words,
        bg, cursorElectronic, beep, pikon, success, cancel, bgmNotPlaying, bgmPlaying,
        muteControlBtn
    ) {
        this.bg = bg;
        this.cursorElectronic = cursorElectronic;
        this.beep = beep;
        this.pikon = pikon;
        this.success = success;
        this.cancel = cancel;

        this.bgmNotPlaying = bgmNotPlaying;
        this.bgmNotPlaying.loop = true;
        this.bgmNotPlaying.volume = 0.03;

        this.bgmPlaying = bgmPlaying;
        this.bgmPlaying.loop = true;
        this.bgmPlaying.volume = 0.05;

        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.currentWord = '';
        this.currentKana = '';
        this.currentKanji = '';
        this.wordIndex = 0;
        this.words = words;
        this.currentWords = [];
        
        this.completedLetter = "";

        this.height = height;
        this.width = width;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;

        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.font = `${fontSize}px ${fontFamily}`;
        this.ctx.strokeStyle = 'white';

        this.modeSelectCursorIndex = 0;
        this.mode = MODE.SELECTING;
        this.gameStatus = GAME_STATUS.NOT_STARTED;
        this.modes = [MODE.PRACTICE, MODE.TIME_ATTACK, MODE.TIME_LIMIT];
        this.modeJAs = [MODE_JA.PRACTICE, MODE_JA.TIME_ATTACK, MODE_JA.TIME_LIMIT];

        this.score = 0;
        this.time = 0;
        this.miss = 0;
        this.timeLimitSecond = 30; // 5
        this.targetScore = 1000; // 100
        this.startTime = new Date().getTime();

        this.muteControlBtn = muteControlBtn;
        this.isMute = false;
        this.toggleMute(true);
        this.muteControlBtn.addEventListener('click', () => this.toggleMute());
        this.musicAllowed = false;
    }

    pickNextWord() {
        if(this.currentWords.length === 0) this.currentWords = Utils.getShuffledArray(this.words);

        const word = this.currentWords.pop();
        this.currentWord = word.en;
        this.currentKana = word.kana;
        this.currentKanji = word.kanji;
        this.completedLetter = "";
        this.wordIndex = 0;
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    update() {
        if (this.mode === MODE.SELECTING) return;
        if (this.gameStatus === GAME_STATUS.FINISHED) return;

        if (this.gameStatus === GAME_STATUS.PLAYING) {
            this.time = new Date().getTime() - this.startTime;
        }

        if(this.mode === MODE.TIME_ATTACK && this.score >= this.targetScore) {
            this.finish();
        }

        if(this.mode === MODE.TIME_LIMIT && this.time >= this.timeLimitSecond*1000) {
            this.finish();
        }
    }

    draw() {
        if (this.mode === MODE.SELECTING) {
            this.drawSelectScene();
        } else if(this.gameStatus === GAME_STATUS.FINISHED) {
            this.drawFinishScene();
        } else {
            this.drawGameScene();
        }
    }

    drawTextWithStroke(text, x, y) {
        // this.ctx.strokeText(text, x, y);
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = 'rgba(255, 255, 255, 1)';
        this.ctx.fillText(text, x, y);
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 0;
    }

    /**
     * 単語の後ろを灰色で表示
     */
    drawBackGrayArea() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.roundRect(this.width/10, this.height/4, this.width*4/5, this.height/2, this.fontSize*0.5);
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawEscapeToFinish() {
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'left';
        this.drawTextWithStroke("Escape で終了", 50, 50);
    }

    drawMode() {
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.drawTextWithStroke(this.modeJAs[this.modes.indexOf(this.mode)], this.width/2, this.fontSize*2);
    }

    drawBG() { 
        this.ctx.drawImage(this.bg, 0, 0, this.canvas.width, this.canvas.height);
    }

    drawSelectScene() {
        this.drawBG();
        this.ctx.fillStyle = 'black';

        this.ctx.textAlign = 'center';
        this.drawTextWithStroke("モード選択", this.width/2, this.fontSize*2);
        this.drawTextWithStroke("Enter でスタート", this.width/2, this.height - this.fontSize);

        this.ctx.textAlign = 'left';
        const fontSize08 = this.fontSize*0.8;
        this.ctx.font = `${fontSize08}px ${this.fontFamily}`;
        this.drawTextWithStroke(">", this.width/4 - fontSize08, this.height/2 - fontSize08*0.5 + fontSize08*this.modeSelectCursorIndex);
        this.drawTextWithStroke(this.modeJAs[0], this.width/4, this.height/2 - fontSize08*0.5);
        this.drawTextWithStroke(this.modeJAs[1], this.width/4, this.height/2 + fontSize08*0.5);
        this.drawTextWithStroke(this.modeJAs[2], this.width/4, this.height/2 + fontSize08*1.5);
        this.drawTextWithStroke("（▲▼で選択）", this.width/4, this.height/2 + fontSize08*2.8);

        this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    }

    drawGameScene() {
        this.drawBG();
        this.drawBackGrayArea();
    
        // 現在の単語の表示
        const fontSizeWord = this.fontSize*0.8;
        this.ctx.font = `${fontSizeWord}px ${this.fontFamily}`;
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(this.currentWord, this.width/2, this.height/2 - fontSizeWord*0.5);
        this.ctx.fillText(this.currentKana, this.width/2, this.height/2 + fontSizeWord*0.5);
        this.ctx.fillText(this.currentKanji, this.width/2, this.height/2 + fontSizeWord*1.5);

        // 完了した文字の表示
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = '#555';
        const { width } = this.ctx.measureText(this.currentWord);
        this.ctx.fillText(this.completedLetter, (this.width - width)/2, this.height/2 - fontSizeWord*0.5);

        // スコアの表示
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = 'black';
        const fontSizeScore = this.fontSize*0.6;
        this.ctx.font = `${fontSizeScore}px ${this.fontFamily}`;
        this.drawTextWithStroke(
            `スコア: ${this.score}${this.mode === MODE.TIME_ATTACK ? "/"+this.targetScore : ""}`,
            this.width - 10, fontSizeScore
        );
        this.drawTextWithStroke(
            `時間: ${Math.floor(this.time/1000)}${this.mode === MODE.TIME_LIMIT ? "/"+this.timeLimitSecond : ""}秒`,
            this.width - 10, fontSizeScore*2
        );
        this.drawTextWithStroke(`ミス数: ${this.miss}回`, this.width - 10, fontSizeScore*3);

        this.drawEscapeToFinish();
        this.drawMode();
    }

    drawFinishScene() {
        this.drawBG();
        this.drawBackGrayArea();

        const fontSizeScore = this.fontSize*0.6;
        this.ctx.font = `${fontSizeScore}px ${this.fontFamily}`;
        this.drawEscapeToFinish();
        this.drawMode();

        // 結果の表示
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        const fontSizeResult = this.fontSize*0.8;
        this.ctx.font = `${fontSizeResult}px ${this.fontFamily}`;
        this.ctx.fillText("結果", this.width/2, this.height/2 - fontSizeResult*1.5);

        this.ctx.font = `${fontSizeScore}px ${this.fontFamily}`;
        if(this.mode === MODE.TIME_ATTACK) {
            this.ctx.fillText(`目標スコア: ${this.targetScore}`, this.width/2, this.height/2 - fontSizeScore/2);
            this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
            this.ctx.fillText(`所要時間: ${Math.floor(this.time/1000)}秒`, this.width/2, this.height/2 + fontSizeScore*1.5);
        } else if(this.mode === MODE.TIME_LIMIT) {
            this.ctx.fillText(`制限時間: ${Math.floor(this.time/1000)}秒`, this.width/2, this.height/2 - fontSizeScore/2);
            this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
            this.ctx.fillText(`スコア: ${this.score}`, this.width/2, this.height/2 + fontSizeScore*1.5);
        }

        this.ctx.font = `${fontSizeScore}px ${this.fontFamily}`;
        this.ctx.fillText(`ミス数: ${this.miss}回`, this.width/2, this.height/2 + fontSizeScore*3);

    }

    init() {
        this.loop();
    }

    start() {
        this.bgmNotPlaying.pause();

        this.currentWords = Utils.getShuffledArray(this.words);
        this.score = 0;
        this.time = 0;
        this.miss = 0;
        this.startTime = new Date().getTime();
        this.pickNextWord();
        this.gameStatus = GAME_STATUS.PLAYING;

        this.bgmPlaying.currentTime = 0;
        this.bgmPlaying.play();
    }

    finish() {
        this.bgmPlaying.pause();

        this.success.currentTime = 0;
        this.success.play();
        this.gameStatus = GAME_STATUS.FINISHED;

        this.loop();
        this.bgmNotPlaying.currentTime = 0;
        this.bgmNotPlaying.play();
    }

    handleKeydown(event) {
        // 上下キーでモードを選択し、Enterでスタート
        if (this.mode === MODE.SELECTING) {
            if (event.key === "ArrowUp") {
                this.modeSelectCursorIndex = (this.modeSelectCursorIndex - 1 + 3) % 3;
                this.cursorElectronic.currentTime = 0;
                this.cursorElectronic.play();
            } else if (event.key === "ArrowDown") {
                this.modeSelectCursorIndex = (this.modeSelectCursorIndex + 1) % 3;
                this.cursorElectronic.currentTime = 0;
                this.cursorElectronic.play();
            } else if (event.key === "Enter") {
                this.mode = this.modes[this.modeSelectCursorIndex];
                this.pikon.currentTime = 0;
                this.pikon.play();
                this.start();

                event.stopPropagation();
                event.preventDefault();
            }
            return;
        }

        // escape でモード選択に戻る
        if (event.key === "Escape") {
            this.bgmPlaying.pause();

            this.cancel.currentTime = 0;
            this.cancel.play();

            this.mode = MODE.SELECTING;
            this.gameStatus = GAME_STATUS.NOT_STARTED;

            this.bgmNotPlaying.currentTime = 0;
            this.bgmNotPlaying.play();
            return;
        }

        // ゲーム中でなければ何もしない
        if (this.gameStatus !== GAME_STATUS.PLAYING) return;

        // もしキーが押されたのがアルファベットでなければ何もしない
        if (!event.key.match(/^[A-Za-z]$/)) return;

        if (event.key === this.currentWord[this.wordIndex]) {
            this.completedLetter += this.currentWord[this.wordIndex];
            this.wordIndex++;
            if (this.currentWord.length === this.wordIndex) {
                // 単語をクリアしたらスコアを足して次の単語を選択
                this.score += this.currentWord.length*10;
                this.pickNextWord();
                this.pikon.currentTime = 0;
                this.pikon.play();
            } else {
                // 入力した文字が単語の途中ならカーソル音を鳴らす
                this.cursorElectronic.currentTime = 0;
                this.cursorElectronic.play();
            }
        } else {
            // 間違えたらミス数を足してビープ音を鳴らす
            this.miss++;
            this.score -= 10;
            this.score = Math.max(this.score, 0);
            this.beep.currentTime = 0;
            this.beep.play();
        }
    }

    toggleMute(bySystem = false) {
        console.log("toggleMute");
        this.isMute = !this.isMute;
        this.bgmNotPlaying.muted = this.isMute;
        this.bgmPlaying.muted = this.isMute;
        this.cursorElectronic.muted = this.isMute;
        this.beep.muted = this.isMute;
        this.pikon.muted = this.isMute;
        this.success.muted = this.isMute;
        this.cancel.muted = this.isMute;

        if(this.isMute) {
            this.muteControlBtn.value = "ミュート解除";
        } else {
            this.muteControlBtn.value = "ミュート";
        }

        if(!this.musicAllowed && !bySystem && this.gameStatus === GAME_STATUS.NOT_STARTED) {
            this.bgmNotPlaying.currentTime = 0;
            this.bgmNotPlaying.play();
        }

        if(!bySystem) this.musicAllowed = true;
    }
}


const main = async () => {
    const bg = await Utils.loadImage("assets/images/overWorld_blue.webp");
    const cursorElectronic = await Utils.loadMusic("assets/sounds/cursorElectronic.mp3");
    const beep = await Utils.loadMusic("assets/sounds/beep.mp3");
    const pikon = await Utils.loadMusic("assets/sounds/pikon.mp3");
    const success = await Utils.loadMusic("assets/sounds/success.mp3");
    const cancel = await Utils.loadMusic("assets/sounds/cancel.mp3");
    const bgmNotPlaying = await Utils.loadMusic("assets/bgm/Cefiro.mp3");
    const bgmPlaying = await Utils.loadMusic("assets/bgm/EMERGENCY.mp3");

    const words = await Utils.loadWords("data/data.json");

    const width = 800;
    const height = 530;
    const fontSize = 60;

    const muteControlBtn = document.getElementById("muteControlBtn");

    const game = new Game(
        'gameCanvas', width, height, fontSize, "Noto Sans JP", words,
        bg, cursorElectronic, beep, pikon, success, cancel, bgmNotPlaying, bgmPlaying,
        muteControlBtn
    );
    game.init();

    document.addEventListener('keydown', event => game.handleKeydown(event));
};

main();





// words = [
//     { en: "odanobunaga", kana: "おだのぶなが", kanji: "織田信長" },
//     { en: "tokugawaieyasu", kana: "とくがわいえやす", kanji: "徳川家康" },
//     { en: "toyotomihideyoshi", kana: "とよとみひでよし", kanji: "豊臣秀吉" },
//     { en: "minamotonoyoritomo", kana: "みなもとのよりとも", kanji: "源頼朝" },
//     { en: "takedashingen", kana: "たけだしんげん", kanji: "武田信玄" },
//     { en: "uesugikenshin", kana: "うえすぎけんしん", kanji: "上杉謙信" },
//     { en: "sakanouenotamuramaro", kana: "さかのうえのたむらまろ", kanji: "坂上田村麻呂" },
//     { en: "natsumesouseki", kana: "なつめそうせき", kanji: "夏目漱石" },
//     { en: "kouboudaishi", kana: "こうぼうだいし", kanji: "弘法大師" },
//     { en: "hiragagennnai", kana: "ひらがげんない", kanji: "平賀源内" }
// ];