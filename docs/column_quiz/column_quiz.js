// クイズデータの配列
let defaultQuizData = [
    { name: "織田信長", column: "攻撃を一点に集約せよ、無駄な事はするな。" },
    { name: "真田信繁", column: "真田日本一の兵。古よりの物語にもこれなき由。" },
    { name: "豊臣秀吉", column: "負けると思えば負ける、勝つと思えば勝つ。逆になろうと、人には勝つと言い聞かすべし。" },
    { name: "足利義満", column: "たのむかな 我がみなもとの 岩清水<br>流れの末を 神をまかせて" },
    { name: "徳川家康", column: "人間はの、最も多くの人間を喜ばせたものが 最も大きく栄えるものじゃ。" },
    { name: "足利尊氏", column: "文武両道は車輪のごとし、一輪欠ければ人を渡さず。" },
    { name: "上杉謙信", column: "人の落ち目を見て攻め取るは、本意ならぬことなり。" },
    { name: "後醍醐天皇", column: "我が骨は吉野山の苔に埋まることになっても、我が魂は常に京の空を仰ぎ見続けるだろう。" },
    { name: "武田信玄", column: "人は城 人は石垣 人は堀<br>情けは味方 仇は敵なり" },
    { name: "細川勝元", column: "短慮功を成さず。" },
    { name: "フランシスコ＝ザビエル", column: "熟した実は多くとも、それをもぎ取る人間が少なすぎる。" },
    { name: "北条氏康", column: "小事をおろそかにするべからず。" },
    { name: "今川義元", column: "昨日なし 明日またしらぬ 人はただ<br>今日のうちこそ 命なりけれ" },
    { name: "山名宗全", column: "およそ例という文字をば、尚後は時という文字にかへて御心あるべし。" },
    { name: "足利義政", column: "花より外に色もなし。" },
    { name: "明智光秀", column: "敵は本能寺にあり…！！！" },
    { name: "雪舟", column: "涙で鼠を描く。" },
];


class Quiz {
    constructor(quizData) {
        this.quizData = quizData;
        this.currentQuiz = 0;
        this.correctAnswers = 0;
        this.choiceNum = 6;
        this.questionCount = 5; // デフォルトの問題数
        this.questions = [];
        this.waiting = false;

        // UI要素をプロパティとして取得
        this.startScreen = document.getElementById('startScreen');
        this.quizContainer = document.getElementById('quizContainer');
        this.resultScreen = document.getElementById('resultScreen');

        this.currentQuizElement = document.getElementById('currentQuiz');
        this.questionElement = document.getElementById('question');
        this.choicesElement = document.getElementById('choices');
        this.resultElement = document.getElementById('result');
        this.eachQResultElement = document.getElementById('eachQResult');
        this.questionCountSelect = document.getElementById('questionCountSelect');

        this.correctCircleElement = document.getElementById('correctCircle');
        this.wrongXElement = document.getElementById('wrongX'); 

        this.greatJobElement = document.getElementById('greatJob');
        this.goodJobElement = document.getElementById('goodJob');
        this.keepPracticingElement = document.getElementById('keepPracticing');

        this.twitterShareButton = document.getElementById('twitterShare');
        this.lineShareButton = document.getElementById('lineShare');

        this.music = {
            thinking: new Audio('assets/audio/thinking.mp3'),
            correct: new Audio('assets/audio/correct.mp3'),
            wrong: new Audio('assets/audio/wrong.mp3'),
            question: new Audio('assets/audio/question.mp3'),
            success: new Audio('assets/audio/success.mp3'),
            tettere: new Audio('assets/audio/tettere.mp3'),
            failed: new Audio('assets/audio/failed.mp3'),
        }
        this.init();
    }

    async init() {
        const quizCSV = await (await fetch("./quiz_data.csv")).text();
        // console.log(quizCSV);
        this.quizData = Papa.parse(quizCSV, { skipEmptyLines: true })
            .data.slice(1).map(row => {
                return { name: row[0], column: row[1].split("\n").join("<br>")}
            });

        document.getElementById('startButton').addEventListener('click', () => this.startQuiz("unmute"));
        document.getElementById('muteStartButton').addEventListener('click', () => this.startQuiz("mute"));
        document.getElementById('restartButton').addEventListener('click', () => this.restartQuiz());
        document.getElementById('backToTitleButton').addEventListener('click', () => this.backToTitle());

        Object.values(this.music).forEach(music => {
            music.volume = 0.1;
        });
    }

    mute() {
        Object.values(this.music).forEach(music => {
            music.muted = true;
        });
    }

    unmute() {
        Object.values(this.music).forEach(music => {
            music.muted = false;
        });
    }

    startQuiz(mute) {
        if(mute == "mute") {
            this.mute();
        } else if(mute=="unmute") {
            this.unmute();
        }

        this.currentQuiz = 0;
        this.correctAnswers = 0;
        this.questionCount = parseInt(this.questionCountSelect.value, 10); // 選択された問題数を取得
        this.generateQuestions();
        this.changeScreen('quiz');
        this.nextQuestion();
    }

    generateQuestions() {
        this.questions = [];
        for (let i = 0; i < this.questionCount; i++) {
            let question;
            do {
                question = this.quizData[Math.floor(Math.random() * this.quizData.length)];
            } while (this.questions.includes(question));
            this.questions.push(question);
        }
    }

    nextQuestion() {
        this.correctCircleElement.style.display = 'none';
        this.wrongXElement.style.display = 'none';
        if (this.currentQuiz < this.questionCount) {
            this.music.question.currentTime = 0;
            this.music.question.play();
            this.currentQuizElement.textContent = `Q. ${this.currentQuiz+1} / ${this.questionCount}`;
            this.generateChoices();
            this.waiting = false;
        } else {
            this.showResults();
        }
    }

    generateChoices() {
        this.eachQResultElement.textContent = '';
        this.choicesElement.innerHTML = '';
        const question = this.questions[this.currentQuiz];
        this.questionElement.innerHTML = question.column;

        let choices = [question.name];
        for (let i = 0; i < this.choiceNum - 1; i++) {
            let choice;
            do {
                choice = this.quizData[Math.floor(Math.random() * this.quizData.length)].name;
            } while (choices.includes(choice));
            choices.push(choice);
        }
        choices.sort(() => Math.random() - 0.5);

        choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.classList.add('choice', "button", "orangeButton");
            button.onclick = () => this.checkAnswer(choice);
            this.choicesElement.appendChild(button);
        });
    }

    checkAnswer(choice) {
        if(this.waiting) return;
        const correctAnswer = this.questions[this.currentQuiz].name;
        if (choice === correctAnswer) {
            this.music.correct.currentTime = 0;
            this.music.correct.play();
            this.correctCircleElement.style.display = 'block';
            this.eachQResultElement.textContent = `「${correctAnswer}」正解！`;
            this.correctAnswers++;
        } else {
            this.music.wrong.currentTime = 0;
            this.music.wrong.play();
            this.wrongXElement.style.display = 'block';
            this.eachQResultElement.textContent = `正解は「${correctAnswer}」でした。`;
        }
        this.currentQuiz++;
        this.waiting = true;
        setTimeout(() => this.nextQuestion(), 1000);
    }

    showResults() {
        this.resultElement.textContent = `${this.questionCount} 問中 ${this.correctAnswers} 問正解！`;
        const correctRate = this.correctAnswers / this.questionCount;

        // シェアボタンのリンクを作成
        const shareText = `「ハイストコラムクイズ」にチャレンジ！私は${this.questionCount}問中${this.correctAnswers}問正解しました！`;
        const twitterShareUrl = encodeURIComponent(window.location.href+"?from=twitterShareButton");
        const lineShareUrl = encodeURIComponent(window.location.href+"?from=lineShareButton");
        const twitterUrl = `https://twitter.com/share?text=${shareText}&url=${twitterShareUrl}&hashtags=クイズ,ハイスト,歴史&related=projecthcard`;
        const lineUrl = `https://line.me/R/msg/text/?${shareText}${encodeURIComponent("\n"+lineShareUrl)}`;

        this.twitterShareButton.href = twitterUrl;
        this.lineShareButton.href = lineUrl;

        // 正解率を元に画像を変更し、効果音を鳴らす。
        this.greatJobElement.style.display = 'none';
        this.goodJobElement.style.display = 'none';
        this.keepPracticingElement.style.display = 'none';
        if(correctRate >= 0.99) {
            this.greatJobElement.style.display = 'block';
            this.music.success.currentTime = 0;
            this.music.success.play();
        } else if(correctRate >= 0.8) {
            this.goodJobElement.style.display = 'block';
            this.music.tettere.currentTime = 0;
            this.music.tettere.play();
        } else {
            this.keepPracticingElement.style.display = 'block';
            this.music.failed.currentTime = 0;
            this.music.failed.play();
        }

        this.changeScreen('result');
    }

    restartQuiz() {
        this.startQuiz();
    }

    backToTitle() {
        this.changeScreen('start');
    }

    changeScreen(screen) {
        this.startScreen.style.display = 'none';
        this.quizContainer.style.display = 'none';
        this.resultScreen.style.display = 'none';

        switch(screen) {
            case 'start':
                this.startScreen.style.display = 'block';
                break;
            case 'quiz':
                this.quizContainer.style.display = 'block';
                this.music.thinking.currentTime = 0;
                this.music.thinking.loop = true;
                this.music.thinking.play();
                break;
            case 'result':
                this.music.thinking.pause();
                this.resultScreen.style.display = 'block';
                break;
        }
    }
}


const quiz = new Quiz(defaultQuizData);


