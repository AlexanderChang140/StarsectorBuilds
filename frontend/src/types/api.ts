export type WeaponRoute = `weapons/${WeaponSubRoute}`;
export type WeaponSubRoute = 'table' | `${number}/versions`;

export type ShipRoute = `ships/${ShipSubRoute}`;
export type ShipSubRoute =
    | 'table'
    | `${number}/versions`
    | `ship-versions/${number}`
    | `ship-versions/${number}/slots`;

export type HullmodRoute = `hullmods/${HullmodSubRoute}`;
export type HullmodSubRoute = `table`;

export type ApiEndpoint =
    | `/api/${ShipRoute}`
    | `/api/${WeaponRoute}`
    | `/api/${HullmodRoute}`
    | `/api/wings`;