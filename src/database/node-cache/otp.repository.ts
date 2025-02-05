import NodeCache from "node-cache";

class CacheOtpRepositoryClass {
    private readonly _cache = new NodeCache();

    set(keyName: string, keyValue: string, ttl?: number) {
        return this._cache.set(keyName, keyValue, ttl ?? 120);
    }

    get(keyName: string): unknown {
        return this._cache.get(keyName);
    }

    delete(keyName: string): boolean {
        return !!this._cache.del(keyName);
    }
}

export const CacheOtpRepository = new CacheOtpRepositoryClass();
