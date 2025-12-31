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
    | `/api/${ShipRoute}`
    | `/api/${WeaponRoute}`
    | `/api/${HullmodRoute}`
    | `/api/wings`;

export type ControlParams = {
    fields: string;
    sort: string;
    order: 'ASC' | 'DESC';
    limit: number;
    offset: number;
};

export type Filters = Record<string, string | string[] | number | undefined>;

export type ApiRequest<TApiEndpoint extends ApiEndpoint> = {
    endpoint: TApiEndpoint;
    params?: Partial<ControlParams & Filters>;
};
