export abstract class ApiGateway {
    readonly sourceHost =  process.env.SOURCE_HOST;
    readonly targetHost =  process.env.TARGET_HOST;

    readonly sourceToken = process.env.SOURCE_TOKEN;
    readonly targetToken = process.env.TARGET_TOKEN;
}