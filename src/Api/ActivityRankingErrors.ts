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
};

export class ActivityRankingApiError extends Error {
    public readonly status: number;
    public readonly statusText: string;
    public readonly requestUrl: string;
    public readonly responseBody: unknown;

    constructor(options: ActivityRankingApiErrorOptions) {
        const statusDetail = `${options.status} ${options.statusText}`.trim();
        const message =
            `Activity Ranking API request failed: GET ${options.requestUrl} ` +
            `${statusDetail}${formatResponseBody(options.responseBody)}`;

        super(message);
        this.name = "ActivityRankingApiError";
        this.status = options.status;
        this.statusText = options.statusText;
        this.requestUrl = options.requestUrl;
        this.responseBody = options.responseBody;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class ActivityRankingTransportError extends Error {
    public readonly requestUrl: string;

    constructor(requestUrl: string, cause: unknown) {
        super(
            `Activity Ranking API request failed: GET ${requestUrl} ` +
            getTransportErrorDetail(cause),
            { cause }
        );
        this.name = "ActivityRankingTransportError";
        this.requestUrl = requestUrl;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
