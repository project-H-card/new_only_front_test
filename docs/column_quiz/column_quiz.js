// クイズデータの配列
const quizData = [
    { name: "織田信長", column: "攻撃を一点に集約せよ、無駄な事はするな。" },
    { name: "真田信繁", column: "真田日本一の兵。古よりの物語にもこれなき由。" },
    { name: "豊臣秀吉", column: "負けると思えば負ける、勝つと思えば勝つ。逆になろうと、人には勝つと言い聞かすべし。" },
    { name: "足利義満", column: "たのむかな 我がみなもとの 岩清水 流れの末を 神をまかせて" },
    { name: "徳川家康", column: "人間はの、最も多くの人間を喜ばせたものが 最も大きく栄えるものじゃ。" },
];
let currentQuiz = 0;
let correctAnswers = 0;
const choiceNum = 4;

function generateChoices() {
    if (currentQuiz < quizData.length) {
        document.getElementById('result').textContent = '';
        document.getElementById('choices').innerHTML = ''; // 以前の選択肢をクリア
        const question = quizData[currentQuiz];
        document.getElementById('question').textContent = question.column;

        // 正解を含む8つの選択肢を生成（仮のデータで代用）
        let choices = [question.name]; // 正解を追加
        // 仮の不正解を追加（実際にはより適切な方法で生成する必要がある）
        for (let i = 0; i < choiceNum - 1; i++) {
            let choice = question.name;
            while (choices.includes(choice)) {
                choice = quizData[Math.floor(Math.random() * quizData.length)].name;
            }
            choices.push(choice);
        }
        // 選択肢をシャッフル
        choices = choices.sort(() => Math.random() - 0.5);

        // 選択肢をHTMLに追加
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.onclick = () => checkAnswer(choice);
            document.getElementById('choices').appendChild(button);
        });
    } else {
        // クイズ終了
        document.getElementById('question').textContent = "クイズ終了！";
        document.getElementById('choices').innerHTML = '';
        document.getElementById('result').textContent = `正解数: ${correctAnswers} / ${quizData.length}`;
    }
}

function checkAnswer(choice) {
    if (choice === quizData[currentQuiz].name) {
        document.getElementById('result').textContent = "正解！";
        correctAnswers++;
    } else {
        document.getElementById('result').textContent = `不正解。正解は「${quizData[currentQuiz].name}」でした。`;
    }
    currentQuiz++;
    setTimeout(generateChoices, 1000); // 1秒後に次の問題へ
}

window.onload = generateChoices;
