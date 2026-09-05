import type { ActivityRankingHttpResponse } from "./ActivityRankingApiClient";

export class ActivityRankingHttpAssertions {
    public assertStatusCode(
        response: ActivityRankingHttpResponse,
        expectedStatus: number
    ): boolean {
        return response.status === expectedStatus;
    }

    public assertJsonContentType(
        response: ActivityRankingHttpResponse
    ): boolean {
        return response.headers
            .get("content-type")
            ?.toLowerCase()
            .includes("application/json") ?? false;
    }

    public assertClientErrorResponse(
        response: ActivityRankingHttpResponse
    ): boolean {
        return this.getErrorText(response.body).length > 0;
    }

    public assertMethodNotAllowedResponse(
        response: ActivityRankingHttpResponse
    ): boolean {
        const errorText = this.getErrorText(response.body).toLowerCase();

        return errorText.includes("method") &&
            errorText.includes("not allowed");
    }

    public assertEndpointNotFoundResponse(
        response: ActivityRankingHttpResponse
    ): boolean {
        const errorText = this.getErrorText(response.body).toLowerCase();

        return (errorText.includes("endpoint") || errorText.includes("route")) &&
            errorText.includes("not found");
    }

    private getErrorText(body: unknown): string {
        if (typeof body === "string") {
            return body.trim();
        }

        if (this.isErrorObject(body)) {
            return body.error ?? body.message ?? "";
        }

        return "";
    }

    private isErrorObject(
        body: unknown
    ): body is { error?: string; message?: string } {
        return typeof body === "object" && body !== null;
    }
}
