document.addEventListener('DOMContentLoaded', () => {
    const browserGrid = document.getElementById('browser-grid');
    const floatingBall = document.getElementById('floating-ball');

    generateFourScreens();

    function generateFourScreens() {
        browserGrid.innerHTML = '';
        
        for (let i = 1; i <= 4; i++) {
            const pane = document.createElement('div');
            pane.className = 'browser-pane';
            pane.dataset.id = i;

            pane.innerHTML = `
                <div class="pane-toolbar">
                    <input type="text" class="pane-url" value="https://google.com" placeholder="URL...">
                    <button class="pane-btn btn-go" title="Ir"><i class="fa-solid fa-arrow-right"></i></button>
                    <button class="pane-btn btn-reload" title="Recarregar"><i class="fa-solid fa-rotate-right"></i></button>
                    <button class="pane-btn btn-autoclick" title="Autoclick"><i class="fa-solid fa-bolt"></i></button>
                    <button class="pane-btn btn-fs" title="Expandir"><i class="fa-solid fa-expand"></i></button>
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
        const btnAutoclick = pane.querySelector('.pane-btn.btn-autoclick');
        const btnFs = pane.querySelector('.pane-btn.btn-fs');
        const iframe = pane.querySelector('.pane-content');

        const loadUrl = () => {
            let targetUrl = urlInput.value.trim();
            if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
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

        // Autoclick individual por tela (continua rodando mesmo se a tela for ocultada pelo botão flutuante)
        let autoclickInterval = null;
        btnAutoclick.addEventListener('click', () => {
            if (autoclickInterval) {
                clearInterval(autoclickInterval);
                autoclickInterval = null;
                btnAutoclick.classList.remove('autoclick-active');
            } else {
                let secondsInput = prompt("Intervalo do autoclick em segundos:", "3");
                if (!secondsInput) return;
                let intervalMs = parseFloat(secondsInput) * 1000;
                if (isNaN(intervalMs) || intervalMs < 500) intervalMs = 1000;

                btnAutoclick.classList.add('autoclick-active');

                autoclickInterval = setInterval(() => {
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        const centerX = iframeDoc.documentElement.clientWidth / 2;
                        const centerY = iframeDoc.documentElement.clientHeight / 2;
                        const targetElement = iframeDoc.elementFromPoint(centerX, centerY);
                        if (targetElement) {
                            targetElement.click();
                        }
                    } catch (e) {
                        // Tratamento interno de segurança cross-origin
                    }
                }, intervalMs);
            }
        });

        btnFs.addEventListener('click', () => {
            pane.classList.toggle('fullscreen-pane');
            const icon = btnFs.querySelector('i');
            icon.className = pane.classList.contains('fullscreen-pane') ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
        });
    }

    // Botão Flutuante: Oculta o grid visualmente mas mantém todos os iframes e timers de autoclick ativos
    let isHidden = false;
    floatingBall.addEventListener('click', () => {
        isHidden = !isHidden;
        document.body.classList.toggle('hidden-mode', isHidden);
        const ballIcon = document.getElementById('ball-icon');
        ballIcon.className = isHidden ? 'fa-solid fa-eye-slash' : 'fa-solid fa-layer-group';
    });
});
