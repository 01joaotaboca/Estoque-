const CACHE_NAME = 'agro-estoque-v1';

// Lista de arquivos para funcionar OFFLINE
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  // Salvando as bibliotecas externas para o PDF funcionar sem internet
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js'
];

// INSTALAÇÃO: Salva os arquivos no cache do celular
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Agro na Palma da Mão: Arquivos cacheados com sucesso!');
      return cache.addAll(ASSETS);
    })
  );
});

// ATIVAÇÃO: Limpa versões antigas do app se você atualizar o código
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// FETCH: Prioriza o Cache (Carregamento Instantâneo)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Retorna o arquivo do cache ou busca na rede se houver sinal
      return response || fetch(event.request).catch(() => {
        // Se estiver totalmente offline e tentar abrir algo novo, volta pro index
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
