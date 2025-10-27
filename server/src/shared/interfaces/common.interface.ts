export interface IPaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface IPaginatedResult<T> {
    items: T[];
    meta: IPaginationMeta;
}

export interface ITokenPayload {
    userId: string;
    sessionId?: string;
    type?: 'access' | 'refresh';
    iat?: number;
    exp?: number;
}

export interface IBaseClient<InitConfigType> {
    init(config?: InitConfigType):  Promise<void>;
    connect():                      Promise<void>;
    disconnect():                   Promise<void>;
    ping():                         Promise<"pong" | false>;
    
    readonly isConnected:           boolean;
}
