<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Cardoso">
    <meta name="description" content="Ordo Sistema de Administração de Escritórios de Advocacia">
    <meta name="keywords" content="Cardoso e Bruno, Advogados, Processos">
    
    <!-- Cache Control para recursos estáticos -->
    <meta http-equiv="Cache-Control" content="public, max-age=31536000">
    
    <!-- Favicon com versioning para cache -->
    <link rel="icon" href="https://cardosoebruno.adv.br/wp-content/uploads/2024/05/cropped-orignal-horizontal-32x32.png?v=1.0" sizes="32x32" />
    <link rel="icon" href="https://cardosoebruno.adv.br/wp-content/uploads/2024/05/cropped-orignal-horizontal-192x192.png?v=1.0" sizes="192x192" />
    <link rel="apple-touch-icon" href="https://cardosoebruno.adv.br/wp-content/uploads/2024/05/cropped-orignal-horizontal-180x180.png?v=1.0" />
    <meta name="msapplication-TileImage" content="https://cardosoebruno.adv.br/wp-content/uploads/2024/05/cropped-orignal-horizontal-270x270.png?v=1.0" />
    
    <!-- Preconnect para melhorar performance -->
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
    
    <!-- CSS com cache otimizado -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/source-sans-3@5.0.12/index.css" integrity="sha256-tXJfXfp6Ewt1ilPzLDtQnJV4hclT9XuaZUKyUvmyr+Q=" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/overlayscrollbars@2.3.0/styles/overlayscrollbars.min.css" integrity="sha256-dSokZseQNT08wYEWiz5iLI8QPlKxG+TswNRD8k35cpg=" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.min.css" integrity="sha256-Qsx5lrStHZyR9REqhUF8iQt73X06c8LGIUPzpOhwRrI=" crossorigin="anonymous">
    <link rel="stylesheet" href="<?= base_url('dist/css/adminlte.min.css?v=' . (file_exists(FCPATH . 'dist/css/adminlte.min.css') ? filemtime(FCPATH . 'dist/css/adminlte.min.css') : ''))?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/apexcharts@3.37.1/dist/apexcharts.css" integrity="sha256-4MX+61mt9NVvvuPjUWdUdyfZfxSB1/Rf9WtqRHgG5S0=" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jsvectormap@1.5.3/dist/css/jsvectormap.min.css" integrity="sha256-+uGLJmmTKOqBr+2E6KDYs/NRsHxSkONXFHUL0fy2O/4=" crossorigin="anonymous">
    <link rel="stylesheet" href="<?= base_url('dist/css/style.min.css?v=' . (file_exists(FCPATH . 'dist/css/style.min.css') ? filemtime(FCPATH . 'dist/css/style.min.css') : ''))?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" crossorigin>

    <!-- Service Worker para cache avançado -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('<?= base_url('public/dist/js/service-worker.min.js') ?>')
                    .then(function(registration) {
                        console.log('ServiceWorker registrado com sucesso:', registration.scope);
                    })
                    .catch(function(error) {
                        console.log('Falha ao registrar ServiceWorker:', error);
                    });
            });
        }
    </script>

    <!-- Sistema de Cache Local -->
    <script>
        // Cache Manager - Gerenciador de cache do navegador
        const CacheManager = {
            // Versão do cache (incrementar quando houver mudanças importantes)
            version: '1.0.0',
            
            // Prefixo para todas as chaves de cache
            prefix: 'ordo_',
            
            // Tempo de expiração padrão (em minutos)
            defaultExpiration: 30,
            
            /**
             * Salva dados no cache com expiração
             */
            set: function(key, data, expirationMinutes = null) {
                try {
                    const expiration = expirationMinutes || this.defaultExpiration;
                    const item = {
                        data: data,
                        timestamp: Date.now(),
                        expiration: expiration * 60 * 1000, // Converte para milissegundos
                        version: this.version
                    };
                    sessionStorage.setItem(this.prefix + key, JSON.stringify(item));
                    return true;
                } catch (e) {
                    console.warn('Erro ao salvar no cache:', e);
                    return false;
                }
            },
            
            /**
             * Recupera dados do cache
             */
            get: function(key) {
                try {
                    const itemStr = sessionStorage.getItem(this.prefix + key);
                    if (!itemStr) return null;
                    
                    const item = JSON.parse(itemStr);
                    
                    // Verifica versão
                    if (item.version !== this.version) {
                        this.remove(key);
                        return null;
                    }
                    
                    // Verifica expiração
                    const now = Date.now();
                    if (now - item.timestamp > item.expiration) {
                        this.remove(key);
                        return null;
                    }
                    
                    return item.data;
                } catch (e) {
                    console.warn('Erro ao recuperar do cache:', e);
                    return null;
                }
            },
            
            /**
             * Remove item do cache
             */
            remove: function(key) {
                sessionStorage.removeItem(this.prefix + key);
            },
            
            /**
             * Limpa todo o cache do sistema
             */
            clear: function() {
                const keys = Object.keys(sessionStorage);
                keys.forEach(key => {
                    if (key.startsWith(this.prefix)) {
                        sessionStorage.removeItem(key);
                    }
                });
            },
            
            /**
             * Limpa cache expirado
             */
            clearExpired: function() {
                const keys = Object.keys(sessionStorage);
                keys.forEach(key => {
                    if (key.startsWith(this.prefix)) {
                        const itemStr = sessionStorage.getItem(key);
                        try {
                            const item = JSON.parse(itemStr);
                            const now = Date.now();
                            if (now - item.timestamp > item.expiration || item.version !== this.version) {
                                sessionStorage.removeItem(key);
                            }
                        } catch (e) {
                            sessionStorage.removeItem(key);
                        }
                    }
                });
            }
        };
        
        // Limpa cache expirado ao carregar a página
        CacheManager.clearExpired();
        
        // Função auxiliar para fazer requisições com cache
        async function fetchWithCache(url, options = {}, cacheKey = null, expirationMinutes = 30) {
            const key = cacheKey || url;
            
            // Tenta buscar do cache primeiro
            const cachedData = CacheManager.get(key);
            if (cachedData) {
                console.log('Dados recuperados do cache:', key);
                return cachedData;
            }
            
            // Se não houver cache, faz a requisição
            try {
                const response = await fetch(url, options);
                const data = await response.json();
                
                // Salva no cache
                CacheManager.set(key, data, expirationMinutes);
                console.log('Dados salvos no cache:', key);
                
                return data;
            } catch (error) {
                console.error('Erro na requisição:', error);
                throw error;
            }
        }
        
        // Adiciona ao objeto window para uso global
        window.CacheManager = CacheManager;
        window.fetchWithCache = fetchWithCache;
    </script>