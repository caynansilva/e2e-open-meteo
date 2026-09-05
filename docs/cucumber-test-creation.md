# Criação de testes Cucumber — padrão SC-01.1

Este projeto cria testes Cucumber seguindo o modelo de `SC-01.1-Validate_Exact_City_Search`: cada cenário é independente, possui sua própria classe de Steps e usa Page Objects para toda a lógica de negócio.

## Arquitetura

```text
Feature (.feature)
  -> Cucumber binding (*.spec.ts)
    -> Steps individual (*.steps.ts)
      -> BaseClass + Page Object
        -> Fixture e tipos de domínio
```

| Camada | Deve fazer | Não deve fazer |
|---|---|---|
| Feature | Descrever o comportamento esperado em linguagem de negócio. | Mencionar código, mocks ou métodos. |
| Spec | Registrar a frase Gherkin e chamar um comando de Steps. | Conter regra, assertion ou acesso a Page Object. |
| Steps | Orquestrar o cenário, preparar dados e dar significado às mensagens de validação. | Reimplementar lógica de negócio. |
| BaseClass | Reutilizar fixture, helpers stateless e assertion. | Conter comportamento específico de um cenário ou estado do cenário. |
| Page Object | Implementar buscas, regras e validações booleanas do domínio. | Conhecer Gherkin ou Cucumber. |

## Como criar um cenário

1. Escreva o `.feature` com Given/When/Then de negócio.
2. Crie o `*.spec.ts` correspondente. Cada frase deve delegar diretamente para um método público da classe de Steps.
3. Crie uma classe de Steps exclusiva para o cenário, estendendo `BaseClass`.
4. Não use o construtor para logging ou dados do cenário; o log inicial é responsabilidade do hook `Before`.
5. Receba `CucumberWorld` nos métodos de Steps e use `world.setData`/`world.getData` para todo estado mutável do cenário.
6. Para cada resultado esperado, use `this.assert` com mensagens de sucesso e falha específicas.
7. Execute o feature isoladamente antes de considerar o cenário pronto.

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
import type { CucumberWorld } from "src/Support/CucumberWorld";
import { ScXxScenarioSteps } from "../Steps/SC-XX-Scenario.steps";

const steps = new ScXxScenarioSteps();

Given("o contexto de negócio é preparado", function (this: CucumberWorld) {
  steps.PREPARAR_CONTEXTO_DE_NEGOCIO(this);
});

When("a resposta é obtida", function (this: CucumberWorld) {
  steps.OBTER_RESPOSTA(this);
});

Then("o resultado esperado é validado", function (this: CucumberWorld) {
  steps.VALIDAR_RESULTADO_ESPERADO(this);
});
```
Para um Step que chama o `ActivityRankingApiClient`, use `async` no binding e aguarde o método delegado:

```ts
When("a resposta HTTP é obtida", async function (this: CucumberWorld) {
  await steps.OBTER_RESPOSTA_HTTP(this);
});
```

### Steps individual

```ts
import { BaseClass } from "src/BaseClass";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";
import type { CityActivity } from "src/Types";

export class ScXxScenarioSteps extends BaseClass {
  public PREPARAR_CONTEXTO_DE_NEGOCIO(world: CucumberWorld): void {
    world.setData(
      WORLD_DATA_KEYS.requestedCity,
      this.mockData.getRandomCityName()
    );
  }

  public OBTER_RESPOSTA(world: CucumberWorld): void {
    const requestedCity = this.getRequiredData<string>(
      world,
      WORLD_DATA_KEYS.requestedCity
    );

    world.setData(
      WORLD_DATA_KEYS.activityResponse,
      this.mockData.returnWeatherSensitiveMockData(requestedCity)
    );
  }

  public VALIDAR_RESULTADO_ESPERADO(world: CucumberWorld): void {
    const activityResponse = this.getRequiredData<CityActivity>(
      world,
      WORLD_DATA_KEYS.activityResponse
    );
    const requestedCity = this.getRequiredData<string>(
      world,
      WORLD_DATA_KEYS.requestedCity
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertCityActivityExists(activityResponse),
      'Success! The field "City Name" exists in the contract!',
      'Fail! The field "City Name" does not exist in the contract!'
    );

    this.assert(
      activityManager.assertCityNameMatches(activityResponse, requestedCity),
      'Success! The field "CityName" matches the expected result "' +
        requestedCity +
        '"!',
      'Fail! The field "CityName" does not match the expected result "' +
        requestedCity +
        '"!'
    );
  }
}
```

## Assertions e logs

`BaseClass.assert(condition, successMessage, failMessage)` é obrigatório para resultados esperados do cenário:

- quando a condição é verdadeira, imprime `successMessage`;
- quando é falsa, imprime `failMessage` e lança um erro, deixando o step e o cenário vermelhos;
- cada mensagem deve indicar claramente o campo ou comportamento testado; inclua o valor esperado quando fizer sentido.

O hook `Before` gera o cabeçalho no início da execução do cenário, por exemplo:

```text
Starting tests for Scenario: [SC-01.1] - Retrieve activity rankings using an exact city name.
```

## Checklist

- Uma classe de Steps individual existe para o cenário.
- Ela estende `BaseClass`; o log inicial é gerado pelo hook `Before`.
- O spec é apenas uma ponte entre Gherkin e Steps.
- Todo estado mutável do cenário fica no `CucumberWorld`, não na classe de Steps.
- Toda regra e validação booleana está em um Page Object.
- Cada assertion usa `this.assert` com mensagem de sucesso e de falha.
- Não foi criado nem usado um fluxo compartilhado de Steps para o cenário.
- O feature isolado foi executado e os logs estão legíveis.

## Executar um feature isolado

```powershell
npm test e2e-tests\SC-01.1-Validate_Exact_City_Search.feature
```

Os Steps permanecem sem estado específico do cenário e o `cucumber.js` mantém `parallel: 0` para uma execução determinística durante esta fase.
