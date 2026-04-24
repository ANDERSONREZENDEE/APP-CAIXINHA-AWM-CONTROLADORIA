const CACHE_NAME = 'caixinha-wm-v5'; 

// Arquivos principais para guardar offline imediatamente
const arquivosParaGuardar = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './LOGOTIPO.jpg',
  './Captura de tela 2026-02-13 132630.jpg',
  './icone_v3.png',
  './OLHOABERTO.png',
  './OLHOFECHADO_V2.png',
  './atalho.png'
];

self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(arquivosParaGuardar))
  );
  // Força o Service Worker a assumir o controle imediatamente
  self.skipWaiting();
});

self.addEventListener('activate', evento => {
  // Varre a memória e apaga os caches antigos para não dar conflito
  evento.waitUntil(
    caches.keys().then(nomesCaches => {
      return Promise.all(
        nomesCaches.map(nomeCache => {
          if (nomeCache !== CACHE_NAME) {
            console.log('Apagando cache antigo:', nomeCache);
            return caches.delete(nomeCache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', evento => {
  evento.respondWith(
    // 1. Tenta buscar no cache primeiro, ignorando as queries (ex: ?tela=planilha)
    caches.match(evento.request, { ignoreSearch: true })
      .then(respostaCache => {
        if (respostaCache) {
          return respostaCache; // Achou no cofre, devolve super rápido
        }
        
        // 2. Se não estava no cache inicial, busca na internet
        return fetch(evento.request).then(respostaRede => {
          return caches.open(CACHE_NAME).then(cache => {
            // 3. Salva uma cópia silenciosa no cache para a próxima vez (Cofre Dinâmico)
            if (evento.request.method === 'GET' && respostaRede.status === 200) {
              cache.put(evento.request, respostaRede.clone());
            }
            return respostaRede;
          });
        });
      }).catch(() => {
        // 4. Último recurso: Se a internet caiu de vez e ele estava tentando abrir o app, força a tela principal
        if (evento.request.mode === 'navigate') {
          return caches.match('./index.html', { ignoreSearch: true });
        }
      })
  );
});
