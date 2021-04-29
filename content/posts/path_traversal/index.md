---
title: "Preventing path traversal in Golang"
date: 2021-04-02
slug: go_path_traversal
draft: true
tags: ["code", "security", "golang", "writing"]
---

New project surfaced in our company, unoriginally called _IAP GCS proxy_.
As the name suggests, it is a small golang proxy that provides [IAP](https://cloud.google.com/iap)
restricted access to [Google Cloud Storage](https://cloud.google.com/storage/)
buckets.

Within minutes one very interesting comment by Martin Bajanik, a senior
application security engineer, appeared in the slack thread that caught my attention:

> This might allow path traversal from the outside to traverse to a different bucket,
> which might be a problem if we ever reuse the same SA on two different buckets

talking about this piece of code:

```golang
upstreamUrl, err := url.Parse(fmt.Sprintf("https://storage.googleapis.com/%s%s", gp.GCSBucket, req.Path))
```

## Don't trust the user

So, what's the issue with this line? Assume that someone send the following request
to the IAP GCS proxy:

```bash
curl https://gcs-iap-proxy.company.com/../another_bucket/super_important_file.txt"
```

with the code above this results into the upstream url being
`https://storage.googleapis.com/target_bucket/../another_bucket/super_important_file.txt`
effectively allowing path traversal to other buckets in the google cloud storage.

## Escaped path

Initial attempt to solve this was using `request.EscapedPath()` instead of `request.Path`.

```diff
- upstreamUrl, err := url.Parse(fmt.Sprintf("https://storage.googleapis.com/%s%s", gp.GCSBucket, req.Path))
+ upstreamUrl, err := url.Parse(fmt.Sprintf("https://storage.googleapis.com/%s%s", gp.GCSBucket, req.EscapedPath()))
```

This would work, but would result into weird requests being send upstream, such as
`https://storage.googleapis.com/target_bucket/..%2another_bucket/super_important_file.txt` and
left me wondering, whether there's a more elegant solution to the problem at hand.

## Secure join

After a quick search I landed on this issue at github.com/golang/go:
[proposal: path/filepath: addition of SecureJoin helper](https://github.com/golang/go/issues/20126)
that suggests new `filepath` function `SecureJoin` that would prevent path
traversal in `filepath.Join`. Sadly, but rightful, the issue was closed as there
wasn't compelling reason to include this into the standard library.
Some people suggested using [`securejoin.SecureJoin`](https://github.com/cyphar/filepath-securejoin)
but as one of the great golang proverbs goes, _A little copying is better than a little dependency._[^1].
For sure, there must be a way to solve this using the tools at hand.

## Path clean

Further googling landed me at [ServeMux and a path traversal vulnerability](https://ilyaglotov.com/blog/servemux-and-path-traversal)
article by Ilya Glotov. There, the proposed solution is lean and clean:

```go
cleanPath := filepath.FromSlash(path.Clean("/"+strings.Trim(req.URL.Path, "/")))
```

`path.Clean` cleans the path getting rid of any parent directory references
(`../`), that is, if the path is absolute which is a very important gotcha.
Of course, it makes sense, there's no way to clean path such as `a/../../b`
since the parent directory could be anything and we don't know the file system hierarchy.
On the other hand, path such as `/a/../../b` can be safely cleaned. First `../`
sequence lends us in the root directory, the second one is basically ineffective
as the root directory doesn't have parent directory and the final `/b` references
a directory within the root.

In the proposed solution this is solved by forcing the request path to always
be absolute by prefixing it with `/`. Calling `path.Clean` than cleans
the path from any parent directory references which in turn prevents the
path traversal on the upstream.

One could end here and consider the issue done and solved. What I didn't
like about the solution though is the call to `strings.Trim` and the
string concatenation. Surely we can do without it.

## The final solution

As it turns out, the whole problem of request path based path traversal
on the upstream can be solved using single standard library function call.

```go
cleanPath := path.Join("/", req.URL.Path)
```

How so? `path.Join` not only joins the path parts in the variadic arguments list
but also calls `path.Clean` on the result. Thus the `path.Join("/", req.URL.Path)`
in one swift call both prefixes the request path with `/`, ensuring that the
path is absolute and will be properly cleaned, and also calls `path.Clean` on the result.

Since this behaviour of `path.Join` might not be fully intuitive, it is a good idea
to add a comment before the call stating that we rely upon the internal `path.Clean`
call. And if that isn't sufficient ensurement that the call won't be removed some time
in the future, one can go as far as adding an explicit `path.Clean` call on the result:
`path.Clean(path.Join("/", req.URL.Path))`

That's it for today. I hope you find this useful in case you are solving
an issue of similar nature.

[^1]: https://go-proverbs.github.io/

