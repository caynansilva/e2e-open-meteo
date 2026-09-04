import { Page } from "@playwright/test";

type PageObjectConstructor<T = unknown> = new (page: Page) => T;

/**
 * PageFactory - Generic factory for creating page object instances
 * 
 * This class provides a flexible way to instantiate page objects:
 * - Type-safe page object creation
 * - Centralized page object instantiation
 * - Support for custom page object classes
 * 
 * Usage:
 * ```typescript
 * const factory = new PageFactory(page);
 * const loginPage = factory.create(LoginPage);
 * ```
 */
export class PageFactory {
  private page: Page;
  private readonly pageCache = new Map<PageObjectConstructor, unknown>();

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Create an instance of a page object class
   * @param PageClass - The page object class to instantiate
   * @returns Instance of the page object
   */
  public create<T>(PageClass: PageObjectConstructor<T>): T {
    if (this.pageCache.has(PageClass)) {
      return this.pageCache.get(PageClass) as T;
    }

    const instance = new PageClass(this.page);
    this.pageCache.set(PageClass, instance);

    return instance;
  }

  /**
   * Get or create a page object instance
   * Same as create() but with explicit caching semantics
   */
  public getOrCreate<T>(PageClass: PageObjectConstructor<T>): T {
    return this.create(PageClass);
  }

  /**
   * Clear the page object cache
   * Useful when navigating to a new context
   */
  public clearCache(): void {
    this.pageCache.clear();
  }

  /**
   * Get the underlying Playwright page
   */
  public getPage(): Page {
    return this.page;
  }

  /**
   * Update the underlying page (useful for new tabs/windows)
   */
  public setPage(page: Page): void {
    this.page = page;
    this.clearCache();
  }
}

/**
 * Create page objects helper function
 * 
 * Usage:
 * ```typescript
 * const { loginPage, homePage } = createPageObjects(page, {
 *   loginPage: LoginPage,
 *   homePage: HomePage,
 * });
 * ```
 */
export function createPageObjects<
  T extends Record<string, PageObjectConstructor>
>(
  page: Page,
  pageClasses: T
): { [K in keyof T]: InstanceType<T[K]> } {
  const factory = new PageFactory(page);
  const result = {} as { [K in keyof T]: InstanceType<T[K]> };

  for (const key of Object.keys(pageClasses) as Array<keyof T>) {
    const PageClass = pageClasses[key];
    if (!PageClass) {
      continue;
    }
    result[key] = factory.create(PageClass) as InstanceType<T[typeof key]>;
  }

  return result;
}
