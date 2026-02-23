
interface D1Result<T = unknown> {
    results: T[];
    success: boolean;
    meta: any;
}

interface D1PreparedStatement {
    bind(...args: any[]): D1PreparedStatement;
    first<T = unknown>(colName?: string): Promise<T | null>;
    run(): Promise<D1Result>;
    all<T = unknown>(): Promise<D1Result<T>>;
    raw<T = unknown>(): Promise<T[]>;
}

interface D1Database {
    prepare(query: string): D1PreparedStatement;
    dump(): Promise<ArrayBuffer>;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
    exec(query: string): Promise<D1Result>;
}

interface R2Bucket {
    put(key: string, value: any, options?: any): Promise<any>;
    get(key: string): Promise<any>;
    delete(key: string): Promise<any>;
}

interface CloudflareEnv {
    DB: D1Database;
    BUCKET: R2Bucket;
    RESEND_API_KEY?: string;
}
