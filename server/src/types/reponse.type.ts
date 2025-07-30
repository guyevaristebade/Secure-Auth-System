/**
 * Représente la structure standard d'une réponse pour les requêtes du serveur.
 *
 * Utilise cette interface pour uniformiser les réponses de ton API et faciliter le traitement côté client.
 */
interface ResponseType<T> {
    ok: boolean;
    status: number;
    data: T | null;
    message?: string;
    error?: string;
}

// alias de type pour une réponse générique
export type ApiResponse<T = any> = ResponseType<T>;
