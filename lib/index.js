const Promise = require('bluebird');
const qs = require('querystring');
const GithubClient = require('github');
const concurrency = 10; // getUser requests at a time

let github = null; // shared github

function getGithub() {
  const result = github || (github = new GithubClient({
    debug: false,
    Promise: Promise,
  }))

  result.authenticate({
    type: 'token',
    token: process.env.GITHUB_TOKEN,
  });

  return result;
}

function getUser(id, i, length, github = getGithub()) {
 return github
  .users
  .getById({
    id,
  })
  .then(user => ({
    id: user.id,
    username: user.login,
    avatarURL: user.avatar_url,
    followers: user.followers,
  }));
}

function getUsers(ids) {
  return Promise.map(ids, getUser, {
    concurrency,
  });
}

function searchUsers(params, github = getGithub()) {
  const query = {
    q: `language:${params.language}`,
    page: params.page || 1,
    per_page: params.perPage || 10,
  };
  return github
    .search
    .users(query)
    .then(results => Promise.props({
      items: getUsers(results.items.map(item => item.id)),
      meta: {
        count: results.total_count,
        hasNextPage: github.hasNextPage(results),
        hasPrevPage: github.hasPreviousPage(results),
      },
    }));
}

function buildMetaForQuery(query, result, host) {
  return {
    count: result.meta.count,
    nextPage: result.meta.hasNextPage ? `${host}?${qs.stringify({
      page: query.page + 1,
      perPage: query.perPage,
      language: query.language,
    })}` : null,
    prevPage: result.meta.hasPrevPage ? `${host}?${qs.stringify({
      page: query.page - 1,
      perPage: query.perPage,
      language: query.language,
    })}`: null,
  };
}

module.exports = {
  getGithub,
  searchUsers,
  buildMetaForQuery,
};