'use strict';
const apiClient = require('../ApiClient');

const repoTitleCSSSelectorIterator = (idx) => {
  return `.datatable > tbody:nth-child(2) > tr:nth-child(${idx}) > td:nth-child(3)`;
}

const buttonCSSSelectorIterator = (idx) => {
  return `#app > div > div > section > div > div > div > table > tbody > tr:nth-child(${idx}) > td:nth-child(7) > a`;
}

const itemsPerPage = 30;

module.exports = {
  'Test loading': async function (client) {
    let nuxt = client.page.nuxt();
    nuxt.navigate();

    //espera título do primeiro repo ficar visível
    client.waitForElementVisible(repoTitleCSSSelectorIterator(1), 10000, 'Carregou lista de repos, primeiro elemento visível');
    const repo = await apiClient.fetchRepos();

    client.assert.containsText(repoTitleCSSSelectorIterator(1), repo[0].name, 'Título recebido pela API igual ao título mostrado na tela');
    client.end();
  },
  'Test pagination': async function (client) {
    let nuxt = client.page.nuxt();
    nuxt.navigate();

    //espera título do primeiro repo ficar visível
    nuxt.waitForElementVisible(repoTitleCSSSelectorIterator(1), 10000, 'Carregou lista de repos, primeiro elemento visível');

    // vai pro fim da página pra ativar a paginação
    client.execute(function (data) {
      window.scrollTo(0,document.body.scrollHeight)
    }, []);

    //busca elemento 35 que está na página 2
    nuxt.waitForElementVisible(repoTitleCSSSelectorIterator(itemsPerPage + 5), 10000, 'Elemento 35 (elm 5 da pag 2) visível');
    const repo = await apiClient.fetchRepos(2);

    //compara título vindo da api com título da tela
    nuxt.assert.containsText(repoTitleCSSSelectorIterator(itemsPerPage + 5), repo[4].name, 'Título recebido pela API igual ao título mostrado na tela');
    client.end();
  },
  'Test too many api calls' : async function (client) {
    let nuxt = client.page.nuxt();
    nuxt.navigate();

    //espera título do primeiro repo ficar visível
    // nuxt.waitForElementVisible(repoTitleCSSSelectorIterator(1), 5000, 'Carregou lista de repos, primeiro elemento visível');
    client.pause(5000);

    // fazendo chamadas consecutivas ate bloquera o cliente momentaneamente
    let callingApi = true
    while (callingApi) {
      try {
        await apiClient.fetchRepos();
        console.log('chamou');
      } catch (error) {
        callingApi = false;
      }
    }

    // vai pro fim da página pra ativar a paginação
    client.execute(function (data) {
      window.scrollTo(0,document.body.scrollHeight)
    }, []);

    nuxt.waitForElementVisible('.snack__content', 10000, 'Alerta de too many api calls presente');
    nuxt.assert.containsText('.snack__content', 'Too many API calls per minute, wait for more...', 'Mensagem corresponde a too many calls')

    console.log('Esperando 1 min para poder fazer requests novamente a API');
    // esperando 1 min para host poder realizar novas chamadas de api
    client.pause(60000);
    client.end();
  },
  'Test navigation': async function (client) {
    let repos = await apiClient.fetchRepos();
    let nuxt = client.page.nuxt();
    nuxt.navigate();

    //espera título do primeiro repo ficar visível
    nuxt.waitForElementVisible(buttonCSSSelectorIterator(1), 10000, 'Primeiro botão apareceu');

    nuxt.click(buttonCSSSelectorIterator(1));
    client.pause(5000);
    client.assert.urlContains(repos[0].id, 'Navegou para a rota do repositório');

    client.end();
  }
};