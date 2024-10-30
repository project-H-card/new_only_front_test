const card = document.querySelector('.card');
const glow = document.querySelector('.glow');

// ドラッグに対して実装
let isDragging = false;
let startX, startY, offsetX, offsetY;

const startDrag = (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    offsetX = card.offsetLeft;
    offsetY = card.offsetTop;

    // クリックしている間、アニメーションを無効化
    card.style.transition = 'none';
    card.style.pointerEvents = 'none';
    glow.style.opacity = 1;
}

const handleDrag = (e) => {
    if (isDragging) {
        // 3D回転を計算
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateX = -y / 10;
        const rotateY = x / 10;
        card.style.transform = `translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // カードの位置を更新
        // const moveX = offsetX + (e.clientX - startX);
        // const moveY = offsetY + (e.clientY - startY);
        // card.style.left = `${moveX}px`;
        // card.style.top = `${moveY}px`;

        // Glowエフェクトをマウスに追従
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    }
}

const stopDrag = () => {
    isDragging = false;

    // マウスボタンを離したら元に戻す
    card.style.transform = 'translate(-50%, -50%) rotateX(0deg) rotateY(0deg)';
    card.style.transition = 'transform 0.2s';
    card.style.pointerEvents = 'all';
    glow.style.opacity = 0;
}

// マウス用のイベント
card.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', handleDrag);
document.addEventListener('mouseup', stopDrag);

// スマホ用のタッチイベント
card.addEventListener('touchstart', (e) => {
    startDrag(e.touches[0]);
});
document.addEventListener('touchmove', (e) => {
    handleDrag(e.touches[0]);
});
document.addEventListener('touchend', stopDrag);



// ホバーに対して実装
// const card = document.querySelector('.card');

// card.addEventListener('mousemove', (e) => {
//     const rect = card.getBoundingClientRect();
//     const x = e.clientX - rect.left - rect.width / 2;
//     const y = e.clientY - rect.top - rect.height / 2;

//     const rotateX = -y / 100;
//     const rotateY = x / 100;

//     card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
// });

// card.addEventListener('mouseleave', () => {
//     card.style.transform = 'rotateX(0deg) rotateY(0deg)';
// });