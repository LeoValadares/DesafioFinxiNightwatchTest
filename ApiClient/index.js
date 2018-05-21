const axios = require('axios')
const urlPrefix = 'https://api.github.com'

module.exports.fetchRepos = async (page = 1) => {
  let data = await apiCall(`${urlPrefix}/search/repositories?q=language:java&sort=stars&order=desc&page=${page}`)
  return data.items
}

module.exports.fetchRepoInfos = async (repoId) => {
  let data = await apiCall(`${urlPrefix}/repositories/${repoId}`)
  return data
}

module.exports.fetchRepoPRs = async (repoId) => {
  const data = await apiCall(`${urlPrefix}/repositories/${repoId}/pulls`)
  return data
}

const apiCall = async (url) => {
  try {
    let { data } = await axios.get(url)
    return data
  } catch (error) {
    // let msg
    // if (error.request.status === 403) msg = 'Too many API calls per minute, wait for more...'
    // else msg = 'Unspecified error, try again'
    // EventBus.$emit('toastr', msg)
    // throw error
  }
}
