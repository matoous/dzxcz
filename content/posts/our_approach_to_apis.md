---
title: "Our approach to Go APIs"
date: 2022-05-26
slug: out_approach_to_apis
draft: false
tags: ["code","go","writing"]
---

It's hard to mantain docs and code in sync. Best case scenario, you use one as the source of truth and generate the other.
This works well for example for python where you can use `apispec` to annotate the API in a structured way.
In Go, this was always a struggle. One of the favorite tools for this task is [`swag`](https://github.com/swaggo/swag)
that can generate openapi specification from the code (based on annotations in comment). The issue is, using
comments for specification doesn't work well. The comments get very long, it's hard to maintain readable structure,
and you can't distinguish between documentation (what will be public) and actual comments (internal to repository).

At SumUp we have recently have the biggest success with [`oapi-codegen`](https://github.com/deepmap/oapi-codegen).
Here the order is inverted, you write the specification first and generate the code from there.
`oapi-codegen` requires you to use either `echo` or `chi` framework, if neither suits you, you can still use
it to at least generate the models.

Our approach currently looks like this:

First you add specification of your API in a `spec` package. Such as `spec/openapi.yaml`:


```yaml
openapi: 3.0.0
info:
  title: Sample API
servers:
  - url: http://api.example.com/v1
paths:
  /user/{id}:
    get:
      summary: Get user.
      oprationId: GetUser
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
components:
  schemas:
    User:
      type: object
      properties:
        required:
          - email
        email:
          type: string
```

Next, you add `gen.go` file that will be used with `go generate` command to mantain the generated code up to date:

```go
package spec

//go:generate go run github.com/deepmap/oapi-codegen/cmd/oapi-codegen --package spec -o spec.gen.go openapi.yaml
```

Now any time you update your specs you can run `go generate ./...` to also update the generated code.
`oapi-codegen` will by default generate for you the types, client implementation, and server interface.
You still need to implement the server side though, but that is fairly easy with all the generated code.
You implement the generated interface:

```go
package api

import (
	"github.com/labstack/echo/v4"

	"github.com/you/your_package/api/spec"
)

type Handler struct {}

func (h *Handler) GetUsers(c echo.Context, id string) error {
	return c.JSON(http.StatusOK, spec.User{
    Email: "test@sumup.com",
  })
}
```

And finally you register it on an echo router

```go
package main

import (
	"github.com/labstack/echo/v4"

	"github.com/you/your_package/api"
	"github.com/you/your_package/api/spec"
)

func main() {
	e := echo.New()
  spec.RegisterHandlers(g, &api.Handler{})
  e.Start(":8080")
}

```

That's it, you are ready to roll. This approach saved us a few headaches already.

