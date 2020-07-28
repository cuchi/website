{
    "title": "Go vs Rust: Writing a CLI tool",
    "createdAt": "2020-07-14",
    "updatedAt": "2020-07-24"
}

---META---

# Go vs Rust: Writing a CLI tool

![Go vs. Rust](https://gist.githubusercontent.com/cuchi/59255d61717e2d469263eb86cf083067/raw/6ef1a42f335022adf481fb84cabc32ac47f18679/go-vs-rust.png)

This text is about my adventure writing a small CLI application (twice) using 
two languages a had little experience with.

If you are eager to jump right into the code and compare it yourself, check it
out the [Go source](https://github.com/cuchi/hashtrack/tree/master/cli-go) and
the [Rust source](https://github.com/cuchi/hashtrack/tree/master/cli-rust).

---
## About the Project

I have a _pet project_ called Hashtrack, which is a full-stack web application I 
wrote for a technical interview. This project is rather small and it is simple 
to use:

1. You authenticate - considering you already created your account
2. You input hashtags you want to track
3. You wait for the _captured_ tweets to show on your screen

[Check it out here.](https://hashtrack.herokuapp.com/)

After my interview, I kept improving this project just for fun, and I noticed
that it could be a perfect place to test my skills by implementing a CLI tool. I
already had the server, so I just needed to pick a language to implement a small
set of features under my project's API.

## Features

- `hashtrack login` - Creates a session token and store it in the local
  filesystem in a config file.
- `hashtrack logout` - Remove the locally stored session token.
- `hashtrack track <hashtag> [...]` - Tracks one or more hashtags.
- `hashtrack untrack <hashtag> [...]` - Untracks one or more previously tracked
hashtags.
- `hashtrack tracks` - Displays the hashtags you are tracking.
- `hashtrack list` - Displays the latest 50 captured tweets.
- `hashtrack watch` - Stream and display the captured tweets in real-time.
- `hashtrack status` - Displays who you are, if logged in.
- Should have an `--endpoint` option to point the CLI to another server.
- Should have a `--config` option to load a custom config file.
- This config file could also share the `endpoint` property.

What we have to know beforehand:
- The CLI should use the project's API, which is GraphQL under HTTP +
WebSockets.
- The CLI should use the filesystem to store a config file.
- The CLI should parse positional arguments and flags.

## How did I end up using Go and Rust?

There is a large set of languages you can use to write CLI tools.

In this case, I wanted a language I had little or no prior experience with, I 
also wanted one that could easily compile to a native executable, which is a 
nice perk to have on a CLI tool.

My first obvious choice was Go, for some reason. But I also had little 
experience with Rust, and I saw it could also be a good fit for this project.

So... why not both? Since my main objective here is to learn, could be a great
opportunity to implement this project twice and find what are the _pros and
cons_ of each one from my point of view.

>Honorable mentions to [Crystal](https://crystal-lang.org/) and
[Nim](https://nim-lang.org/), those were very promising options too. I'm looking
forward to learn about them in another pet project.

## Local environment
The first thing I look when using a new toolset is whether it has an easy way to
make it available for my user, without using the distribution package manager to
install it system-wide. We are talking about version managers, they make our
life easier by installing the tools in a user-wide manner instead of
system-wide. [NVM](https://github.com/nvm-sh/nvm) for Node.js does it very well.

When using Go, there is the [GVM](https://github.com/moovweb/gvm) project which
handles the local install & version management, and it is easy to setup:

```bash
gvm install go1.14 -B
gvm use go1.14
```

There are also two environment variables we need to know, they are `GOROOT` and
`GOPATH` -- You can read more about them 
[here](https://www.jetbrains.com/help/go/configuring-goroot-and-gopath.html).

The first _problem_ I found using Go, was when I was figuring out how the module
resolution worked along with the `GOPATH`, it became quite frustrating to
set up a project structure with a functional local development environment.

In the end, I just used `GOPATH=$(pwd)` in my project's directory, the main perk
was to have a per-project dependency setup, like a `node_modules`. It worked
well.

>After finishing my project, I found out that
[virtualgo](https://github.com/GetStream/vg) existed and would solve my problems
with `GOPATH`.

Rust has an official project called [rustup](https://rustup.rs/), which manages
the Rust installation, also known as _toolchain_. It can be easily set up with a
one-liner. Also, there is a set of optional components using `rustup`,
such as the [rls](https://github.com/rust-lang/rls) and 
[rustfmt](https://github.com/rust-lang/rustfmt).
Many projects require a _nightly_ version of the Rust toolchain, with `rustup`
there was no problem switching between the versions.

### Editor Support
For both of the languages, editor tooling was flawless, as a VSCode user, I can
find extensions for both Go and Rust in the marketplace.

When debugging with Rust, I had to install the
[CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb)
extension after following 
[this tutorial](https://www.forrestthewoods.com/blog/how-to-debug-rust-with-visual-studio-code/).

## Package management
Go doesn't have a package manager or even an official registry. Instead, its
module resolution works in a way you can import them from external URLs.

For dependency management, Rust uses the Cargo, which downloads and compiles
dependencies from [crates.io](https://crates.io/), which is the official
registry for Rust packages. Packages inside the Crates ecosystem can also have
their documentation available in [docs.rs](https://docs.rs)

## Libraries
My first objective was to see how easy could be to implement a simple GraphQL
query/mutation over HTTP.

For the Go language, I found some libraries, like 
[machinebox/graphql](https://github.com/machinebox/graphql) and
[shurcooL/graphql](https://github.com/shurcooL/graphql), the second one uses
structs for (un) marshaling the data, that is what made me stick to it.

> I used a fork of shurcooL/graphql, because I needed to set the
> `Authorization` header in the client, the changes are in
[this pull request](https://github.com/shurcooL/graphql/pull/48).

This is the Go example of an raphQL mutation call:
```go
type creationMutation struct {
    CreateSession struct {
        Token graphql.String
    } `graphql:"createSession(email: $email, password: $password)"`
}

type CreationPayload struct {
    Email    string
    Password string
}

func Create(client *graphql.Client, payload CreationPayload) (string, error) {
    var mutation creationMutation
    variables := map[string]interface{}{
        "email":    graphql.String(payload.Email),
        "password": graphql.String(payload.Password),
    }
    err := client.Mutate(context.Background(), &mutation, variables)

    return string(mutation.CreateSession.Token), err
}

```

In Rust, I had to use two libraries to make GraphQL calls. That is because
`graphql_client` is protocol-agnostic, it only focuses on code generation for
serializing and deserializing data. So I needed a second library (`reqwest`) to
take care of the HTTP requests.

```rust
#[derive(GraphQLQuery)]
#[graphql(
    schema_path = "graphql/schema.graphql",
    query_path = "graphql/createSession.graphql"
)]
struct CreateSession;

pub struct Session {
    pub token: String,
}

pub type Creation = create_session::Variables;

pub async fn create(context: &Context, creation: Creation) -> Result<Session, api::Error> {
    let res = api::build_base_request(context)
        .json(&CreateSession::build_query(creation))
        .send()
        .await?
        .json::<Response<create_session::ResponseData>>()
        .await?;
    match res.data {
        Some(data) => Ok(Session {
            token: data.create_session.token,
        }),
        _ => Err(api::Error(api::get_error_message(res).to_string())),
    }
}
```

Neither of the libraries for Go and Rust had any implementation for GraphQL via
WebSocket protocol.

In fact, `graphql_client` for Rust supports _Subscriptions_, but since it is
protocol-agnostic, I had to implement the whole GraphQL WebSocket communication
on my own, 
[check it out](https://github.com/cuchi/hashtrack/blob/b5a75f4368837cd51c621b6560a03e1835ec4e5b/cli-rust/src/tweet.rs#L90).

To use WebSockets in the Go version, the library should be modified to support
the protocol. Since I was already using a fork of the library, I didn't feel
like doing it. Instead, I used a poor man's way of "watching" the new tweets,
which was to request the API every 5 seconds to retrieve them,
[I'm not proud of it](https://github.com/cuchi/hashtrack/blob/b5a75f4368837cd51c621b6560a03e1835ec4e5b/cli-go/src/hashtrack/tweets/tweets.go#L65).

Using Go, there is the `go` keyword to spawn a lightweight thread, also called
_goroutine_. In contrast, Rust uses operating system threads by calling a
`Thread::spawn`. Besides that, both implementations use channels to transfer
objects between their threads.

## Error handling

In Go, errors are treated just like any other value. The common way to handle
errors in Go is to just check if they are present.
```go
func (config *Config) Save() error {
	contents, err := json.MarshalIndent(config, "", "    ")
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(config.path, contents, 0o644)
	if err != nil {
		return err
	}

	return nil
}
```

Rust has the `Result<T, E>` enum, which can encapsulate an `Ok(T)` for success,
or an `Err(E)` for errors. It also has the `Option<T>` enum, with `Some(T)` or
`None`. If you are familiar with Haskell, you may recognize
those as the `Either` and the `Maybe` monads.

There is also a syntactic sugar for error propagation (the `?` operator) that
resolves the value from the `Result` or `Option` structure, automatically
returning `Err(...)` or `None` when something goes bad.


```rust
pub fn save(&mut self) -> io::Result<()> {
    let json = serde_json::to_string(&self.contents)?;
    let mut file = File::create(&self.path)?;
    file.write_all(json.as_bytes())
}
```
The code above is the equivalent of
```rust
pub fn save(&mut self) -> io::Result<()> {
    let json = match serde_json::to_string(&self.contents) {
        Ok(json) => json,
        Err(e) => return Err(e)
    };
    let mut file = match File::create(&self.path) {
        Ok(file) => file,
        Err(e) => return Err(e)
    };
    file.write_all(json.as_bytes())
}
```
Rust has:
- monadic constructs (`Option` & `Result`)
- the error propagation operator
- the `From` trait, to automatically convert errors on propagation

The combination of the three features above makes up the best error handling
solution a saw in a language, being simple, sound, and maintainable at the same
time.

## Compilation time
Go is built with fast compilation time as a critical requirement, let's see:
```bash
> time go get hashtrack # Install dependencies
go get hashtrack  1,39s user 0,41s system 43% cpu 4,122 total

> time go build -o hashtrack hashtrack # First time
go build -o hashtrack hashtrack  0,80s user 0,12s system 152% cpu 0,603 total

> time go build -o hashtrack hashtrack # Second time
go build -o hashtrack hashtrack  0,19s user 0,07s system 400% cpu 0,065 total

> time go build -o hashtrack hashtrack # Made a change
go build -o hashtrack hashtrack  0,94s user 0,13s system 169% cpu 0,629 total
```

That's impressive, let's see how Rust does this:

```bash
> time cargo build
   Compiling libc v0.2.67
   Compiling cfg-if v0.1.10
   Compiling autocfg v1.0.0
   ...
   ...
   ...
   Compiling hashtrack v0.1.0 (/home/paulo/code/cuchi/hashtrack/cli-rust)
    Finished dev [unoptimized + debuginfo] target(s) in 1m 44s
cargo build  363,80s user 17,05s system 365% cpu 1:44,09 total
```
It compiled all the dependencies, which are 214 modules in total. When we run it
again, everything is already compiled, so it runs instantly:
```bash
> time cargo build # Second time
    Finished dev [unoptimized + debuginfo] target(s) in 0.08s
cargo build  0,07s user 0,03s system 104% cpu 0,094 total

> time cargo build # Made a change
   Compiling hashtrack v0.1.0 (/home/paulo/code/cuchi/hashtrack/cli-rust)
    Finished dev [unoptimized + debuginfo] target(s) in 3.15s
cargo build  3,01s user 0,52s system 111% cpu 3,162 total
```
As you can see, Rust uses an incremental compilation model, which partially
recompiles the module dependency tree, starting from changed modules until it
propagates into its dependents.

If you are doing a release build, it takes longer, which is expected because of
the optimization tasks the compiler do internally:
```bash
> time cargo build --release
   Compiling libc v0.2.67
   Compiling cfg-if v0.1.10
   Compiling autocfg v1.0.0
   ...
   ...
   ...
   Compiling hashtrack v0.1.0 (/home/paulo/code/cuchi/hashtrack/cli-rust)
    Finished release [optimized] target(s) in 2m 42s
cargo build --release  1067,72s user 16,95s system 667% cpu 2:42,45 total
```

### Continuous Integration
As you would expect, the time differences show up on the CI workflow:
![Go CI Results](https://gist.githubusercontent.com/cuchi/59255d61717e2d469263eb86cf083067/raw/6ef1a42f335022adf481fb84cabc32ac47f18679/ci-go.png)
![Rust CI Results](https://gist.githubusercontent.com/cuchi/59255d61717e2d469263eb86cf083067/raw/6ef1a42f335022adf481fb84cabc32ac47f18679/ci-rust.png)

## Memory usage
To measure memory usage, I used `/usr/bin/time -v ./hashtrack list` for each of
the versions. `time -v` displays a lot of interesting info, but here we are
looking for the **Maximum resident set size** of the process, which is the peak
amount of allocated physical memory during the execution.
```bash
for n in {1..5}; do 
    /usr/bin/time -v ./hashtrack list > /dev/null 2>> time.log
done
grep 'Maximum resident set size' time.log
```

### Go
```
	Maximum resident set size (kbytes): 13632
	Maximum resident set size (kbytes): 14016
	Maximum resident set size (kbytes): 14244
	Maximum resident set size (kbytes): 13648
	Maximum resident set size (kbytes): 14500
```

### Rust
```
	Maximum resident set size (kbytes): 9840
	Maximum resident set size (kbytes): 10068
	Maximum resident set size (kbytes): 9972
	Maximum resident set size (kbytes): 10032
	Maximum resident set size (kbytes): 10072
```

This memory usage accounts for the task of:
- interpreting system arguments
- loading & parsing a configuration file from the filesystem
- calling GraphQL over HTTP over TLS
- parsing a JSON response
- writing the formatted data to `stdout`

Both languages have different ways to manage memory and allocations. 

Go has a garbage collector, which is a common way to track down unused heap
memory and reclaim it instead of doing this manually. Since garbage collectors
are a composition of heuristics, there are always tradeoffs, generally between
performance and memory usage.

Rust memory model has concepts like _ownership_, _borrowing_, and _lifetimes_,
which not only helps with memory safety, but also guarantee total control of
the program heap memory without manual management or a garbage collector.

For comparison, let's take some other executables which do a rather _similar_
task:
| Command                               | Maximum resident set size (kbytes) |
|---------------------------------------|------------------------------------|
| `heroku apps`                         | 56436                              | 
| `gh pr list`                          | 26456                              |
| `git ls-remote` (With a SSH remote)   | 6448                               |
| `git ls-remote` (With a HTTPS remote) | 23488                              |


## Conclusion
They were both very great tools for the job. But of course, they have different
priorities. On one side, we have an option which tries to keep software
development simple, maintainable, and accessible. On the other hand, we have a
language focused on soundness, safety, and performance.

### Reasons I would use Go
- I want a very simple language for my teammates to learn
- I want little flexibility, to write plain and simple code
- If I build exceptionally/mostly for Linux
- If compilation time is an issue
- I want mature asynchronous semantics

### Reasons I would use Rust
- I want state-of-the-art error handling for my code
- I want a multi-paradigm language which lets me write more expressive code
- If the project has critical requirements about security
- If the project has critical requirements about performance
- If the project targets many operating systems and I want a truly 
multiplatform codebase

There are some details from both of the languages that still triggers me.
- Go focus **so much** on being simple that it has the opposite effect sometimes
(like `GOROOT` and `GOPATH`, for example).
- I still don't understand very well how lifetimes work in Rust, and it can get
  quite frustrating if you ever try to deal with it.

From a personal perspective, both were very fun to learn, and are a great
addition in a world of C and C++. They provide a broader range of
applications, like web services and even
[front-end web frameworks](https://github.com/yewstack/yew), thanks to 
WebAssembly :)

If you want another comparison between the two languages that is far in-depth
than this one, check out
[this article](https://fasterthanli.me/articles/i-want-off-mr-golangs-wild-ride)
from [fasterthanlime](https://twitter.com/fasterthanlime).
