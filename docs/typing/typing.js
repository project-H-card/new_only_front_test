class Game {
    constructor(canvasId, bgPath) {
        this.bg = new Image();
        this.bg.src = bgPath;
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
            { en: "sakanouyeno tamuramaro", kana: "さかのうえのたむらまろ", kanji: "坂上田村麻呂" },
            { en: "natsumesoseki", kana: "なつめそうせき", kanji: "夏目漱石" },
            { en: "kobodaishi", kana: "こうぼうだいし", kanji: "弘法大師" },
            { en: "hiragagennai", kana: "ひらがげんない", kanji: "平賀源内" }
        ];
        
        this.completedLetter = "";

        this.canvas.width = 800;
        this.canvas.height = 530;
        this.ctx.font = '30px Arial';
    }

    pickRandomWord() {
        const index = Math.floor(Math.random() * this.words.length);
        const word = this.words[index];
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
        this.pickRandomWord();
        this.updateGame();
    }

    handleKeydown(event) {
        if (event.key === this.currentWord[this.wordIndex]) {
            this.completedLetter += this.currentWord[this.wordIndex];
            this.wordIndex++;
            if (this.currentWord.length === this.wordIndex) {
                this.pickRandomWord();
            }
        }
    }
}

const game = new Game('gameCanvas', "https://highsto.net/assets/images/story/overWorld_blue.webp");
game.start();

document.addEventListener('keydown', event => game.handleKeydown(event));

