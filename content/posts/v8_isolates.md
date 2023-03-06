---
title: "V8 Isolates in Rust"
date: 2023-03-10
slug: v8_isolates_in_rust
draft: true
tags: ["programming","writing"]
---

_V8 Isolates_ is the cool tech behind [CloudFlare Workers](https://workers.cloudflare.com/), [Deno Deploy](https://deno.com/deploy), [Fastly Compute@Edge](https://www.fastly.com/products/edge-compute), and [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions). _Isolates_ are lightweight contexts that encapsulate application data (variables and code). [V8](https://v8.dev/), the underlying javascript and WebAssembly engine, then ensures that _isolates_ are executed in a safe and isolated environment.

Let's take a look at how Isolates work by creating minimalistic  serverless functions runtime in Rust.

## Hello world

Before we dive deeper we will start with the pinnacle of engineering, the _Hello World_ program. Even though this is the longest _Hello World_ you have ever seen we aim to illustrate one important thing: the V8 engine does most of the heavy-lifting for us.[^in_go]

We will bootstrap our application by running[^bootstrap]

```sh
cargo new hello_isolate && cd hellow_isolate
```

Before we can create our first _Isolate_ and the _Hello World!_ application we will need to add our first dependency - [V8](https://crates.io/crates/v8). V8 is written in C++, the V8 cargo package provides Rust bindings.

```sh
cargo add v8
```

Lastly, we modify the `src/main.rs` file to run our _Hello World!_ application as a V8 Isolate.

```rust
use v8;

fn main() {
    let platform = v8::Platform::new(0, false).make_shared();
    v8::V8::initialize_platform(platform);
    v8::V8::initialize();

    let isolate = &mut v8::Isolate::new(v8::CreateParams::default());

    let handle_scope = &mut v8::HandleScope::new(isolate);
    let context = v8::Context::new(handle_scope);
    let scope = &mut v8::ContextScope::new(handle_scope, context);

    let code = v8::String::new(scope, "'Hello' + ' World!'").unwrap();
    let script = v8::Script::compile(scope, code, None).unwrap();

    let result = script.run(scope).unwrap();

    let result = result.to_string(scope).unwrap();
    println!("{}", result.to_rust_string_lossy(scope));
}
```
[^cleanup]

Now the _magic_, run the code and _observe_:

```sh
cargo run
```

```
   Compiling lazy_static v1.4.0
   Compiling bitflags v1.3.2
   Compiling v8 v0.63.0
   Compiling hello_isolate v0.1.0 (/Users/mat/code/github.com/matoous/hello_isolate)
    Finished dev [unoptimized + debuginfo] target(s) in 8.45s
     Running `target/debug/hello_isolate`
Hello World!
```

Not very impressive, is it? Let's break down the code and explain what's happening.

```rust
let platform = v8::Platform::new(0, false).make_shared();
v8::V8::initialize_platform(platform);
v8::V8::initialize();
```

`Platform::new(0, false)` creates new platform. The `0` if for the thread pool size. We can either specify the number of threads the V8 platform will use or pass `0` to let the V8 select the best option based on the number of available processors. The second attribute is used for enabling idle task support which we leave disabled. `V8::initialize_platform(platform)` initializes the platform and  `V8::initialize()` initializes the `V8` engine itself.

With these 3 lines we have bootstrapped the V8 engine and are ready to run out first isolate.

```rust
let isolate = &mut v8::Isolate::new(v8::CreateParams::default());
let handle_scope = &mut v8::HandleScope::new(isolate);
let context = v8::Context::new(handle_scope);
let scope = &mut v8::ContextScope::new(handle_scope, context);
```

With `v8::Isolate::new` we create new instance of an V8 isolate that will be used to run our script. _Isolate_ is the primitive of sandboxing user scripts. `v8::CreateParams` allow us to specify additional parameters for the Isolate such as mechanism for recording statistics or limiting the memory consumption by imposing maximum on the heap size.

`HandleScope` handles data for specific isolate and `Context` is used for the isolate execution. By calling `ContextScope::new(handle_scope, context);` we enter the newly created context and can compile and run our script.

```rust
let code = v8::String::new(scope, "'Hello' + ' World!'").unwrap();
let script = v8::Script::compile(scope, code, None).unwrap();
```

`String::new` allocates a new string with our code within the specific scope. And by calling `Script::compile(scope, code, None)` we compile our JavaScript code. The code will be tied to the specific `scope`.

```rust
let result = script.run(scope).unwrap();
let result = result.to_string(scope).unwrap();
println!("{}", result.to_rust_string_lossy(scope));
```

At last we run our script. We again need to pass in the same `scope` that we used for compilation. `run()` returns arbitrary (untyped) `Value`, before we use it we need to cast it to string. In rust this requires two calls. One `.to_string` call on the `Value` to convert the value to JavaScript string and the other `.to_rust_string_lossy` call to convert the JavaScript string to Rust string that we can use within our program.

Here's [repository](https://github.com/matoous/hello_isolate/) for the whole _Hello World!_ application.

## Runtime

---

* https://github.com/lagonapp/lagon

[^bootstrap]: If you don't have Rust installed yet you can use the [rustup](https://rustup.rs/) installer.
[^cf_computing]: [Cloud Computing without Containers](https://blog.cloudflare.com/cloud-computing-without-containers/)
[^winter_cg]: [WinterCG](https://wintercg.org/) - _Web-interoperable Runtimes Community Group_
[^cf_workerd]: [github.com/cloudflare/workerd](https://github.com/cloudflare/workerd)
[^in_go]: One could write similar application in Go using [github.com/rogchap/v8go](https://github.com/rogchap/v8go)
[^cleanup]: We neglect the cleanup step. To safely dispose of the V8 engine and platform add following code at the end of the script:
	```rust
	unsafe {
	    v8::V8::dispose();
	}
	v8::V8::dispose_platform();
	```
	You will need to wrap the code related to the _Isolate_ in a local context to avoid segmentation fault when disposing of the platform with an _Isolate_ still being within the context.