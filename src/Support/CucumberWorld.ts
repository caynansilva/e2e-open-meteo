import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";

export class CucumberWorld extends World {
  public testData: Record<string, unknown> = {};

  constructor(options: IWorldOptions) {
    super(options);
  }

  public setData(key: string, value: unknown): void {
    this.testData[key] = value;
  }

  public getData<T>(key: string): T | undefined {
    return this.testData[key] as T;
  }

  public clearData(): void {
    this.testData = {};
  }
}

setWorldConstructor(CucumberWorld);
