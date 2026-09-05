import {
    createServer,
    type IncomingMessage,
    type Server,
    type ServerResponse
} from "node:http";
import {
    createForecastResponse,
    getCityFixtures
} from "./OpenMeteoFixtures";
import type {
    OpenMeteoLocation,
    OpenMeteoMockServerOptions,
    OpenMeteoRequest,
    OpenMeteoSearchResponse
} from "./OpenMeteoTypes";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 4010;

export class OpenMeteoMockServer {
    private readonly server: Server;
    private readonly requests: OpenMeteoRequest[] = [];
    public readonly host: string;
    private listeningPort: number;

    constructor(options: OpenMeteoMockServerOptions = {}) {
        this.host = options.host ?? process.env.OPEN_METEO_MOCK_HOST ?? DEFAULT_HOST;
        this.listeningPort = options.port ?? this.getConfiguredPort();
        this.server = createServer((request, response) => {
            this.handleRequest(request, response);
        });
    }

    public get port(): number {
        return this.listeningPort;
    }

    public get baseUrl(): string {
        return `http://${this.host}:${this.listeningPort}`;
    }

    public async start(): Promise<string> {
        if (this.server.listening) {
            return this.baseUrl;
        }

        await this.listen();
        return this.baseUrl;
    }

    public async stop(): Promise<void> {
        if (!this.server.listening) {
            return;
        }

        await new Promise<void>((resolve, reject) => {
            this.server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }

    public getRequests(): OpenMeteoRequest[] {
        return this.requests.map((request) => ({
            ...request,
            query: { ...request.query }
        }));
    }

    public resetRequests(): void {
        this.requests.length = 0;
    }

    public reset(): void {
        this.resetRequests();
    }

    private listen(): Promise<void> {
        return new Promise((resolve, reject) => {
            const handleError = (error: Error): void => {
                this.server.off("listening", handleListening);
                reject(error);
            };
            const handleListening = (): void => {
                this.server.off("error", handleError);
                this.updateListeningPort();
                resolve();
            };

            this.server.once("error", handleError);
            this.server.once("listening", handleListening);
            this.server.listen(this.listeningPort, this.host);
        });
    }

    private updateListeningPort(): void {
        const address = this.server.address();

        if (!address || typeof address === "string") {
            throw new Error("Open-Meteo mock did not expose a TCP address.");
        }

        this.listeningPort = address.port;
    }

    private handleRequest(
        request: IncomingMessage,
        response: ServerResponse
    ): void {
        const requestUrl = this.createRequestUrl(request);

        this.recordRequest(request, requestUrl);

        if (request.method !== "GET") {
            this.sendJson(response, 405, { error: "Only GET is supported." });
            return;
        }

        if (requestUrl.pathname === "/v1/search") {
            this.handleSearchRequest(requestUrl, response);
            return;
        }

        if (requestUrl.pathname === "/v1/forecast") {
            this.handleForecastRequest(requestUrl, response);
            return;
        }

        this.sendJson(response, 404, { error: "Open-Meteo route not found." });
    }

    private handleSearchRequest(
        requestUrl: URL,
        response: ServerResponse
    ): void {
        const name = requestUrl.searchParams.get("name")?.trim() ?? "";
        const count = this.getResultCount(requestUrl.searchParams.get("count"));

        if (count === undefined) {
            this.sendJson(response, 400, {
                error: "count must be a positive integer."
            });
            return;
        }

        const results = this.findLocations(name, count);
        const searchResponse: OpenMeteoSearchResponse = { results };

        this.sendJson(response, 200, searchResponse);
    }

    private handleForecastRequest(
        requestUrl: URL,
        response: ServerResponse
    ): void {
        const latitude = this.getNumericParameter(requestUrl, "latitude");
        const longitude = this.getNumericParameter(requestUrl, "longitude");

        if (latitude === undefined || longitude === undefined) {
            this.sendJson(response, 400, {
                error: "latitude and longitude must be numeric values."
            });
            return;
        }

        const startDate = requestUrl.searchParams.get("start_date") ??
            this.getCurrentUtcDate();
        const timezone = requestUrl.searchParams.get("timezone") ?? "UTC";

        try {
            const forecastResponse = createForecastResponse(
                latitude,
                longitude,
                timezone,
                startDate
            );
            this.sendJson(response, 200, forecastResponse);
        } catch (error: unknown) {
            this.sendJson(response, 400, {
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    private findLocations(name: string, count: number): OpenMeteoLocation[] {
        const normalizedName = name.toLowerCase();

        if (!normalizedName) {
            return [];
        }

        return getCityFixtures()
            .filter((location) =>
                location.name.toLowerCase().includes(normalizedName)
            )
            .slice(0, count);
    }

    private getResultCount(countValue: string | null): number | undefined {
        if (countValue === null) {
            return 10;
        }

        const count = Number(countValue);
        return Number.isInteger(count) && count > 0 ? count : undefined;
    }

    private getNumericParameter(
        requestUrl: URL,
        parameterName: string
    ): number | undefined {
        const parameterValue = requestUrl.searchParams.get(parameterName);

        if (parameterValue === null || parameterValue.trim() === "") {
            return undefined;
        }

        const numericValue = Number(parameterValue);
        return Number.isFinite(numericValue) ? numericValue : undefined;
    }

    private createRequestUrl(request: IncomingMessage): URL {
        const host = request.headers.host ?? `${this.host}:${this.port}`;
        return new URL(request.url ?? "/", `http://${host}`);
    }

    private recordRequest(request: IncomingMessage, requestUrl: URL): void {
        this.requests.push({
            method: request.method ?? "UNKNOWN",
            path: requestUrl.pathname,
            url: requestUrl.href,
            query: Object.fromEntries(requestUrl.searchParams.entries())
        });
    }

    private sendJson(
        response: ServerResponse,
        statusCode: number,
        body: unknown
    ): void {
        const responseBody = JSON.stringify(body);

        response.writeHead(statusCode, {
            "content-type": "application/json; charset=utf-8"
        });
        response.end(responseBody);
    }

    private getCurrentUtcDate(): string {
        return new Date().toISOString().slice(0, 10);
    }

    private getConfiguredPort(): number {
        const configuredPort = process.env.OPEN_METEO_MOCK_PORT;

        if (configuredPort === undefined) {
            return DEFAULT_PORT;
        }

        const port = Number(configuredPort);

        if (!Number.isInteger(port) || port < 0 || port > 65535) {
            throw new Error(
                `OPEN_METEO_MOCK_PORT must be an integer from 0 to 65535. ` +
                `Received: ${configuredPort}.`
            );
        }

        return port;
    }
}

async function runStandaloneServer(): Promise<void> {
    const mockServer = new OpenMeteoMockServer();
    await mockServer.start();

    console.log(`Open-Meteo mock listening at ${mockServer.baseUrl}`);

    const stopServer = async (): Promise<void> => {
        await mockServer.stop();
        process.exit(0);
    };

    process.once("SIGINT", () => void stopServer());
    process.once("SIGTERM", () => void stopServer());
}

if (require.main === module) {
    void runStandaloneServer().catch((error: unknown) => {
        console.error(error);
        process.exitCode = 1;
    });
}
