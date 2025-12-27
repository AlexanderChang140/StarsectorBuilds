export type WeaponRoute = `${WeaponSubRoute}`;
export type WeaponSubRoute = 'weapon-versions' | `weapons/${number}/versions`;

export type ShipRoute = `${ShipSubRoute}`;
export type ShipSubRoute =
    | 'ship-versions'
    | `ships/${number}/versions`
    | `ship-versions/${number}/slots`;

export type HullmodRoute = `${HullmodSubRoute}`;
export type HullmodSubRoute = `hullmod-versions`;

export type ApiEndpoint =
    | `/api/${ShipRoute}`
    | `/api/${WeaponRoute}`
    | `/api/${HullmodRoute}`
    | `/api/wings`;
