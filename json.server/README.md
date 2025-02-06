JSON server is an npm package that lets you create fake REST APIs with zero coding. In this tutorial series, we will see how to create a simple json file that can be used as a database and supports API requests for a number of day to day requirements like querying a list of items, querying by id, filtering, sorting, pagination, querying with operations like great than or less than, querying by full text search, querying parent or child entities and making POST PUT or DELETE requests, all using json-server.

## Install

```shell
npm install json-server
```

## Run

```shell
npm start
```

## Storage
- db\store.json

## Static files:
- Serving ./public directory if it exists

## Index:
- http://localhost:3000/

## Endpoints:
- http://localhost:3000/posts
- http://localhost:3000/comments
- http://localhost:3000/profile

## Routes

Based on the example `db.json`, you'll get the following routes:

```
GET    /posts
GET    /posts/:id
POST   /posts
PUT    /posts/:id
PATCH  /posts/:id
DELETE /posts/:id

# Same for comments
```

```
GET   /profile
PUT   /profile
PATCH /profile
```

## Params

### Conditions

- ` ` → `==`
- `lt` → `<`
- `lte` → `<=`
- `gt` → `>`
- `gte` → `>=`
- `ne` → `!=`

```
GET /posts?views_gt=9000
```

### Range

- `start`
- `end`
- `limit`

```
GET /posts?_start=10&_end=20
GET /posts?_start=10&_limit=10
```

### Paginate

- `page`
- `per_page` (default = 10)

```
GET /posts?_page=1&_per_page=25
```

### Sort

- `_sort=f1,f2`

```
GET /posts?_sort=id,-views
```

### Nested and array fields

- `x.y.z...`
- `x.y.z[i]...`

```
GET /foo?a.b=bar
GET /foo?x.y_lt=100
GET /foo?arr[0]=bar
```

### Embed

```
GET /posts?_embed=comments
GET /comments?_embed=post
```

## Delete

```
DELETE /posts/1
DELETE /posts/1?_dependent=comments
```

## Serving static files

If you create a `./public` directory, JSON Server will serve its content in addition to the REST API.

You can also add custom directories using `-s/--static` option.

```sh
json-server -s ./static
json-server -s ./static -s ./node_modules
```


## References 
- [NPM: json-server](https://www.npmjs.com/package/json-server)
- [JSON Server Tutorial for Beginners](https://www.youtube.com/playlist?list=PLC3y8-rFHvwhc9YZIdqNL5sWeTCGxF4ya)