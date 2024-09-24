class FactorizationGame {
    constructor() {
        this.targetNumber = 0;
        this.currentFactors = {};
        this.primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
        this.waitTime = 2; // 結果表示後の待ち時間（秒）
        this.retireTime = 4; // リタイア後の待ち時間（秒）
        this.waiting = false; // 待機状態を管理
        this.resultDivDefaultText = 'ここに結果が表示されます。';
        this.init();
    }

    // 初期化
    init() {
        this.generateTargetNumber();
        this.renderPrimeButtons();
        this.attachEventHandlers();
        this.updateEquation();
    }

    // ターゲットの数を生成する（素因数分解の対象）
    generateTargetNumber() {
        const randomIndex = Math.floor(Math.random() * this.primeNumbers.length);
        this.targetNumber = this.primeNumbers[randomIndex] * this.primeNumbers[Math.floor(Math.random() * this.primeNumbers.length)];
        document.getElementById('target-number').textContent = `目標: ${this.targetNumber}`;
    }

    // 素数ボタンを生成
    renderPrimeButtons() {
        const primeButtonsDiv = document.getElementById('prime-buttons');
        primeButtonsDiv.innerHTML = ''; // クリア
        this.primeNumbers.forEach(prime => {
            const button = document.createElement('button');
            button.textContent = prime;
            button.addEventListener('click', () => this.handlePrimeClick(prime));
            primeButtonsDiv.appendChild(button);
        });
    }

    // 素数ボタンのクリック処理
    handlePrimeClick(prime) {
        if (this.waiting) return; // 待機中なら何もしない
        if (!this.currentFactors[prime]) {
            this.currentFactors[prime] = 1;
        } else {
            this.currentFactors[prime] += 1;
        }
        this.updateEquation();
    }

    // 方程式を表示
    updateEquation() {
        const equationDiv = document.getElementById('equation');
        let equationText = '';
        let currentProduct = 1;

        for (const [prime, power] of Object.entries(this.currentFactors)) {
            equationText += `${prime}^${power} × `;
            currentProduct *= Math.pow(prime, power);
        }

        // 「× 」で終わらないように調整
        if (equationText.endsWith(' × ')) {
            equationText = equationText.slice(0, -3);
        }

        equationDiv.textContent = equationText || '式: ';
    }

    // 結果を表示
    checkAnswer() {
        if (this.waiting) return; // 待機中なら何もしない
        const currentProduct = this.calculateCurrentProduct();
        const resultDiv = document.getElementById('result');
        if (currentProduct === this.targetNumber) {
            resultDiv.textContent = `正解！${this.waitTime}秒後に次の問題に進みます。`;
            this.waiting = true; // 待機状態をオン
            setTimeout(() => {
                this.resetGame();
                this.waiting = false; // 待機状態を解除
            }, this.waitTime * 1000);
        } else {
            resultDiv.textContent = '間違いです！';
        }
    }

    // 現在の積を計算
    calculateCurrentProduct() {
        let product = 1;
        for (const [prime, power] of Object.entries(this.currentFactors)) {
            product *= Math.pow(prime, power);
        }
        return product;
    }

    // 式をリセット
    resetEquation() {
        if (this.waiting) return; // 待機中なら何もしない
        this.currentFactors = {};
        this.updateEquation();
    }

    // リセット
    resetGame() {
        this.currentFactors = {};
        this.updateEquation();
        document.getElementById('result').textContent = this.resultDivDefaultText;
        this.generateTargetNumber();
    }

    // リタイア機能の実装
    retire() {
        if (this.waiting) return; // 待機中なら何もしない
        const resultDiv = document.getElementById('result');
        const factorization = this.factorize(this.targetNumber);
        resultDiv.textContent = `リタイア！答えは: ${factorization.join(' × ') || '素数です'}。${this.retireTime}秒後に次の問題に進みます。`;
        this.waiting = true; // 待機状態をオン
        setTimeout(() => {
            this.resetGame();
            this.waiting = false; // 待機状態を解除
        }, this.retireTime * 1000); // 4秒待って次の問題へ
    }

    // 素因数分解を計算して配列で返す
    factorize(number) {
        const factors = [];
        let n = number;
        for (const prime of this.primeNumbers) {
            let count = 0;
            while (n % prime === 0) {
                n /= prime;
                count += 1;
            }
            if (count > 0) {
                factors.push(`${prime}^${count}`);
            }
            if (n === 1) break;
        }
        return factors;
    }

    // ゲームの状態をリセットするボタン
    attachEventHandlers() {
        document.getElementById('equals-button').addEventListener('click', () => this.checkAnswer());
        document.getElementById('prime-button').addEventListener('click', () => this.checkIfPrime());
        document.getElementById('reset-equation').addEventListener('click', () => this.resetEquation());
        document.getElementById('reset-game').addEventListener('click', () => this.resetGame());
        document.getElementById('retire-button').addEventListener('click', () => this.retire());
    }

    // 素数ボタンを押されたとき
    checkIfPrime() {
        if (this.waiting) return; // 待機中なら何もしない
        const currentProduct = this.calculateCurrentProduct();
        const resultDiv = document.getElementById('result');
        if (this.primeNumbers.includes(currentProduct)) {
            resultDiv.textContent = `正解！(素数です)${this.waitTime}秒後に次の問題に進みます。`;
            this.waiting = true; // 待機状態をオン
            setTimeout(() => {
                this.resetGame();
                this.waiting = false; // 待機状態を解除
            }, this.waitTime * 1000);
        } else {
            resultDiv.textContent = '素数ではありません。';
        }
    }
}

// ゲームを初期化
document.addEventListener('DOMContentLoaded', () => {
    const game = new FactorizationGame();
});
