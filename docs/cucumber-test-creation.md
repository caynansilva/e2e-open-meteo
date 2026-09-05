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
| BaseClass | Reutilizar fixture, Page Object, resposta, log inicial e assertion. | Conter comportamento específico de um cenário. |
| Page Object | Implementar buscas, regras e validações booleanas do domínio. | Conhecer Gherkin ou Cucumber. |

## Como criar um cenário

1. Escreva o `.feature` com Given/When/Then de negócio.
2. Crie o `*.spec.ts` correspondente. Cada frase deve delegar diretamente para um método público da classe de Steps.
3. Crie uma classe de Steps exclusiva para o cenário, estendendo `BaseClass`.
4. No construtor, chame `super()`, defina `testName` com o título exato do cenário e chame `startTestMessage()`.
5. Use `mockData` para preparar os dados e `actMgr` para chamar comportamentos públicos de `ActivityManager`.
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

### Steps individual

```ts
import { BaseClass } from "src/BaseClass";

export class ScXxScenarioSteps extends BaseClass {
  public requestedCity: string;

  constructor() {
    super();
    this.testName = "[SC-XX.X] - Resultado esperado";
    this.startTestMessage();
  }

  public PREPARAR_CONTEXTO_DE_NEGOCIO(): void {
    this.requestedCity = this.mockData.getRandomCityName();
  }

  public OBTER_RESPOSTA(): void {
    this.activityObject = this.mockData.returnWeatherSensitiveMockData(
      this.requestedCity
    );
  }

  public VALIDAR_RESULTADO_ESPERADO(): void {
    this.actMgr.setCityActivities([this.activityObject]);

    this.assert(
      this.actMgr.assertCityActivityExists(this.activityObject),
      'Success! The field "City Name" exists in the contract!',
      'Fail! The field "City Name" does not exist in the contract!'
    );

    this.assert(
      this.actMgr.assertCityNameMatches(this.activityObject, this.requestedCity),
      `Success! The field "CityName" matches the expected result "${this.requestedCity}"!`,
      `Fail! The field "CityName" does not match the expected result "${this.requestedCity}"!`
    );
  }
}
```

## Assertions e logs

`BaseClass.assert(condition, successMessage, failMessage)` é obrigatório para resultados esperados do cenário:

- quando a condição é verdadeira, imprime `successMessage`;
- quando é falsa, imprime `failMessage` e lança um erro, deixando o step e o cenário vermelhos;
- cada mensagem deve indicar claramente o campo ou comportamento testado; inclua o valor esperado quando fizer sentido.

O construtor gera o cabeçalho do cenário antes dos steps, por exemplo:

```text
Starting tests for Scenario: [SC-01.1] - Retrieve activity rankings using an exact city name.
```

## Checklist

- Uma classe de Steps individual existe para o cenário.
- Ela estende `BaseClass` e inicia o log com seu `testName`.
- O spec é apenas uma ponte entre Gherkin e Steps.
- Toda regra e validação booleana está em um Page Object.
- Cada assertion usa `this.assert` com mensagem de sucesso e de falha.
- Não foi criado nem usado um fluxo compartilhado de Steps para o cenário.
- O feature isolado foi executado e os logs estão legíveis.

## Executar um feature isolado

```powershell
npm test e2e-tests\SC-01.1-Validate_Exact_City_Search.feature
```

Este padrão mantém estado nos campos da classe de Steps; portanto, a configuração atual deve continuar executando cenários de forma serial. Antes de habilitar paralelismo, migre o estado para uma estrutura isolada por cenário.
