export type ModRoute = `${ModSubRoute}`;
export type ModSubRoute = 'mods' | 'mods/search/display_name' | 'mod-versions';

export type WeaponRoute = `${WeaponSubRoute}`;
export type WeaponSubRoute =
    | `weapons/${number}/versions`
    | `weapons/${number}/versions/latest`
    | 'weapon-versions'
    | `weapon-versions/${number}`;

export type ShipRoute = `${ShipSubRoute}`;
export type ShipSubRoute =
    | `ships/${number}/versions`
    | `ships/${number}/versions/latest`
    | 'ship-versions'
    | `ship-versions/${number}`
    | `ship-versions/${number}/slots`;

export type HullmodRoute = `${HullmodSubRoute}`;
export type HullmodSubRoute = `hullmod-versions`;

export type ApiEndpoint =
    | `/api/${ModRoute}`
    | `/api/${ShipRoute}`
    | `/api/${WeaponRoute}`
    | `/api/${HullmodRoute}`
    | `/api/wings`;

export type MatchType = 'exact' | 'contains' | 'starts_with' | 'ends_with';

export type Filter = {
    values: (string | number | boolean)[];
    match?: MatchType;
    not?: boolean;
};

export type ControlParams = {
    q: string;
    fields: string;
    filter: Record<string, Filter>;
    sort: string;
    order: 'ASC' | 'DESC';
    limit: number;
    offset: number;
};

export type ApiRequest<TApiEndpoint extends ApiEndpoint> = {
    endpoint: TApiEndpoint;
    params?: Partial<ControlParams>;
};
