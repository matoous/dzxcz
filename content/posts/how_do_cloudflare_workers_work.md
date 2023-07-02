---
title: "How do CloudFlare Workers work?"
date: 2023-03-08
slug: how_do_cloudflare_workers_work
draft: false
tags: ["programming","writing"]
---

_V8 Isolates_ is the cool tech behind [CloudFlare Workers](https://workers.cloudflare.com/). The same technology powers [Deno Deploy](https://deno.com/deploy), [Fastly Compute@Edge](https://www.fastly.com/products/edge-compute), [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions), and more. _Isolates_ are lightweight contexts that encapsulate application data (variables and code). [V8](https://v8.dev/), the underlying javascript and WebAssembly engine, then ensures that _isolates_ are executed in a safe and isolated environment.

Let's take a look at how CloudFlare workers work by creating minimal serverless functions runtime in Rust.

## Hello world

Before we dive deeper we will start with the pinnacle of engineering, the _Hello World_ program. Even though this is the longest _Hello World_ you have ever seen we aim to illustrate one important thing: the V8 engine does most of the heavy-lifting for us.

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

_Hello world_ is neat, but one does not build a product on top of hello world. To get something useful out of the _Isolates_ we need _runtime_. Runtime provides the well known JavaScript _APIs_ that we are used to, such as `fetch` or `Web Crypto`.[^runtime]

Let's rework our example by providing _runtime_ for the scripts, shall we? And while at it, we will move from _script_ towards the notion of a _worker_ that exposes _handler_ function that can be repeatedly called by our application.

First, we will create a helper function that will setup the _runtime_ by creating bindings. Bindings allow us to call Rust functions from the JavaScript code of the worker.

```rust
fn setup_runtime(isolate: &mut v8::OwnedIsolate) -> v8::Global<v8::Context> {
    let isolate_scope = &mut v8::HandleScope::new(isolate);
    let globals = v8::ObjectTemplate::new(isolate_scope);
    let resource_name = v8::String::new(isolate_scope, "sayHello").unwrap().into();
    globals.set(
        resource_name,
        v8::FunctionTemplate::new(isolate_scope, say_hello_binding).into(),
    );
    let global_context = v8::Context::new_from_template(isolate_scope, globals);
    v8::Global::new(isolate_scope, global_context)
}
```

Our `setup_runtime` function will take the _Isolate_, create an object for globals on which we will define our runtime APIs, and return a _Context_ with the runtime that can be used for the code execution.

```rust
pub fn say_hello_binding(
    scope: &mut v8::HandleScope,
    args: v8::FunctionCallbackArguments,
    mut retval: v8::ReturnValue,
) {
    let to = args.get(0).to_rust_string_lossy(scope);
    let hello = v8::String::new(scope, format!("Hello {}!", to).as_str())
        .unwrap()
        .into();
    retval.set(hello);
}
```

We have defined single runtime function called `sayHello`. Above we have its Rust binding. The function takes the first argument (expecting it to be a string) and returns new string with `Hello {argument}!`.

Next, we will create a function for building our worker. In the initial _Hello World_ example we simply executed the provided script. What we want to do instead is compile the worker as a module and call a handler function that it exports.

```rust
fn build_worker(
    script: &str,
    worker_scope: &mut v8::HandleScope,
    global: &v8::Global<v8::Context>,
) -> v8::Global<v8::Function> {
    let code = v8::String::new(worker_scope, script).unwrap();
    let resource_name = v8::String::new(worker_scope, "script.js").unwrap().into();
    let source_map_url = v8::String::new(worker_scope, "placeholder").unwrap().into();
    let source = v8::script_compiler::Source::new(
        code,
        Some(&v8::ScriptOrigin::new(
            worker_scope,
            resource_name,
            0,
            0,
            false,
            i32::from(0),
            source_map_url,
            false,
            false,
            true,
        )),
    );
    let module = v8::script_compiler::compile_module(worker_scope, source).unwrap();
    module.instantiate_module(worker_scope, |_, _, _, _| None);
    module.evaluate(worker_scope);

    let global = global.open(worker_scope);
    let global = global.global(worker_scope);
    let handler_key = v8::String::new(worker_scope, "workerHandler").unwrap();
    let js_handler = global.get(worker_scope, handler_key.into()).unwrap();
    let local_handler = v8::Local::<v8::Function>::try_from(js_handler).unwrap();
    v8::Global::new(worker_scope, local_handler)
}
```

`build_worker` function compiles the worker as a module, instantiates it, evaluates the module and its dependencies, and finally obtains global reference to the `workerHandler` function from the module that we can call outside the local context of the script.

Last missing part in this puzzle is executing our worker (calling the exported _handle_ function). For that we will define `run_worker` function that takes the worker, V8 execution scope, and reference to the global context.

```rust
pub fn run_worker(
    worker: v8::Global<v8::Function>,
    scope: &mut v8::HandleScope,
    global: &v8::Global<v8::Context>,
) {
    let handler = worker.open(scope);
    let global = global.open(scope);
    let global = global.global(scope);

    let param = v8::String::new(scope, "World").unwrap().into();
    match handler.call(scope, global.into(), &[param]) {
        Some(response) => {
            let result = v8::Local::<v8::String>::try_from(response)
                .expect("Handler did not return a string");
            let result = result.to_string(scope).unwrap();
            println!("{}", result.to_rust_string_lossy(scope));
        }
        None => todo!(),
    };
}
```

With this setup we expect our worker, that is the _handler_ that it exposes, to accept a string as a parameter and return a string. In CloudFlare Workers or Deno deploy your function would usually be called with a _Request_ and would be expected to return a _Response_.

Now we put all of the above together to have a complete example.

```rust
fn main() {
    let platform = v8::Platform::new(0, false).make_shared();
    v8::V8::initialize_platform(platform);
    v8::V8::initialize();

    let runtime = include_str!("runtime.js");

    let worker_script = r#"
export function handler(y) {
    return sayHello(y);
};
"#;

    let script = format!(
        r#"
{runtime}
{worker_script}
"#
    );

    {
        let mut isolate = v8::Isolate::new(v8::CreateParams::default());
        let global = setup_runtime(&mut isolate);
        let worker_scope = &mut v8::HandleScope::with_context(isolate.as_mut(), global.clone());
        let handler = build_worker(script.as_str(), worker_scope, &global);
        run_worker(handler, worker_scope, &global);
    }

    unsafe {
        v8::V8::dispose();
    }
    v8::V8::dispose_platform();
}
```

The script that we compile consists of JavaScript runtime provided by us and the worker script that would in real world scenario be provided by the user. Our javascript runtime is 3 lines of code the help us expose the provided handler from the global scope.

```
globalThis.workerHandler = (x) => { 
    return handler(x)
}
```

We can run our application again with the above changes a get a underwhelming:

```
   Compiling hello_isolate v0.1.0 (/Users/admin/code/github.com/matoous/hello_isolate)
    Finished dev [unoptimized + debuginfo] target(s) in 2.17s
     Running `target/debug/hello_isolate`
Hello World!
```

This is as far from _production ready_ as it gets but at this point we have shown the very basics of serverless JavaScript execution. In short, serverless javascript is executed in lightweight _Isolates_ that ensure that the worker has access only to its own code and data. Servers that run the workers are responsible for providing _runtime_ and running the _isolates_.

## Wrap

If I did well enough, this article illustrates that at the core serverless JavaScript execution using the V8 engine isn't complex. Most of the work is providing specification-compliant runtime APIs and implementing and operating the server itself. CloudFlare workers provide additional features such as automatically providing their other products in the runtime[^workers_runtime] (KV, R2).

Big part of serveless JavaScript that we completely skipped here is the security. I don't have enough knowledge to share more on that topic but CloudFlare has a [Mitigating Spectre and Other Security Threats: The Cloudflare Workers Security Model](https://blog.cloudflare.com/mitigating-spectre-and-other-security-threats-the-cloudflare-workers-security-model/) blog post that dives into this topic and further illustrates the setup used by CloudFlare workers.

CloudFlare [opensourced](https://blog.cloudflare.com/workerd-open-source-workers-runtime/) their workers runtime 4 years after their [first announcement](https://blog.cloudflare.com/cloud-computing-without-containers/) of Workers. Deno itself has a guide on [creating your own JavaScript runtime](https://deno.com/blog/roll-your-own-javascript-runtime) that uses the Deno crate that hides a lot of the complexities of V8 behind clean API. Another open-source implementation is [lagon](https://github.com/lagonapp/lagon), a fairly new project that has many features yet is still easy to read.

Furthermore, if Rust is not your language of choice you can try and replicate the _Hello World!_ application in Go using [github.com/rogchap/v8go](https://github.com/rogchap/v8go).

---

You can find the whole _Hello World!_ example at [github.com/matoous/hello_isolate](https://github.com/matoous/hello_isolate/) and the second part with runtime under the [hello-runtime](https://github.com/matoous/hello_isolate/tree/hello-runtime) branch.

Keep in mind that this was written to the best of _my_ knowledge and there might be factual mistakes, bugs, or completely neglected topics. If you find any of such, please let me know. Points of contact and GitHub link to this file are in the footer.

Links:

- [Running JavaScript in Rust with Deno](https://austinpoor.com/blog/js-in-rs).

[^bootstrap]: If you don't have Rust installed yet you can use the [rustup](https://rustup.rs/) installer.
[^runtime]: While most services follow the WHATWG and W3C specifications for JavaScript runtime APIs there's larger standardization effort led by [WinterCG](https://wintercg.org/) - _Web-interoperable Runtimes Community Group_.
[^cleanup]: We neglect the cleanup step. To safely dispose of the V8 engine and platform add following code at the end of the script:
	```rust
	unsafe {
	    v8::V8::dispose();
	}
	v8::V8::dispose_platform();
	```
	You will need to wrap the code related to the _Isolate_ in a local context to avoid segmentation fault when disposing of the platform with an _Isolate_ still being within the context.
[^workers_runtime]: [CloudFlare Workers Runtime APIs](https://developers.cloudflare.com/workers/runtime-apis/)
