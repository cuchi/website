---
title: "Usando bindings SDL2 em Rust para desenvolvimento de jogos"
date: 2023-01-30
layout: post
tags: posts
permalink: /pt-br/posts/rust-sdl2/
description: "Um tutorial passo a passo sobre como desenvolver um jogo da cobrinha do zero usando Rust e SDL2 — cobrindo loops de jogo, renderização, tratamento de entrada e gerenciamento de estado baseado em ticks."
---

SDL significa Simple DirectMedia Layer, uma biblioteca open source que fornece APIs para entrada do usuário, áudio e gráficos. Ela também suporta os sistemas operacionais desktop e mobile mais populares — e até navegadores web com WebAssembly — facilitando a escrita de código multiplataforma.

Esses recursos tornam o SDL uma escolha razoável e popular para escrever jogos do zero, como você pode ver nesta [extensa lista de jogos feitos com SDL](https://en.wikipedia.org/wiki/List_of_games_using_SDL). Neste post, vamos criar um jogo simples em Rust usando a crate [`rust-sdl2`](https://crates.io/crates/sdl2).

Note que este tutorial assume que o Rust já está configurado com Rustup.

## Configurando nosso projeto Rust e SDL2

Lembre-se de que a crate `rust-sdl2` apenas fornece os bindings Rust para as novas bibliotecas SDL2.0. A biblioteca em si é escrita em C, e precisamos instalar os arquivos de desenvolvimento nativos para compilar qualquer programa que a utilize.

Para configurar no Mac OS, use o comando abaixo:

```bash
brew install sdl2
```

Para configurar no Linux via Ubuntu, use o comando abaixo:

```bash
sudo apt install libsdl2-dev
```

Veja [a documentação](https://github.com/Rust-SDL2/rust-sdl2?tab=readme-ov-file#sdl20-development-libraries) para instruções de configuração em outros sistemas.

Como um passo completamente opcional — mas recomendado — para se familiarizar com esta biblioteca, `rust-sdl2` fornece vários exemplos que você pode executar clonando o repositório. Note que alguns deles exigem bibliotecas de desenvolvimento adicionais, então consulte o `README` oficial de cada exemplo para mais informações.

O próximo passo é criar nosso projeto. Vamos implementar um jogo da cobrinha bem simples:

```bash
cargo new snake-game
```

Em seguida, adicione `sdl2` nas dependências do `Cargo.toml`:

```toml
[dependencies]
sdl2 = "0.35"
```

Execute `cargo build` para baixar e compilar os bindings Rust para SDL2. Se isso acontecer com sucesso, estamos prontos!

## Entendendo um programa SDL simples

Antes de criarmos nosso jogo da cobrinha, vamos dar uma olhada na demonstração mais simples do repositório da biblioteca `rust-sdl2` para garantir que entendemos cada componente:

```rust
extern crate sdl2;

use sdl2::event::Event;
use sdl2::keyboard::Keycode;
use sdl2::pixels::Color;
use std::time::Duration;

pub fn main() -> Result<(), String> {
    let sdl_context = sdl2::init()?;
    let video_subsystem = sdl_context.video()?;

    let window = video_subsystem
        .window("rust-sdl2 demo: Video", 800, 600)
        .position_centered()
        .opengl()
        .build()
        .map_err(|e| e.to_string())?;

    let mut canvas = window.into_canvas().build().map_err(|e| e.to_string())?;

    canvas.set_draw_color(Color::RGB(255, 0, 0));
    canvas.clear();
    canvas.present();
    let mut event_pump = sdl_context.event_pump()?;

    'running: loop {
        for event in event_pump.poll_iter() {
            match event {
                Event::Quit { .. }
                | Event::KeyDown {
                    keycode: Some(Keycode::Escape),
                    ..
                } => break 'running,
                _ => {}
            }
        }

        canvas.clear();
        canvas.present();
        ::std::thread::sleep(Duration::new(0, 1_000_000_000u32 / 30));
        // O resto do loop do jogo vai aqui...
    }

    Ok(())
}
```

Este será nosso scaffold, então podemos colá-lo no nosso `src/main.rs` gerado e executar `cargo run` no projeto. O resultado deve ser uma janela vermelha que não faz nada e fecha quando você pressiona `esc`:

![Saída da demonstração da janela vermelha](/assets/images/sdl2-red-window.png)

Vamos dar uma olhada no nosso código boilerplate e entender o que aconteceu.

### Usando `sdl_context`, `video_subsystem` e `window`

Ao usar SDL2 com Rust, precisamos criar os seguintes objetos intermediários para renderizar a janela:

```
Sdl -> VideoSubsystem -> Window -> WindowCanvas
```

O objeto `sdl_context: Sdl` gerencia tudo o que pode acontecer dentro do programa. Neste caso, usamos ele para acessar o recurso de vídeo e entrada do teclado. Ele também pode ser usado para aproveitar outros recursos do sistema operacional, como áudio, clipboard e outras entradas do usuário.

O `video_subsystem: VideoSubsystem` agrupa tudo relacionado a vídeo, como consultar informações de exibição, criar novas janelas e gerenciar clipboard e entrada de texto com suporte adequado a teclado virtual.

O `WindowBuilder` que chamamos com `video_subsystem.window` pode ser usado para criar nossa janela principal com muitos parâmetros, como tamanho e posição. Também é possível adicionar suporte a engines de renderização de jogos como OpenGL e Vulkan.

Se você quiser ler mais sobre tudo isso, confira a [documentação oficial do SDL2 Rust](https://docs.rs/sdl2/).

Note que tanto `VideoSubsystem` quanto `Window` mantêm a referência ao objeto `Sdl` original. Se quisermos, podemos acessar o objeto original chamando `.sdl()` de qualquer um deles.

### Criando o canvas

Vamos criar um `canvas: WindowCanvas` que podemos manipular para renderizar nosso jogo:

```rust
let mut canvas = window.into_canvas().build().map_err(|e| e.to_string())?;

canvas.set_draw_color(Color::RGB(255, 0, 0));
canvas.clear();
canvas.present();
```

Na demonstração acima, os três métodos que chamamos do `canvas` são suficientes para desenhar uma tela vermelha:
- `set_draw_color` define a cor atual para todas as operações subsequentes até ser chamado novamente com outra cor
- `clear` aplica a cor sólida atual em todo o canvas
- `present` renderiza o próximo frame

`canvas` tem muitos métodos que podemos usar para lidar com pixels individuais ou texturas. Neste exemplo, usaremos `canvas.draw_rect` para construir todos os objetos que precisaremos. Dependendo do caso, outros métodos como `draw_point` e `draw_line` também poderiam ser chamados.

### Escrevendo o loop principal

Precisamos escrever o código onde nosso jogo passará a maior parte do tempo. Este será o loop principal. Na nossa implementação, vamos usar o loop principal para fazer quatro coisas em sequência:
- Ler a entrada do usuário
- Alterar o estado do jogo
- Renderizar o estado atual do jogo
- Esperar até o próximo frame

Note que a ordem não importa muito neste caso. Por exemplo, colocar o loop do jogo após a renderização também está ok.

### Lendo a entrada do usuário

SDL2 fornece um `event_pump` para Rust que podemos obter assim:

```rust
let mut event_pump = sdl_context.event_pump()?;
```

Podemos então usá-lo no loop principal:

```rust
for event in event_pump.poll_iter() {
    match event {
        Event::Quit { .. }
        | Event::KeyDown {
            keycode: Some(Keycode::Escape),
            ..
        } => break 'running,
        _ => {}
    }
}
```

No exemplo acima, estamos obtendo um fluxo de eventos usando `.poll_iter()` e fazendo pattern matching em cada um. Este exemplo apenas corresponde a pressionamentos da tecla `esc` ou eventos `Event::Quit` como `alt+f4` ou `cmd+w` para sair do loop principal, que está rotulado como `'running`.

Como você está na thread principal e muitos eventos podem ocorrer entre um loop e outro, `.poll_iter()` permite que você obtenha todos eles e lerá muitos eventos em cada loop.

### Gerenciando e renderizando o estado do jogo

O estado do jogo é completamente nossa responsabilidade! Como SDL2 é completamente agnóstico ao estado do jogo, podemos até querer implementá-lo desacoplado do nosso `canvas`.

Atualmente, tudo que nosso exemplo faz é usar nosso canvas para preencher a tela de vermelho com `.clear()` junto com `.present()` para renderizá-la a cada vez. Vamos mudar isso depois.

### Esperando até o próximo frame

Finalmente, é assim que esperamos até o próximo loop:

```rust
::std::thread::sleep(Duration::new(0, 1_000_000_000u32 / 30));
```

O segundo parâmetro de `Duration` é o número de nanossegundos. Neste caso, isso significa que esperamos um trigésimo de segundo para cada frame, o que significa que processamos, no máximo, 30 frames por segundo.

Vamos mudar isso conforme configuramos nosso jogo da cobrinha.

## Escrevendo a lógica do nosso jogo

O primeiro passo mais fácil é descobrir como devemos estruturar o estado do nosso jogo. Mesmo para um jogo da cobrinha bem simples, temos muitos dados para acompanhar. Aqui estão as principais considerações:
- O estado atual do jogo, como pausado, jogando ou terminou
- A posição do jogador, com a cabeça e seus segmentos
- A direção da cabeça do jogador
- A posição atual da comida

Podemos criar nossa própria struct para agrupar todos esses dados:

```rust
pub enum GameState { Playing, Paused }
pub enum PlayerDirection { Up, Down, Right, Left }
pub struct Point(pub i32, pub i32);

pub struct GameContext {
    pub player_position: Vec<Point>,
    pub player_direction: PlayerDirection,
    pub food: Point,
    pub state: GameState,
}
```

Também criamos estruturas adicionais que fariam sentido assumindo que vamos implementar um jogo da cobrinha tradicional, que é sempre uma grade bidimensional. A struct `Point` que criamos será usada para representar as entidades que queremos gerenciar e exibir para o usuário.

Note que `player_position` recebe um `Vec<Point>` que mantém as posições da cabeça e dos segmentos da cobrinha. Podemos assumir que a cabeça está na primeira posição, seguida pelos segmentos até atingir seu tamanho máximo.

`player_direction` acompanha para onde a cabeça está se movendo, que é tudo que o jogador precisa para interagir ao jogar.

`food` é apenas um ponto na grade, que mudará aleatoriamente após o jogador comê-la.

Finalmente, temos o `state`, que nos permite gerenciar se o jogo está rodando ou não. Também precisamos pensar no nosso estado inicial:

```rust
impl GameContext {
    pub fn new() -> GameContext {
        GameContext {
            player_position: vec![Point(3, 1), Point(2, 1), Point(1, 1)],
            player_direction: PlayerDirection::Right,
            state: GameState::Paused,
            food: Point(3, 3),
        }
    }
}
```

![Esboço do estado inicial do jogo](/assets/images/sdl2-sketch.png)

Também precisamos definir um tamanho fixo para nossa grade, considerando que estamos mantendo o estilo tradicional deste jogo. Por simplicidade, podemos dar ao nosso jogo um tamanho de grade de 40×30 sobre uma janela de 800×600 pixels, fazendo cada ponto da grade um quadrado perfeito de 20 pixels.

Vamos adicionar estas constantes no início do arquivo `src`:

```rust
const GRID_X_SIZE: i32 = 40;
const GRID_Y_SIZE: i32 = 30;
const DOT_SIZE_IN_PXS: i32 = 20;
```

Voltando à nossa função `main`, podemos usar essas constantes para inicializar nossa janela com um tamanho fixo:

```rust
let window = video_subsystem
    .window(
        "Snake Game",
        GRID_X_SIZE * DOT_SIZE_IN_PXS,
        GRID_Y_SIZE * DOT_SIZE_IN_PXS
    )
    .position_centered()
    .opengl()
    .build()
    .map_err(|e| e.to_string())?;
```

E depois disso, podemos inicializar nosso jogo logo antes do loop:

```rust
let mut context = GameContext::new();
```

Depois trabalharemos para dar alguma vida ao nosso jogo, mas primeiro vamos renderizá-lo.

## Renderizando o estado do nosso jogo

Vamos criar uma struct chamada `Renderer` que abstrairá a renderização do nosso jogo. Seu principal propósito é traduzir o estado do jogo em chamadas ao nosso `canvas`:

```rust
pub struct Renderer { canvas: WindowCanvas }
```

Aqui está como seu construtor se parece por enquanto:

```rust
impl Renderer {
    pub fn new(window: Window) -> Result<Renderer, String> {
        let canvas = window.into_canvas().build().map_err(|e| e.to_string())?;
        Ok(Renderer { canvas })
    }
}
```

Também o inicializamos antes do loop principal. Ele precisa ser mutável porque referencia o canvas que vamos mutar ao renderizar nosso jogo:

```rust
let mut renderer = Renderer::new(window)?;
```

Vamos implementar a operação mais básica do nosso `Renderer`. Como estamos lidando com uma grade de pixels grandes, implementaremos o método que preencherá um único deles:

```rust
fn draw_dot(&mut self, point: &Point) -> Result<(), String> {
    let Point(x, y) = point;
    self.canvas.fill_rect(Rect::new(
        x * DOT_SIZE_IN_PXS as i32,
        y * DOT_SIZE_IN_PXS as i32,
        DOT_SIZE_IN_PXS,
        DOT_SIZE_IN_PXS,
    ))?;

    Ok(())
}
```

Agora vamos implementar o método principal de desenho que usa nosso contexto do jogo:

```rust
pub fn draw(&mut self, context: &GameContext) -> Result<(), String> {
    self.draw_background(context);
    self.draw_player(context)?;
    self.draw_food(context)?;
    self.canvas.present();

    Ok(())
}

fn draw_background(&mut self, context: &GameContext) {
    let color = match context.state {
        GameState::Playing => Color::RGB(0, 0, 0),
        GameState::Paused => Color::RGB(30, 30, 30),
    };
    self.canvas.set_draw_color(color);
    self.canvas.clear();
}

fn draw_player(&mut self, context: &GameContext) -> Result<(), String> {
    self.canvas.set_draw_color(Color::GREEN);
    for point in &context.player_position {
        self.draw_dot(point)?;
    }

    Ok(())
}

fn draw_food(&mut self, context: &GameContext) -> Result<(), String> {
    self.canvas.set_draw_color(Color::RED);
    self.draw_dot(&context.food)?;
    Ok(())
}
```

Se executarmos `cargo run`, devemos ver a cobrinha em verde com a comida vermelha em um fundo cinza escuro (já que o jogo começa pausado):

![Estado inicial renderizado do jogo](/assets/images/sdl2-rendered.png)

## Pensando em ticks

Atualmente, tudo que nosso programa faz é desenhar o mesmo estado inicial do jogo a 30 frames por segundo. Para torná-lo "vivo" e jogável, precisamos atualizar seu estado no loop principal.

No caso de um jogo da cobrinha, o próximo estado seria basicamente mover a cabeça do jogador para o próximo slot. Dependendo do que for o próximo slot, uma das seguintes situações ocorrerá:
- Se for um espaço livre:
  - A cabeça da cobrinha toma seu lugar
  - Todos os segmentos da cobrinha se deslocam para a próxima posição
- Se for um pedaço de comida:
  - A cabeça da cobrinha toma seu slot
  - A cobrinha cresce em 1 segmento
  - Outro pedaço de comida aparece aleatoriamente no mapa
- Se for a parede ou os próprios segmentos do corpo da cobrinha:
  - O jogo termina

Cada atualização de estado do jogo é geralmente chamada de _tick_. Muitos jogos vinculam ticks com FPS em uma proporção de 1:1, especialmente jogos mais antigos.

Poderíamos atualizar o estado do nosso jogo a cada frame, mas isso significa que nossa cobrinha viajaria 30 slots em um segundo, tornando o jogo extremamente difícil de jogar. Em vez disso, vamos fazer o jogo dar tick uma vez a cada 10 frames para fazer nossa cobrinha se mover três slots por segundo.

Precisaremos acompanhar os frames no nosso loop principal:

```rust
let mut frame_counter = 0;
'running: loop {
    // ...eventos de entrada... (omitido)

    ::std::thread::sleep(Duration::new(0, 1_000_000_000u32 / 30));

    frame_counter += 1;
    if frame_counter % 10 == 0 {
        context.next_tick();
        frame_counter = 0;
    }

    renderer.draw(&context)?;
}
```

Vamos implementar o movimento do jogador:

```rust
impl Add<Point> for Point {
    type Output = Point;

    fn add(self, rhs: Point) -> Self::Output {
        Point(self.0 + rhs.0, self.1 + rhs.1)
    }
}

#[derive(Copy, Clone)]
pub struct Point(pub i32, pub i32);

impl GameContext {
    pub fn next_tick(&mut self) {
        if let GameState::Paused = self.state {
            return;
        }

        let head_position = self.player_position.first().unwrap();
        let next_head_position = match self.player_direction {
            PlayerDirection::Up => *head_position + Point(0, -1),
            PlayerDirection::Down => *head_position + Point(0, 1),
            PlayerDirection::Right => *head_position + Point(1, 0),
            PlayerDirection::Left => *head_position + Point(-1, 0),
        };

        self.player_position.pop();
        self.player_position.reverse();
        self.player_position.push(next_head_position);
        self.player_position.reverse();
    }
}
```

A lógica acima decide a próxima posição da cabeça da cobrinha, remove o segmento mais distante com `.pop()` e adiciona `next_head_position` à cabeça do vec. Isso deve nos dar a impressão de que todos os segmentos estão se movendo juntos:

![Animação de movimento do jogador](/assets/images/sdl2-movement.gif)

## Lendo a entrada do usuário para controlar o jogo da cobrinha

Os controles de um jogo da cobrinha são extremamente simples — apenas mudamos a direção do movimento da cobrinha e, adicionalmente, podemos pausar e despausar o jogo.

Já acompanhamos os campos `player_direction` e `state`. Agora, só precisamos poder alterá-los:

```rust
pub fn move_up(&mut self) {
    self.player_direction = PlayerDirection::Up;
}

pub fn move_down(&mut self) {
    self.player_direction = PlayerDirection::Down;
}

pub fn move_right(&mut self) {
    self.player_direction = PlayerDirection::Right;
}

pub fn move_left(&mut self) {
    self.player_direction = PlayerDirection::Left;
}

pub fn toggle_pause(&mut self) {
    self.state = match self.state {
        GameState::Playing => GameState::Paused,
        GameState::Paused => GameState::Playing
    }
}
```

Agora vamos conectar os eventos do teclado. Usaremos `WASD` para movimento e `Escape` para pausar:

```rust
match event {
    Event::Quit { .. } => break 'running,
    Event::KeyDown { keycode: Some(keycode), .. } => {
        match keycode {
            Keycode::W => context.move_up(),
            Keycode::A => context.move_left(),
            Keycode::S => context.move_down(),
            Keycode::D => context.move_right(),
            Keycode::Escape => context.toggle_pause(),
            _ => {}
        }
    }
    _ => {}
}
```

## Conclusão

Isso conclui o básico sobre como usar SDL2 com Rust. Espero que este tutorial ajude a familiarizá-lo com esta biblioteca para que você possa aplicar esses conceitos ao seu próprio desenvolvimento de jogos.

Se você estiver interessado em praticar mais usando este simples jogo da cobrinha, aqui estão os próximos passos possíveis:
- Gerenciar colisões com a parede, comida e outros segmentos da cobrinha
- Ser capaz de consumir a comida e crescer
- Adicionar um estado `GameState::Over` do qual você possa reiniciar
