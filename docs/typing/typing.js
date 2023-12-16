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

    static getShuffledArray(array) {
        const arrayCopy = array.slice();
        for (let i = array.length - 1; i > 0; i--) {
            const rand = Math.floor(Math.random() * (i + 1));
            [arrayCopy[i], arrayCopy[rand]] = [arrayCopy[rand], arrayCopy[i]];
        }
        return arrayCopy;
    }
}



class Game {
    constructor(canvasId, bg, cursorElectronic, beep, pikon) {
        this.bg = bg;
        this.cursorElectronic = cursorElectronic;
        this.beep = beep;
        this.pikon = pikon;

        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.currentWord = '';
        this.currentKana = '';
        this.currentKanji = '';
        this.wordIndex = 0;
        this.words = [
            { en: "odanobunaga", kana: "おだのぶなが", kanji: "織田信長" },
            { en: "tokugawaieyasu", kana: "とくがわいえやす", kanji: "徳川家康" },
            { en: "toyotomihideyoshi", kana: "とよとみひでよし", kanji: "豊臣秀吉" },
            { en: "minamotonoyoritomo", kana: "みなもとのよりとも", kanji: "源頼朝" },
            { en: "takedashingen", kana: "たけだしんげん", kanji: "武田信玄" },
            { en: "uesugikenshin", kana: "うえすぎけんしん", kanji: "上杉謙信" },
            { en: "sakanouenotamuramaro", kana: "さかのうえのたむらまろ", kanji: "坂上田村麻呂" },
            { en: "natsumesoseki", kana: "なつめそうせき", kanji: "夏目漱石" },
            { en: "kobodaishi", kana: "こうぼうだいし", kanji: "弘法大師" },
            { en: "hiragagennai", kana: "ひらがげんない", kanji: "平賀源内" }
        ];
        this.currentWords = [];
        
        this.completedLetter = "";

        this.canvas.width = 800;
        this.canvas.height = 530;
        this.ctx.font = '30px Arial';
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

    draw() {
        // 背景の表示
        this.ctx.drawImage(this.bg, 0, 0, this.canvas.width, this.canvas.height);

        // 現在の単語の表示
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(this.currentWord, 50, 100);
        this.ctx.fillText(this.currentKana, 50, 150);
        this.ctx.fillText(this.currentKanji, 50, 200);

        // 完了した文字の表示
        this.ctx.fillStyle = '#555';
        this.ctx.fillText(this.completedLetter, 50, 100);
    }

    updateGame() {
        requestAnimationFrame(() => this.updateGame());
        this.draw();
    }

    start() {
        this.currentWords = Utils.getShuffledArray(this.words);
        this.pickNextWord();
        this.updateGame();
    }

    handleKeydown(event) {
        if (event.key === this.currentWord[this.wordIndex]) {
            this.completedLetter += this.currentWord[this.wordIndex];
            this.wordIndex++;
            if (this.currentWord.length === this.wordIndex) {
                this.pickNextWord();
                this.pikon.currentTime = 0;
                this.pikon.play();
            } else {
                this.cursorElectronic.currentTime = 0;
                this.cursorElectronic.play();
            }
        } else {
            this.beep.currentTime = 0;
            this.beep.play();
        }
    }
}


const main = async () => {
    const bg = await Utils.loadImage("assets/images/overWorld_blue.webp");
    const cursorElectronic = await Utils.loadMusic("assets/sounds/cursorElectronic.mp3");
    const beep = await Utils.loadMusic("assets/sounds/beep.mp3");
    const pikon = await Utils.loadMusic("assets/sounds/pikon.mp3");
    const game = new Game('gameCanvas', bg, cursorElectronic, beep, pikon);
    game.start();

    document.addEventListener('keydown', event => game.handleKeydown(event));
};

main();