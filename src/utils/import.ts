export async function asyncImport(path: string, whenFails: any = undefined) {
    try {
        return await import(path)
    } catch(e) {
        return whenFails;
    }
}

export function requireNoFail(path: string, whenFails: any = undefined) {
    try {
        return require(path)
    } catch (e) {
        return whenFails;
    }
}