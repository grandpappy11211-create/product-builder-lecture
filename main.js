document.addEventListener('DOMContentLoaded', () => {
    const ballContainer = document.getElementById('ball-container');
    const drawBtn = document.getElementById('draw-btn');
    const resetBtn = document.getElementById('reset-btn');
    const historyList = document.getElementById('history-list');
    const themeToggle = document.getElementById('theme-toggle');

    let isDrawing = false;

    // Theme Management
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.textContent = '🌙';
        }
    };

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    initTheme();

    // 공 색상 클래스 결정 함수
    function getBallColorClass(num) {
        if (num <= 10) return 'yellow';
        if (num <= 20) return 'blue';
        if (num <= 30) return 'red';
        if (num <= 40) return 'gray';
        return 'green';
    }

    // 로또 번호 생성 (1~45 중 6개)
    function generateLottoNumbers() {
        const numbers = [];
        while (numbers.length < 6) {
            const num = Math.floor(Math.random() * 45) + 1;
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
        return numbers.sort((a, b) => a - b);
    }

    // 공 생성 및 화면 표시
    async function showBalls(numbers) {
        ballContainer.innerHTML = '';
        
        for (let i = 0; i < numbers.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 400)); // 0.4초 간격
            
            const num = numbers[i];
            const ball = document.createElement('div');
            ball.className = `ball ${getBallColorClass(num)}`;
            ball.textContent = num;
            ball.style.animationDelay = `${i * 0.1}s`;
            ballContainer.appendChild(ball);
        }
    }

    // 이력 추가
    function addToHistory(numbers) {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        const li = document.createElement('li');
        li.className = 'history-item';
        
        let ballsHtml = '<div class="history-balls">';
        numbers.forEach(num => {
            ballsHtml += `<div class="small-ball ${getBallColorClass(num)}">${num}</div>`;
        });
        ballsHtml += '</div>';
        
        li.innerHTML = `
            ${ballsHtml}
            <span class="history-date">${timeStr}</span>
        `;
        
        // 최신 이력이 위로 오도록 추가
        if (historyList.firstChild) {
            historyList.insertBefore(li, historyList.firstChild);
        } else {
            historyList.appendChild(li);
        }

        // 최대 10개까지만 유지
        if (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
        }
    }

    // 추첨 버튼 클릭 이벤트
    drawBtn.addEventListener('click', async () => {
        if (isDrawing) return;
        
        isDrawing = true;
        drawBtn.disabled = true;
        
        const numbers = generateLottoNumbers();
        await showBalls(numbers);
        addToHistory(numbers);
        
        isDrawing = false;
        drawBtn.disabled = false;
    });

    // 초기화 버튼 클릭 이벤트
    resetBtn.addEventListener('click', () => {
        if (isDrawing) return;
        
        ballContainer.innerHTML = '<div class="placeholder-text">행운을 빕니다!</div>';
        historyList.innerHTML = '';
    });
});
