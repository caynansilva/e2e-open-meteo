# Criação de testes Cucumber — padrão SC-01.1

Este projeto cria testes Cucumber seguindo o modelo de `SC-01.1-Validate_Exact_City_Search`: cada cenário possui sua própria classe de Steps, mantém seu estado em propriedades tipadas e usa Page Objects para a lógica de domínio.

## Arquitetura

```text
Feature (.feature)
  -> Cucumber binding (*.spec.ts)
    -> Steps individual (*.steps.ts)
      -> BaseClass + Page Object / API Client
        -> Fixture ou SUT
```

| Camada | Deve fazer | Não deve fazer |
|---|---|---|
| Feature | Descrever o comportamento esperado em linguagem de negócio. | Mencionar código, mocks ou métodos. |
| Spec | Registrar a frase Gherkin e chamar diretamente um comando de Steps. | Conter regra, assertion ou acesso a Page Object. |
| Steps | Orquestrar o cenário, manter estado tipado e dar significado às validações. | Reimplementar lógica de negócio. |
| BaseClass | Reutilizar fixture, clientes, Page Objects e assertion. | Conter comportamento específico de um cenário. |
| Page Object | Implementar buscas, regras e validações booleanas do domínio. | Conhecer Gherkin ou Cucumber. |

## Como criar um cenário

1. Escreva o `.feature` com Given/When/Then de negócio.
2. Crie o `*.spec.ts` correspondente. Cada frase deve delegar diretamente para um método público da classe de Steps.
3. Crie uma classe de Steps exclusiva para o cenário, estendendo `BaseClass`.
4. Declare no Step class cada valor compartilhado pelo cenário com um tipo explícito.
5. Para cada resultado esperado, use `this.assert` com mensagens de sucesso e falha específicas.
6. Execute o feature isoladamente antes de considerar o cenário pronto.

## Template

### Feature

```gherkin
Feature: [SC-XX] - Nome da capacidade

  Scenario: [SC-XX.X] - Resultado esperado
    Given o contexto de negócio é preparado
    When a resposta é obtida
    Then o resultado esperado é validado
```

### Binding Cucumber

```ts
import { Given, Then, When } from "@cucumber/cucumber";
import { ScXxScenarioSteps } from "../Steps/SC-XX-Scenario.steps";

const steps = new ScXxScenarioSteps();

Given("o contexto de negócio é preparado", () =>
  steps.PREPARAR_CONTEXTO_DE_NEGOCIO()
);

When("a resposta é obtida", () =>
  steps.OBTER_RESPOSTA()
);

Then("o resultado esperado é validado", () =>
  steps.VALIDAR_RESULTADO_ESPERADO()
);
```

Para um Step assíncrono, o binding retorna a Promise delegada:

```ts
When("a resposta HTTP é obtida", () =>
  steps.OBTER_RESPOSTA_HTTP()
);
```

### Steps individual

```ts
import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";

export class ScXxScenarioSteps extends BaseClass {
  public requestedCity = "";
  public activityResponse!: CityActivity;

  public PREPARAR_CONTEXTO_DE_NEGOCIO(): void {
    this.requestedCity = this.mockData.getRandomCityName();
  }

  public async OBTER_RESPOSTA(): Promise<void> {
    this.activityResponse = await this.activityRankingClient.getActivityRanking(
      this.requestedCity
    );
  }

  public VALIDAR_RESULTADO_ESPERADO(): void {
    this.assert(
      this.actMgr.assertCityActivityExists(this.activityResponse),
      "Success! The city activity exists!",
      "Fail! The city activity does not exist!"
    );
  }
}
```

## Assertions e logs

`BaseClass.assert(condition, successMessage, failMessage)` é obrigatório para resultados esperados do cenário:

- quando a condição é verdadeira, imprime `successMessage`;
- quando é falsa, imprime `failMessage` e lança um erro;
- cada mensagem deve indicar claramente o campo ou comportamento testado.

O hook `Before` gera o cabeçalho no início da execução do cenário.

## Checklist

- Uma classe de Steps individual existe para o cenário.
- Ela estende `BaseClass` e declara seu estado em propriedades tipadas.
- O spec é apenas uma ponte entre Gherkin e Steps.
- O estado do cenário permanece na classe de Steps, com tipos explícitos.
- Toda regra e validação booleana está em um Page Object ou cliente apropriado.
- Cada assertion usa `this.assert` com mensagem de sucesso e de falha.
- O feature isolado foi executado e os logs estão legíveis.

## Executar um feature isolado

```powershell
npm run test:fixture -- e2e-tests\SC-01.1-Validate_Exact_City_Search.feature
```

O `cucumber.js` mantém `parallel: 0`, garantindo execução determinística enquanto cada instância de Steps mantém o estado do próprio cenário.
