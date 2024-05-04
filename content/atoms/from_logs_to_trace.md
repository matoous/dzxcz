---
title: From logs to traces
date: 2024-05-01
---

At SumUp we heavily rely on [Opentelemetry](https://opentelemetry.io/) tracing and [Honeycomb](https://www.honeycomb.io/) for observability. Traces are, in my opinion, far superior tool for debugging and analysis than logs. Yet, there's time and place for everything and sometimes you need to log (e.g. gracfully ignored errors). In such cases, it's helpful to be able to move between logs and traces. With [`slog`](https://go.dev/blog/slog) (and probably any other structured logging library that supports `context.Context`) this becomes metter of 20 lines of code:

```go
type otelLogHandler struct {
	slog.Handler
}

// WithOTEL wraps the slog handler with OTEL handler that extracts and populates trace and span information
// on the log.
func WithOTEL(h slog.Handler) slog.Handler {
	return &otelLogHandler{h}
}

func (h *otelLogHandler) Handle(ctx context.Context, r slog.Record) error {
	spanCtx := trace.SpanContextFromContext(ctx)

	if spanCtx.IsValid() {
		r.AddAttrs(
			slog.String("trace.trace_id", spanCtx.TraceID().String()),
			slog.String("trace.span_id", spanCtx.SpanID().String()),
		)
	}

	return h.Handler.Handle(ctx, r)
}
```

Then when initializing your `slog.Handler`:

```go
logger := slog.New(WithOTEL(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
	AddSource: true,
	Level:     logLevel,
})))
```

and you are good to go as long as you use `slog.ErrorContext` (and alternatives for other verbosity levels).
