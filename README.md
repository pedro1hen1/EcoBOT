<p align="center">
  <img src="extensao/icons/icon-128.png" width="72" alt="EcoBot">
</p>
<h1 align="center">EcoBot</h1>
<p align="center">Seu plano. Cada lance, uma nova combinação.</p>
<p align="center"><kbd>Chrome</kbd> <kbd>Edge</kbd> <kbd>Manifest V3</kbd> <kbd>0.8.0</kbd></p>
<p align="center">
  <a href="#instalar">Instalar</a> · <a href="#primeira-partida">Primeira partida</a> · <a href="#configurar-a-serie">Configurar</a> · <a href="#duvidas-frequentes">Dúvidas</a>
</p>

O EcoBot opera a interface do Resíduo GO: seleciona o resíduo, inicia sem câmera, sorteia o lançamento, observa o feedback e retorna ao menu. Uma partida só é contabilizada depois do encerramento e do retorno confirmados.

> **A extensão pronta está em [`extensao/`](./extensao).** Para instalar, não é necessário Node.js, npm ou compilar o código.

## Instalar

1. [Baixe o repositório em ZIP](https://github.com/pedro1hen1/EcoBOT/archive/refs/heads/develop.zip) e extraia numa pasta fixa.
2. Abra **`chrome://extensions`** no Chrome ou **`edge://extensions`** no Edge.
3. Ative **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação**.
5. Selecione a pasta **`extensao`**, dentro do projeto extraído. Ela contém o arquivo `manifest.json`.
6. Fixe o EcoBot na barra do navegador, se desejar.

**Para atualizar:** substitua os arquivos na mesma pasta, clique em **Recarregar** na página de extensões e recarregue a aba do jogo. Substituir os arquivos sem recarregar pode manter componentes antigos ativos.

## Primeira partida

1. Abra o [Resíduo GO](https://atlasserver-anbefqardqe8b0f5.brazilsouth-01.azurewebsites.net/ResiduoGo/public/index.php), faça o login corporativo e permaneça no menu dos resíduos.
2. Abra o EcoBot pelo ícone da extensão.
3. Escolha **Fixo — um resíduo**, **Jornal** e **1 partida**.
4. Confira o catálogo e o total. Se o catálogo tiver mudado, revise os itens e confirme **Revisei: aplicar catálogo atual**.
5. Marque a autorização de uso permitido no jogo e clique em **Iniciar**.

A calibração incluída foi medida no **Nível Especialista**, em desktop, sem câmera. Se o jogo mostrar outro nível, o EcoBot pausa para nova calibração. O navegador pode exibir um aviso de depuração enquanto o arraste é executado.

<a id="configurar-a-serie"></a>
## Configurar a série

| Configuração | Como usar |
|---|---|
| **Fixo** | Um resíduo e N partidas. A força e o ângulo continuam sorteados. |
| **Sequencial** | Escolha resíduos ou categorias, partidas por resíduo e sequências completas. |
| **Agrupada** | AAA BBB CCC, repetindo depois a sequência inteira. |
| **Rodízio** | ABC ABC dentro de cada sequência. |
| **Velocidade** | De 1 a 5. Ajusta a faixa de espera sorteada por lance. |
| **Limite opcional** | Em Avançado. Use 1 ou 2 para experimentar. Vazio utiliza toda a fila selecionada. |

**Total = resíduos selecionados × partidas por resíduo × sequências.**

- Padrão: **48 × 3 × 2 = 288 partidas**.
- Três sequências de uma partida por resíduo: **48 × 1 × 3 = 144 partidas**.
- No modo fixo, o total é apenas a quantidade de partidas escolhida.

O total aparece antes de iniciar. Uma tentativa de arremesso não é uma partida.

### Controles

| Botão | Ação |
|---|---|
| **Iniciar** | Prepara a configuração atual e começa pela aba do menu do jogo. |
| **Pausar** | Interrompe e conserva o checkpoint. |
| **Retomar** | Continua uma execução pausada quando não existe pendência incerta. |
| **Parar** | Encerra a execução preservando o cursor e os registros. |

A série pausa no primeiro resultado sem acerto confirmado. Confira o jogo antes de continuar. Em **Avançado**, uma pendência pode ser arquivada após conferência, sem contar partida nem reenviar resultado.

## Sorteio e calibração

Cada lance sorteia **força, ângulo e ritmo**. O par completo de força/ângulo não se repete consecutivamente; um campo isolado pode repetir. Não há teto de pontos: entram tanto os pares de pontuação menor quanto os de pontuação maior.

A série usa somente pares com **acerto observado e nenhum erro registrado**, para o mesmo resíduo, categoria, nível e faixa configurada. Inclui calibração prévia de **Jornal** e **Casca de banana**, com acertos locais e prévios separados na tabela. Essas medições não criam partidas fictícias no histórico. Um erro local exclui o par.

**Os outros 46 resíduos precisam de medição própria.** A faixa não aprova automaticamente todas as combinações intermediárias. Acerto observado não é garantia de erro zero.

### Medir outro resíduo

1. Escolha **Fixo** e selecione o resíduo.
2. Abra **Sorteio a cada lance e calibração** e informe o nível visível no jogo.
3. Ajuste os limites de força e ângulo. Na categoria cinza, use ângulos negativos em ordem crescente, como **−34 a −25°**.
4. Marque a autorização e clique em **Medir 2 lances deste resíduo**.
5. A extensão mede até duas partidas, um lance por partida, escolhendo pares ainda não medidos. Pausa no primeiro resultado sem acerto.
6. Confira a tabela e configure novamente a série desejada.

A medição pode errar: ela explora combinações novas. A execução comum usa apenas os pares já observados. Se faltar calibração, o EcoBot bloqueia antes de abrir o card.

### Faixas e pontos

Faixas padrão de exploração: **32–38%** de força; azul **25–34°** e cinza **−34 a −25°**. A série sorteia apenas os pares observados dentro delas.

Exemplos reais de Jornal, Nível Especialista, sequência 2×:

| Força / ângulo | Pontos observados |
|---|---:|
| 32% / +34° | +290 |
| 32% / +33° | +294 |
| 32% / +32° | +298 |
| 33% / +33° | +298 |
| 33% / +30° | +310 |
| 34% / +31° | +312 |
| 36% / +26° | +338 |
| 37% / +27° | +342 |
| 38% / +27° | +344 |

A pontuação depende também da rapidez e da sequência. Esses valores são observações, não notas fixas ou garantidas. O par 38%/+26° também tem acerto observado, sem pontuação registrada. A extensão não restringe o sorteio a 280–300 pontos.

No ritmo padrão **3/5**, a espera é sorteada entre **0,8 e 1,8 segundo**. O arraste tem duração alvo entre **220 e 420 ms**; o transporte acrescenta tempo real. A espera pode ser cancelada antes de pressionar. O bot sempre aguarda o resultado real, independentemente da velocidade.

## Registros e privacidade

Em **Avançado**, exporte tentativas ou partidas em CSV. Cada tentativa registra força, ângulo, ritmo e pontuação disponível. **Δ HUD** é a diferença do placar antes/depois; **Feedback** é o Total exibido no resultado. **—** significa não medido, nunca zero presumido.

Os dados ficam no armazenamento local da extensão. O EcoBot não lê senhas, cookies, tokens, payloads do jogo ou perfis pessoais. Usa a permissão `debugger` para entrada nativa de mouse, após conferir aba, rota e documento. O próprio jogo faz suas requisições normais; o EcoBot não envia pontuações diretamente à API nem clica em reenviar resultado incerto.

<a id="duvidas-frequentes"></a>
## Dúvidas frequentes

<details>
<summary><strong>Não consigo iniciar ou aparece versão incompatível.</strong></summary>

Recarregue o EcoBot em `chrome://extensions` ou `edge://extensions` e depois recarregue a aba do jogo. Volte ao menu dos resíduos antes de clicar em Iniciar. Confira também se a pasta carregada é `extensao`.
</details>

<details>
<summary><strong>Por que aparece falta de calibração?</strong></summary>

Cada resíduo precisa de pelo menos dois pares com acerto observado no nível atual. A calibração incluída cobre apenas Jornal e Casca de banana no Nível Especialista. Meça os demais resíduos antes de incluí-los na série.
</details>

<details>
<summary><strong>Por que a pontuação muda usando o mesmo par?</strong></summary>

Rapidez e multiplicador de sequência também participam da pontuação. O histórico mostra o que foi observado; não garante que um par produzirá sempre a mesma nota.
</details>

<details>
<summary><strong>Posso fechar o popup?</strong></summary>

Sim. O trabalho continua pela extensão e o checkpoint é persistido. Se houver recarga inesperada, sessão perdida ou resultado incerto, o bot pausa em vez de presumir conclusão.
</details>

<details>
<summary><strong>A extensão garante que nunca vai errar?</strong></summary>

Não. Ela reduz o risco usando pares observados, verifica o feedback e pausa na primeira falha. Alterações no jogo, no nível ou na cena podem exigir nova medição. Não contorna políticas administrativas, CAPTCHA ou controles de acesso.
</details>

<details>
<summary><strong>Preciso instalar pela loja?</strong></summary>

Não para esta distribuição: ela é carregada localmente pela página de extensões. O ZIP do repositório não equivale a uma publicação na Chrome Web Store ou na loja Edge.
</details>

## Compilar o código

Esta etapa é opcional. Para instalar, basta usar a pasta `extensao` já incluída.

Com Node.js 22+ e npm:

```sh
cd codigo
npm ci
npm run lint
npm run build
```

O build atualiza `extensao/`. Depois, recarregue a extensão e a aba do jogo.

```text
codigo/          Fontes e arquivos de compilação
extensao/        Extensão final, pronta para carregar
README.md        Instalação e uso
```

O código não inclui referências proprietárias, credenciais, relatórios internos, gravações ou dependências instaladas.
