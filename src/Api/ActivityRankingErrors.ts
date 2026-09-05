function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function getTransportErrorDetail(error: unknown): string {
    if (!(error instanceof Error)) {
        return String(error);
    }

    if (error.cause && typeof error.cause === "object") {
        const causeCode = "code" in error.cause ? error.cause.code : undefined;

        if (typeof causeCode === "string") {
            return `${causeCode}: ${error.message}`;
        }
    }

    return getErrorMessage(error);
}

function formatResponseBody(responseBody: unknown): string {
    if (responseBody === undefined) {
        return "";
    }

    if (typeof responseBody === "string") {
        return `: ${responseBody}`;
    }

    return `: ${JSON.stringify(responseBody)}`;
}

export type ActivityRankingApiErrorOptions = {
    status: number;
    statusText: string;
    requestUrl: string;
    responseBody?: unknown;
    method?: string;
};

export class ActivityRankingApiError extends Error {
    public readonly status: number;
    public readonly statusText: string;
    public readonly requestUrl: string;
    public readonly responseBody: unknown;
    public readonly method: string;

    constructor(options: ActivityRankingApiErrorOptions) {
        const method = options.method?.toUpperCase() ?? "GET";
        const statusDetail = `${options.status} ${options.statusText}`.trim();
        const message =
            `Activity Ranking API request failed: ${method} ${options.requestUrl} ` +
            `${statusDetail}${formatResponseBody(options.responseBody)}`;

        super(message);
        this.name = "ActivityRankingApiError";
        this.status = options.status;
        this.statusText = options.statusText;
        this.requestUrl = options.requestUrl;
        this.responseBody = options.responseBody;
        this.method = method;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class ActivityRankingTransportError extends Error {
    public readonly requestUrl: string;
    public readonly method: string;

    constructor(requestUrl: string, cause: unknown, method = "GET") {
        const normalizedMethod = method.toUpperCase();
        super(
            `Activity Ranking API request failed: ${normalizedMethod} ${requestUrl} ` +
            getTransportErrorDetail(cause),
            { cause }
        );
        this.name = "ActivityRankingTransportError";
        this.requestUrl = requestUrl;
        this.method = normalizedMethod;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
