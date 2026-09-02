document.addEventListener('DOMContentLoaded', () => {
    const screenCountInput = document.getElementById('screen-count');
    const btnGenerate = document.getElementById('btn-generate');
    const browserGrid = document.getElementById('browser-grid');
    const globalUrlInput = document.getElementById('global-url');
    const btnApplyAll = document.getElementById('btn-apply-all');
    const floatingBall = document.getElementById('floating-ball');

    // Estado inicial padrão com 2 telas
    generateScreens(2);

    btnGenerate.addEventListener('click', () => {
        let count = parseInt(screenCountInput.value);
        if (isNaN(count) || count < 1) count = 1;
        if (count > 20) count = 20;
        screenCountInput.value = count;
        generateScreens(count);
    });

    function generateScreens(count) {
        browserGrid.innerHTML = '';
        
        // Ajusta dinamicamente as colunas do grid com base na quantidade de telas
        let cols = 1;
        if (count >= 2 && count <= 4) cols = 2;
        else if (count >= 5 && count <= 9) cols = 3;
        else if (count >= 10) cols = 4;
        
        browserGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        // Calcula linhas proporcionais
        let rows = Math.ceil(count / cols);
        browserGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

        for (let i = 1; i <= count; i++) {
            const pane = document.createElement('div');
            pane.className = 'browser-pane';
            pane.dataset.id = i;

            pane.innerHTML = `
                <div class="pane-toolbar">
                    <input type="text" class="pane-url" value="https://google.com" placeholder="Digite a URL...">
                    <button class="pane-btn btn-go" title="Navegar"><i class="fa-solid fa-arrow-right"></i></button>
                    <button class="pane-btn btn-reload" title="Recarregar"><i class="fa-solid fa-rotate-right"></i></button>
                    <button class="pane-btn btn-fs" title="Tela Cheia Individual"><i class="fa-solid fa-expand"></i></button>
                </div>
                <iframe class="pane-content" src="https://google.com" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"></iframe>
            `;

            browserGrid.appendChild(pane);
            setupPaneEvents(pane);
        }
    }

    function setupPaneEvents(pane) {
        const urlInput = pane.querySelector('.pane-url');
        const btnGo = pane.querySelector('.pane-btn.btn-go');
        const btnReload = pane.querySelector('.pane-btn.btn-reload');
        const btnFs = pane.querySelector('.pane-btn.btn-fs');
        const iframe = pane.querySelector('.pane-content');

        const loadUrl = () => {
            let targetUrl = urlInput.value.trim();
            if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
                // Se não colocar protocolo, assume busca ou adiciona https
                if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
                    targetUrl = 'https://' + targetUrl;
                } else {
                    targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}`;
                }
                urlInput.value = targetUrl;
            }
            iframe.src = targetUrl;
        };

        btnGo.addEventListener('click', loadUrl);
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loadUrl();
        });

        btnReload.addEventListener('click', () => {
            iframe.src = iframe.src;
        });

        // Botão Fullscreen Individual para cada tela
        btnFs.addEventListener('click', () => {
            pane.classList.toggle('fullscreen-pane');
            const icon = btnFs.querySelector('i');
            if (pane.classList.contains('fullscreen-pane')) {
                icon.className = 'fa-solid fa-compress';
            } else {
                icon.className = 'fa-solid fa-expand';
            }
        });
    }

    // Aplicar URL global em todas as instâncias simultaneamente
    btnApplyAll.addEventListener('click', () => {
        const globalVal = globalUrlInput.value.trim();
        if (!globalVal) return;

        document.querySelectorAll('.browser-pane').forEach(pane => {
            const urlInput = pane.querySelector('.pane-url');
            const iframe = pane.querySelector('.pane-content');
            let targetUrl = globalVal;
            if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
                targetUrl = 'https://' + targetUrl;
            }
            urlInput.value = targetUrl;
            iframe.src = targetUrl;
        });
    });

    // Botão Flutuante: Ocultar / Minimizar o painel inteiro sem destruir os dados ou fechar as abas
    let isHidden = false;
    floatingBall.addEventListener('click', () => {
        isHidden = !isHidden;
        document.body.classList.toggle('hidden-mode', isHidden);
        const ballIcon = document.getElementById('ball-icon');
        if (isHidden) {
            ballIcon.className = 'fa-solid fa-eye-slash';
        } else {
            ballIcon.className = 'fa-solid fa-layer-group';
        }
    });
});
