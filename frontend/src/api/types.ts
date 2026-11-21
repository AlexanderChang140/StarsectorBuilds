export type ModRoute = `${ModSubRoute}`;
export type ModSubRoute = 'mods' | 'mods/search/display_name' | 'mod-versions';

export type ShipRoute = `${ShipSubRoute}`;
export type ShipSubRoute =
    | `ships/${number}/versions`
    | `ships/${number}/versions/latest`
    | 'ship-versions'
    | `ship-versions/${number}`
    | `ship-versions/${number}/slots`;

export type WeaponRoute = `${WeaponSubRoute}`;

export type WeaponSubRoute =
    | `weapons/${number}/versions`
    | `weapons/${number}/versions/latest`
    | 'weapon-versions'
    | `weapon-versions/${number}`;

export type WingRoute = `${WingSubRoute}`;
export type WingSubRoute = `wings/${number}/versions` | `wing-versions`;

export type HullmodRoute = `${HullmodSubRoute}`;
export type HullmodSubRoute = `hullmod-versions`;

export type BuildRoute = BuildSubRoute;
export type BuildSubRoute = 'builds' | `builds/${number}`;

export type ApiEndpoint =
    | '/api/signup'
    | '/api/login'
    | '/api/validate'
    | `/api/${ModRoute}`
    | `/api/${ShipRoute}`
    | `/api/${WeaponRoute}`
    | `/api/${WingRoute}`
    | `/api/${HullmodRoute}`
    | `/api/${BuildRoute}`
    | '/api/weapon-slots';

export type MatchType = 'exact' | 'contains' | 'starts_with' | 'ends_with';

export type Filter = {
    values: (string | number | boolean)[];
    match?: MatchType;
    not?: boolean;
};

export type Order = 'ASC' | 'DESC';

export type Sort<TKey extends string = string> = [TKey, Order];

export type ControlParams = {
    q: string;
    fields: string;
    filter: Record<string, Filter>;
    sort: Sort[];
    limit: number;
    offset: number;
};

export type ApiRequest<TApiEndpoint extends ApiEndpoint> = {
    endpoint: TApiEndpoint | null;
    params?: Partial<ControlParams>;
};
