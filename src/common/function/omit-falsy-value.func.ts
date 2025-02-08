export function omitFalsyValue<T>(object: T) {
    for (const key in object) {
        if (!object[key]) delete object[key];
    }

    return object;
}
