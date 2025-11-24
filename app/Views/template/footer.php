<div id="toast-container" class="position-fixed top-0 end-0 p-5" style="z-index: 11"></div>

<!--begin::Footer-->
<footer class="app-footer">
    <div class="float-end d-none d-sm-inline">
        Powered by <a href="https://adminlte.io" class="text-decoration-none">AdminLTE.io</a>
    </div>
    <strong>
        Copyright &copy; 2025&nbsp;
        <a href="https://www.fabianocardoso.com.br" class="text-decoration-none">Fabiano Cardoso</a>.
    </strong>
    All rights reserved.
</footer><!--end::Footer-->

</div><!--end::App Wrapper-->

<!--begin::Scripts com Cache Otimizado-->

<!--begin::Third Party Plugins-->
<script src="https://cdn.jsdelivr.net/npm/overlayscrollbars@2.3.0/browser/overlayscrollbars.browser.es6.min.js" integrity="sha256-H2VM7BKda+v2Z4+DRy69uknwxjyDRhszjXFhsL4gD3w=" crossorigin="anonymous"></script>

<!--begin::Required Plugins-->
<script src="https://code.jquery.com/jquery-3.7.0.min.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" crossorigin="anonymous"></script>
<script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" integrity="sha256-YMa+wAM6QkVyz999odX7lPRxkoYAan8suedu4k2Zur8=" crossorigin="anonymous"></script>

<!--begin::AdminLTE com Versioning-->
<script src="<?= base_url('dist/js/adminlte.min.js?v=' . filemtime(FCPATH . 'dist/js/adminlte.min.js')) ?>"></script>

<!--begin::Main com Versioning-->
<script src="<?= base_url('dist/js/main.min.js?v=' . filemtime(FCPATH . 'dist/js/main.min.js')) ?>"></script>


<!--begin::Chart Libraries-->
<script src="https://cdn.jsdelivr.net/npm/apexcharts@3.37.1/dist/apexcharts.min.js" integrity="sha256-+vh8GkaU7C9/wbSLIcwq82tQ2wTf44aOHA8HlBMwRI8=" crossorigin="anonymous"></script>

<!--begin::Notifications-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js" crossorigin="anonymous"></script>

<!--begin::Performance Monitor (Desenvolvimento)-->
<?php if (ENVIRONMENT === 'development'): ?>
<script>
    <?php 
    // Inclui o Performance Monitor apenas em desenvolvimento
    $perfMonitorPath = FCPATH . 'public/dist/js/performance-monitor.min.js';
    if (file_exists($perfMonitorPath)) {
        echo file_get_contents($perfMonitorPath);
    }
    ?>
</script>
<?php endif; ?>

<!--begin::Utility Functions & Initialization-->
<script>
    /**
     * Configurações globais do sistema
     */
    const AppConfig = {
        baseUrl: '<?= base_url() ?>',
        environment: '<?= ENVIRONMENT ?>',
        cacheEnabled: true,
        cacheVersion: '1.0.0'
    };

    /**
     * Exibe mensagem toast
     */
    function mostrarMensagem(mensagem, tipo) {
        toastr[tipo](mensagem);
    }

    /**
     * Função auxiliar para fazer requisições com cache automático
     */
    async function requestWithCache(url, options = {}, cacheMinutes = 30) {
        const cacheKey = 'request_' + url.replace(/[^a-zA-Z0-9]/g, '_');
        
        // Tenta buscar do cache
        if (window.CacheManager) {
            const cached = CacheManager.get(cacheKey);
            if (cached) {
                console.log('✅ Cache HIT:', url);
                return cached;
            }
        }
        
        // Faz requisição
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Salva no cache
            if (window.CacheManager) {
                CacheManager.set(cacheKey, data, cacheMinutes);
                console.log('💾 Salvo no cache:', url);
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Erro na requisição:', error);
            throw error;
        }
    }

    /**
     * Limpa cache de uma rota específica
     */
    function invalidateCache(urlPattern) {
        if (!window.CacheManager) return;
        
        const keys = Object.keys(sessionStorage).filter(k => 
            k.startsWith('ordo_') && k.includes(urlPattern)
        );
        
        keys.forEach(key => {
            sessionStorage.removeItem(key);
            console.log('🗑️  Cache removido:', key);
        });
        
        console.log(`✅ ${keys.length} cache(s) invalidado(s)`);
    }

    /**
     * Pré-carrega recursos importantes
     */
    function preloadCriticalResources() {
        if (!('serviceWorker' in navigator)) return;
        
        const criticalResources = [
            '<?= base_url('public/dist/js/adminlte.min.js') ?>',
            '<?= base_url('public/dist/css/adminlte.min.css') ?>',
            '<?= base_url('public/dist/css/style.min.css') ?>'
        ];
        
        // Pré-carrega após 2 segundos (não bloqueia carregamento inicial)
        setTimeout(() => {
            criticalResources.forEach(resource => {
                fetch(resource, { 
                    priority: 'low',
                    mode: 'cors',
                    credentials: 'same-origin'
                }).catch(() => {
                    console.log('Pré-carregamento falhou:', resource);
                });
            });
            
            console.log('🚀 Recursos críticos pré-carregados');
        }, 2000);
    }

    /**
     * Monitora performance da página
     */
    function logPagePerformance() {
        if (!window.performance) return;
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
                
                console.log('%c📊 Performance', 'color: #4CAF50; font-weight: bold;');
                console.log('⏱️  Tempo Total:', (pageLoadTime / 1000).toFixed(2) + 's');
                console.log('📄 DOM Ready:', (domReadyTime / 1000).toFixed(2) + 's');
                
                // Verifica recursos cacheados
                const resources = window.performance.getEntriesByType('resource');
                const cached = resources.filter(r => r.transferSize === 0 && r.decodedBodySize > 0).length;
                const total = resources.length;
                
                console.log('💾 Cache:', `${cached}/${total} recursos (${((cached/total)*100).toFixed(1)}%)`);
                
                // Performance warning
                if (pageLoadTime > 3000) {
                    console.warn('⚠️  Página carregando devagar. Considere otimizar.');
                }
            }, 1000);
        });
    }

    /**
     * Inicialização do sistema
     */
    document.addEventListener('DOMContentLoaded', function() {
        
        // Configura toastr
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-right",
            timeOut: 3000,
            preventDuplicates: true
        };

        // Inicializa monitoramento (apenas em desenvolvimento)
        if (AppConfig.environment === 'development') {
            logPagePerformance();
        }

        // Pré-carrega recursos críticos
        preloadCriticalResources();

        // Limpa cache expirado a cada 5 minutos
        if (window.CacheManager) {
            setInterval(() => {
                CacheManager.clearExpired();
            }, 5 * 60 * 1000);
        }

        // Log de inicialização
        console.log('%c✅ Sistema Inicializado', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
        console.log('Cache:', window.CacheManager ? 'Ativo ✅' : 'Inativo ❌');
        console.log('Service Worker:', 'serviceWorker' in navigator ? 'Suportado ✅' : 'Não Suportado ❌');
    });

    /**
     * Detecta quando usuário sai da página e limpa cache se necessário
     */
    window.addEventListener('beforeunload', function() {
        if (window.CacheManager) {
            // Limpa cache expirado antes de sair
            CacheManager.clearExpired();
        }
    });

    /**
     * Comandos úteis disponíveis no console
     */
    if (AppConfig.environment === 'development') {
        console.log('%c🛠️  Comandos Disponíveis:', 'color: #2196F3; font-weight: bold;');
        console.log('  CacheManager.clear()              - Limpar todo cache');
        console.log('  CacheManager.clearExpired()       - Limpar cache expirado');
        console.log('  invalidateCache("pattern")        - Invalidar cache por padrão');
        console.log('  requestWithCache(url)             - Requisição com cache');
        console.log('  PerformanceMonitor.fullReport()   - Relatório de performance');
    }
</script>

<!--begin::Cache Preload Background-->
<script>
    // Estratégia de pré-cache inteligente
    if ('requestIdleCallback' in window) {
        // Usa requestIdleCallback para não interferir na performance
        requestIdleCallback(() => {
            // Pré-carrega dados que provavelmente serão usados
            const preloadUrls = [
                // Adicione URLs que devem ser pré-carregadas
                // '<?= base_url('api/dados-frequentes') ?>'
            ];
            
            preloadUrls.forEach(url => {
                fetch(url, { priority: 'low' })
                    .then(r => r.json())
                    .then(data => {
                        if (window.CacheManager) {
                            const key = 'preload_' + url.split('/').pop();
                            CacheManager.set(key, data, 60);
                        }
                    })
                    .catch(() => {}); // Ignora erros
            });
        });
    }
</script>

<!--begin::Offline Detection-->
<script>
    // Detecta quando usuário fica offline/online
    window.addEventListener('online', () => {
        toastr.success('Conexão restaurada!', 'Online');
        console.log('🌐 Online');
    });

    window.addEventListener('offline', () => {
        toastr.warning('Sem conexão. Usando cache local.', 'Offline');
        console.log('📡 Offline - Modo cache ativo');
    });
</script>

</body>
</html>