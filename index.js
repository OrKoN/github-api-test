const Promise = require('bluebird');
const Koa = require('koa');
const app = new Koa();
const { searchUsers, buildMetaForQuery } = require('./lib');
const port = process.env.PORT || 3000;

// error handler
app.use(Promise.coroutine(function* (ctx, next) {
  try {
    yield next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      message: err.message,
    };
  }
}));

// validator
app.use(Promise.coroutine(function* (ctx, next) {
  const query = ctx.request.query;
  query.page = Number(query.page || 1);
  if (query.page <= 0) {
    return ctx.throw(400, 'page must be an integer > 0');
  }
  query.perPage = Number(query.perPage || 10);
  if (query.perPage <= 0 || query.perPage > 20) {
    return ctx.throw(400, 'perPage must be an integer > 0 AND <= 20');
  }
  if (!query.language) {
    return ctx.throw(400, 'language is required');
  }
  yield next();
}));

// handler
app.use(Promise.coroutine(function* (ctx, next) {
  const query = ctx.request.query;
  const result = yield searchUsers(query);
  ctx.body = {
    items: result.items,
    meta: buildMetaForQuery(query, result, `http://localhost:${port}`),
  };
}));

app.listen(port);