---
title: "Go vs Rust: Escrevendo uma ferramenta CLI"
date: 2020-07-14
updated: 2020-08-04
layout: post
tags: posts
permalink: /pt-br/posts/go-vs-rust/
description: "Uma comparação prática entre Go e Rust para desenvolver ferramentas CLI — cobrindo tratamento de erros, tempo de compilação, uso de memória e experiência do desenvolvedor."
---

![Go vs. Rust](https://gist.githubusercontent.com/cuchi/59255d61717e2d469263eb86cf083067/raw/6ef1a42f335022adf481fb84cabc32ac47f18679/go-vs-rust.png)

Este texto é sobre minha aventura escrevendo uma pequena aplicação CLI (duas vezes) usando duas linguagens com as quais eu tinha pouca experiência.

Se você está ansioso para ir direto ao código e comparar por si mesmo, confira o [código Go](https://github.com/cuchi/hashtrack/tree/master/cli-go) e o [código Rust](https://github.com/cuchi/hashtrack/tree/master/cli-rust).

---
## Sobre o Projeto

Eu tenho um _projeto pessoal_ chamado Hashtrack, que é uma aplicação web full-stack que escrevi para uma entrevista técnica. Este projeto é bem pequeno e simples de usar:

1. Você se autentica — considerando que já criou sua conta
2. Você insere hashtags que quer acompanhar
3. Você espera os tweets _capturados_ aparecerem na sua tela

[Confira aqui.](https://hashtrack.herokuapp.com/)

Depois da entrevista, continuei melhorando este projeto por diversão, e percebi que ele poderia ser o lugar perfeito para testar minhas habilidades implementando uma ferramenta CLI. Eu já tinha o servidor, então só precisava escolher uma linguagem para implementar um pequeno conjunto de funcionalidades usando a API do meu projeto.

## Funcionalidades

- `hashtrack login` - Cria um token de sessão e o armazena no sistema de arquivos local em um arquivo de configuração.
- `hashtrack logout` - Remove o token de sessão armazenado localmente.
- `hashtrack track <hashtag> [...]` - Acompanha uma ou mais hashtags.
- `hashtrack untrack <hashtag> [...]` - Para de acompanhar uma ou mais hashtags previamente rastreadas.
- `hashtrack tracks` - Exibe as hashtags que você está acompanhando.
- `hashtrack list` - Exibe os 50 tweets capturados mais recentes.
- `hashtrack watch` - Transmite e exibe os tweets capturados em tempo real.
- `hashtrack status` - Exibe quem você é, se estiver logado.
- Deve ter uma opção `--endpoint` para apontar a CLI para outro servidor.
- Deve ter uma opção `--config` para carregar um arquivo de configuração personalizado.
- Este arquivo de configuração também pode compartilhar a propriedade `endpoint`.

O que precisamos saber de antemão:
- A CLI deve usar a API do projeto, que é GraphQL sobre HTTP + WebSockets.
- A CLI deve usar o sistema de arquivos para armazenar um arquivo de configuração.
- A CLI deve interpretar argumentos posicionais e flags.

## Como acabei usando Go e Rust?

Há um grande conjunto de linguagens que você pode usar para escrever ferramentas CLI.

Neste caso, eu queria uma linguagem com a qual eu tivesse pouca ou nenhuma experiência prévia. Também queria uma que pudesse compilar facilmente para um executável nativo, o que é uma vantagem interessante para uma ferramenta CLI.

Minha primeira escolha óbvia foi Go, talvez porque muitas ferramentas CLI que uso são implementadas com ela. Mas eu também tinha pouca experiência com Rust, e vi que também poderia ser uma boa opção para este projeto.

Então... por que não ambos? Já que meu principal objetivo aqui é aprender, poderia ser uma ótima oportunidade implementar este projeto duas vezes e descobrir quais são os _prós e contras_ de cada um do meu ponto de vista.

>Menções honrosas para [Crystal](https://crystal-lang.org/) e [Nim](https://nim-lang.org/), que eram opções muito promissoras também. Estou ansioso para aprender sobre elas em outro projeto pessoal.

## Ambiente local

A primeira coisa que procuro ao usar um novo conjunto de ferramentas é se há uma maneira fácil de disponibilizá-lo para meu usuário, sem usar o gerenciador de pacotes da distribuição para instalá-lo no sistema todo. Estamos falando de gerenciadores de versão, que facilitam nossa vida instalando as ferramentas em nível de usuário em vez de sistema. O [NVM](https://github.com/nvm-sh/nvm) para Node.js faz isso muito bem.

Ao usar Go, existe o projeto [GVM](https://github.com/moovweb/gvm) que cuida da instalação local e gerenciamento de versão, e é fácil de configurar:

```bash
gvm install go1.14 -B
gvm use go1.14
```

Também há duas variáveis de ambiente que precisamos conhecer: `GOROOT` e `GOPATH` — você pode ler mais sobre elas [aqui](https://www.jetbrains.com/help/go/configuring-goroot-and-gopath.html).

O primeiro _problema_ que encontrei usando Go foi quando estava tentando entender como a resolução de módulos funcionava junto com o `GOPATH`. Foi bastante frustrante configurar uma estrutura de projeto com um ambiente de desenvolvimento local funcional.

No final, acabei usando `GOPATH=$(pwd)` no diretório do meu projeto. A principal vantagem foi ter uma configuração de dependências por projeto, como um `node_modules`. Funcionou bem.

>Depois de terminar meu projeto, descobri que o [virtualgo](https://github.com/GetStream/vg) existia e resolveria meus problemas com `GOPATH`.

Rust tem um projeto oficial chamado [rustup](https://rustup.rs/), que gerencia a instalação do Rust, também conhecida como _toolchain_. Pode ser facilmente configurado com um one-liner. Além disso, há um conjunto de componentes opcionais usando `rustup`, como o [rls](https://github.com/rust-lang/rls) e o [rustfmt](https://github.com/rust-lang/rustfmt). Muitos projetos exigem uma versão _nightly_ da toolchain do Rust. Com `rustup`, não houve problema em alternar entre as versões.

### Suporte ao Editor

Para ambas as linguagens, as ferramentas de editor foram impecáveis. Como usuário do VSCode, posso encontrar extensões tanto para Go quanto para Rust no marketplace.

Ao depurar com Rust, precisei instalar a extensão [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb) depois de seguir [este tutorial](https://www.forrestthewoods.com/blog/how-to-debug-rust-with-visual-studio-code/).

## Gerenciamento de pacotes

Go não tem um gerenciador de pacotes ou mesmo um registro oficial. Em vez disso, sua resolução de módulos funciona de uma maneira que você pode importá-los de URLs externas.

Para gerenciamento de dependências, Rust usa o Cargo, que baixa e compila dependências do [crates.io](https://crates.io/), que é o registro oficial de pacotes Rust. Pacotes dentro do ecossistema Crates também podem ter sua documentação disponível em [docs.rs](https://docs.rs).

## Bibliotecas

Meu primeiro objetivo foi ver quão fácil seria implementar uma simples consulta/mutation GraphQL sobre HTTP.

Para a linguagem Go, encontrei algumas bibliotecas, como [machinebox/graphql](https://github.com/machinebox/graphql) e [shurcooL/graphql](https://github.com/shurcooL/graphql). A segunda usa structs para (des)serializar os dados, e foi isso que me fez escolhê-la.

> Usei um fork da shurcooL/graphql porque precisava definir o header `Authorization` no cliente. As alterações estão [neste pull request](https://github.com/shurcooL/graphql/pull/48).

Este é o exemplo em Go de uma chamada de mutation GraphQL:

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

Em Rust, precisei usar duas bibliotecas para fazer chamadas GraphQL. Isso porque `graphql_client` é agnóstico a protocolo, focando apenas na geração de código para serializar e desserializar dados. Então precisei de uma segunda biblioteca (`reqwest`) para cuidar das requisições HTTP.

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

Nenhuma das bibliotecas para Go e Rust tinha implementação para GraphQL via protocolo WebSocket.

Na verdade, `graphql_client` para Rust suporta _Subscriptions_, mas como é agnóstico a protocolo, precisei implementar toda a comunicação GraphQL WebSocket por conta própria. [Confira aqui](https://github.com/cuchi/hashtrack/blob/b5a75f4368837cd51c621b6560a03e1835ec4e5b/cli-rust/src/tweet.rs#L90).

Para usar WebSockets na versão Go, a biblioteca precisaria ser modificada para suportar o protocolo. Como eu já estava usando um fork da biblioteca, não tive vontade de fazer isso. Em vez disso, usei uma forma gambiarra de "assistir" aos novos tweets, que era requisitar a API a cada 5 segundos para recuperá-los. [Não tenho orgulho disso](https://github.com/cuchi/hashtrack/blob/b5a75f4368837cd51c621b6560a03e1835ec4e5b/cli-go/src/hashtrack/tweets/tweets.go#L65).

Usando Go, existe a palavra-chave `go` para criar uma thread leve, também chamada de _goroutine_. Em contraste, Rust usa threads do sistema operacional chamando `Thread::spawn`. Além disso, ambas as implementações usam canais para transferir objetos entre suas threads.

## Tratamento de erros

Em Go, erros são tratados como qualquer outro valor. A maneira comum de lidar com erros em Go é simplesmente verificar se eles estão presentes.

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

Rust tem o enum `Result<T, E>`, que pode encapsular um `Ok(T)` para sucesso, ou um `Err(E)` para erros. Também tem o enum `Option<T>`, com `Some(T)` ou `None`. Se você conhece Haskell, pode reconhecer esses como as mônadas `Either` e `Maybe`.

Também há um açúcar sintático para propagação de erros (o operador `?`) que resolve o valor da estrutura `Result` ou `Option`, retornando automaticamente `Err(...)` ou `None` quando algo dá errado.

```rust
pub fn save(&mut self) -> io::Result<()> {
    let json = serde_json::to_string(&self.contents)?;
    let mut file = File::create(&self.path)?;
    file.write_all(json.as_bytes())
}
```

O código acima é o equivalente a:

```rust
pub fn save(&mut self) -> io::Result<()> {
    let json = match serde_json::to_string(&self.contents) {
        Ok(json) => json,
        Err(e) => return Err(e.into())
    };
    let mut file = match File::create(&self.path) {
        Ok(file) => file,
        Err(e) => return Err(e.into())
    };
    file.write_all(json.as_bytes())
}
```

Rust tem:
- construções monádicas (`Option` e `Result`)
- o operador de propagação de erros
- a trait `From`, para converter erros automaticamente na propagação

A combinação dos três recursos acima forma a melhor solução de tratamento de erros que já vi em uma linguagem, sendo simples, sólida e fácil de manter ao mesmo tempo.

## Tempo de compilação

Go é construído com tempo de compilação rápido como um requisito crítico. Vejamos:

```bash
> time go get hashtrack # Instalar dependências
go get hashtrack  1,39s user 0,41s system 43% cpu 4,122 total

> time go build -o hashtrack hashtrack # Primeira vez
go build -o hashtrack hashtrack  0,80s user 0,12s system 152% cpu 0,603 total

> time go build -o hashtrack hashtrack # Segunda vez
go build -o hashtrack hashtrack  0,19s user 0,07s system 400% cpu 0,065 total

> time go build -o hashtrack hashtrack # Após uma alteração
go build -o hashtrack hashtrack  0,94s user 0,13s system 169% cpu 0,629 total
```

Isso é impressionante. Vejamos como Rust se sai:

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

Compilou todas as dependências, que são 214 módulos no total. Quando executamos novamente, tudo já está compilado, então roda instantaneamente:

```bash
> time cargo build # Segunda vez
    Finished dev [unoptimized + debuginfo] target(s) in 0.08s
cargo build  0,07s user 0,03s system 104% cpu 0,094 total

> time cargo build # Após uma alteração
   Compiling hashtrack v0.1.0 (/home/paulo/code/cuchi/hashtrack/cli-rust)
    Finished dev [unoptimized + debuginfo] target(s) in 3.15s
cargo build  3,01s user 0,52s system 111% cpu 3,162 total
```

Como você pode ver, Rust usa um modelo de compilação incremental, que recompila parcialmente a árvore de dependências dos módulos, começando dos módulos alterados até se propagar para seus dependentes.

Se você estiver fazendo um build de release, leva mais tempo, o que é esperado por causa das tarefas de otimização que o compilador faz internamente:

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

### Integração Contínua

Como você pode imaginar, as diferenças de tempo aparecem no workflow de CI:

![Resultados CI Go](https://gist.githubusercontent.com/cuchi/59255d61717e2d469263eb86cf083067/raw/6ef1a42f335022adf481fb84cabc32ac47f18679/ci-go.png)

![Resultados CI Rust](https://gist.githubusercontent.com/cuchi/59255d61717e2d469263eb86cf083067/raw/6ef1a42f335022adf481fb84cabc32ac47f18679/ci-rust.png)

## Uso de memória

Para medir o uso de memória, usei `/usr/bin/time -v ./hashtrack list` para cada uma das versões. `time -v` exibe muitas informações interessantes, mas aqui estamos procurando o **Maximum resident set size** do processo, que é a quantidade máxima de memória física alocada durante a execução.

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

Este uso de memória contabiliza a tarefa de:
- interpretar argumentos do sistema
- carregar e analisar um arquivo de configuração do sistema de arquivos
- chamar GraphQL sobre HTTP sobre TLS
- analisar uma resposta JSON
- escrever os dados formatados no `stdout`

Ambas as linguagens têm maneiras diferentes de gerenciar memória e alocações.

Go tem um coletor de lixo (garbage collector), que é uma maneira comum de rastrear memória heap não utilizada e recuperá-la em vez de fazer isso manualmente. Como coletores de lixo são uma composição de heurísticas, sempre há tradeoffs, geralmente entre desempenho e uso de memória.

O modelo de memória de Rust tem conceitos como _ownership_, _borrowing_ e _lifetimes_, que não só ajudam com segurança de memória, mas também garantem controle total da memória heap do programa sem gerenciamento manual ou coletor de lixo.

Para comparação, vejamos alguns outros executáveis que fazem uma tarefa _semelhante_:

| Comando                               | Maximum resident set size (kbytes) |
|---------------------------------------|------------------------------------|
| `heroku apps`                         | 56436                              |
| `gh pr list`                          | 26456                              |
| `git ls-remote` (com remote SSH)      | 6448                               |
| `git ls-remote` (com remote HTTPS)    | 23488                              |

## Conclusão

Ambas foram ótimas ferramentas para o trabalho. Mas, claro, elas têm prioridades diferentes. De um lado, temos uma opção que tenta manter o desenvolvimento de software simples, fácil de manter e acessível. Do outro, temos uma linguagem focada em solidez, segurança e desempenho.

Se você quiser outra comparação entre as duas linguagens que é muito mais aprofundada do que esta, confira [este artigo](https://fasterthanli.me/articles/i-want-off-mr-golangs-wild-ride) do [fasterthanlime](https://twitter.com/fasterthanlime). Ele também fala sobre alguns problemas sérios de capacidade multiplataforma.

### Razões pelas quais eu usaria Go

- Quero uma linguagem muito simples para meus colegas aprenderem
- Quero pouca flexibilidade, para escrever código simples e direto
- Se eu desenvolver excepcionalmente/principalmente para Linux
- Se o tempo de compilação for um problema
- Quero semânticas assíncronas maduras

### Razões pelas quais eu usaria Rust

- Quero tratamento de erros de última geração para meu código
- Quero uma linguagem multi-paradigma que me permita escrever código mais expressivo
- Se o projeto tem requisitos críticos de segurança
- Se o projeto tem requisitos críticos de desempenho
- Se o projeto tem como alvo muitos sistemas operacionais e quero uma base de código verdadeiramente multiplataforma

Há alguns detalhes de ambas as linguagens que ainda me incomodam:
- Go foca **tanto** em ser simples que às vezes tem o efeito oposto (como `GOROOT` e `GOPATH`, por exemplo).
- Ainda não entendo muito bem como lifetimes funcionam em Rust, e pode ser bastante frustrante se você tentar lidar com isso.

>**ATUALIZAÇÃO:** `GOPATH` não é mais um problema nas versões mais recentes de Go. Eu deveria dar uma olhada e migrar minha CLI Go atual para fora disso. Esta também é uma ótima oportunidade para um próximo post!

De uma perspectiva pessoal, ambas foram muito divertidas de aprender, e são uma grande adição em um mundo de C e C++. Elas fornecem uma gama mais ampla de aplicações, como serviços web e até [frameworks web front-end](https://github.com/yewstack/yew), graças ao WebAssembly :)
