'use strict';
const apiClient = require('../ApiClient');

module.exports = {
  // navega pra url /{repoId}
  // checa se h1 e h3 correspondem aos valores recebidos pela api
  'Page corresponds to PR': async function (client) {
    let repos = await apiClient.fetchRepos();

    let nuxt = client.url('http://localhost:3000/' + repos[3].id);
    
    //espera título do primeiro repo ficar visível
    client.waitForElementVisible('.display-2', 5000, 'Titulo visível');
    client.waitForElementVisible('.display-1', 5000, 'Descrição visível');

    client.assert.containsText('.display-2', repo.full_name, 'Nome do repo corresponde ao vindo da API');
    client.assert.containsText('.display-1', repo.description, 'Descrição do repo corresponde ao vindo da API');

    client.end();
  },
  // clica card de pr
  // checa se url corresponed a url recebida pelo objeto da api
  'Check pr click': async function (client) {
    let repos = await apiClient.fetchRepos();
    let repo = repos[3];
    let prs = await apiClient.fetchRepoPRs(repo.id);
    let pr = prs[0];

    let nuxt = client.url('http://localhost:3000/' + repo.id);

    //clica primeiro pr
    client.click('#app > div > div > section > section > div > div > div:nth-child(1)');
    client.pause(5000);
    
    client.assert.urlContains(pr.html_url, 'Página aberta corresponde a url do pr recebida pela api');
    client.end();
  }
};