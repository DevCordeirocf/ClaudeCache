# Session Stats

Monitor de cache de sessão e uso de contexto para o Claude Code, com visibilidade em tempo real sobre a saúde do cache da conversa, o consumo do contexto e os avisos antes de o cache expirar ou de o auto-compact disparar.

## Visão geral

O mod exibe no rodapé do prompt um indicador visual do estado do cache da sessão:

- cache quente: o próximo prompt pode reaproveitar contexto anterior
- cache em expiração: falta pouco tempo para o cache ser invalidado
- cache frio: o próximo prompt reenvia o contexto sem reaproveitar o cache

Além disso, o plugin oferece:

- painel detalhado com métricas da sessão
- alertas proativos antes da expiração do cache
- avisos quando o contexto se aproxima dos limites do auto-compact
- confirmação antes de trocar de modelo com cache quente, evitando perda do reaproveitamento
- comando `/sessao` para diagnóstico completo da sessão

## Recursos

### Indicador de cache em tempo real

No rodapé do prompt, o mod mostra um círculo com preenchimento proporcional ao tempo restante do TTL e um texto com o tempo restante ou o estado atual do cache.

- respondendo: uma bola amarela desde o envio do prompt até o Claude terminar; a contagem começa quando a resposta termina (subagentes em segundo plano não contam)
- quente: indica que o cache ainda está válido
- expirando: avisa que o cache está prestes a expirar
- frio: indica que o cache já foi invalidado (mostra só "frio"; o relógio para até a próxima resposta)

### Cartão detalhado da sessão

Clicando no indicador, o usuário abre um cartão acima do prompt com informações como:

- estado atual do cache
- percentual do último turno que veio do cache
- contexto atual da sessão
- uso de tokens por categoria
- totais acumulados da sessão

### Avisos inteligentes

O mod dispara notificações úteis para evitar perda de eficiência, incluindo:

- aviso 5 minutos antes da expiração do cache
- confirmação antes de trocar de modelo enquanto o cache está quente
- alerta em 80% e 90% do limite de auto-compact

### Diagnóstico completo

O comando `/sessao` abre um relatório detalhado com:

- contexto atual por categoria
- explicação de como o cache da sessão funciona
- estado do TTL e do restante do cache
- visão geral de tokens e uso da conversa

## Instalação

No terminal do Claude Code:

```bash
/plugin marketplace add DevCordeirocf/ClaudeCache
/plugin install session-stats@claude-cache
```

> O primeiro comando adiciona o marketplace uma vez; o segundo instala o mod no escopo desejado (usuário ou projeto).

Para receber uma versão nova, atualize o marketplace e o mod, e reinicie a sessão:

```bash
/plugin marketplace update claude-cache
/plugin update session-stats@claude-cache
```

## Como usar

Após a instalação, o mod entra em funcionamento automaticamente quando você abre ou usa uma sessão no Claude Code. Não é necessário configuração adicional na maioria dos casos.

### Comandos disponíveis

```bash
/sessao
/sessao-aviso
```

- `/sessao`: exibe um relatório completo do estado da sessão
- `/sessao-aviso`: dispara uma notificação de teste do aviso de cache

## Configuração

O mod usa um TTL padrão de 1 hora. Se a sua conta utiliza um TTL curto, você pode configurar o valor em `cacheTtl`:

```json
{
  "cacheTtl": "5m"
}
```

O plugin também ajusta automaticamente para 5 minutos quando identifica que o cache está expirando antes do esperado.

## Entendendo o cache

O cache da sessão ajuda a reutilizar contexto já enviado em prompts anteriores, reduzindo o custo de tokens e melhorando a velocidade das respostas.

Quando o cache está quente:

- o próximo prompt reaproveita partes do contexto
- a resposta tende a ser mais rápida
- o processamento costuma ser mais barato

Quando o cache está frio:

- o contexto precisa ser reprocessado
- o custo e o tempo de resposta aumentam

## Observações

- Os totais de tokens contam desde o momento em que o mod foi carregado na sessão.
- O mod acompanha o comportamento do cache do Claude Code e adapta os avisos conforme o contexto e o TTL atual.
- A confirmação de troca de modelo existe para evitar que uma troca acidental descarte o cache quente sem intenção.

## Licença

Este projeto está disponível sob os termos definidos no repositório principal.

## Contribuição

Sinta-se à vontade para abrir issues, sugerir melhorias ou enviar pull requests para evoluir este mod.
