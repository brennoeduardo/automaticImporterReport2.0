interface OpcoesRetry {
    tentativas?: number;
    esperaMs?: number;
    backoff?: boolean;
    rotulo?: string;
}

export async function comRetry<T>(
    fn: () => Promise<T>,
    { tentativas = 3, esperaMs = 6000, backoff = true, rotulo = 'operação' }: OpcoesRetry = {}
): Promise<T> {
    let ultimoErro: unknown;

    for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
        try {
            return await fn();
        } catch (err) {
            ultimoErro = err;
            console.warn(`[${rotulo}] falhou na tentativa ${tentativa}/${tentativas}: ${(err as Error).message}`);

            if (tentativa < tentativas) {
                const espera = backoff ? esperaMs * tentativa : esperaMs;
                console.warn(`[${rotulo}] tentando de novo em ${espera}ms...`);
                await new Promise((r) => setTimeout(r, espera));
            }
        }
    }

    throw new Error(`[${rotulo}] falhou após ${tentativas} tentativas`, { cause: ultimoErro });
}