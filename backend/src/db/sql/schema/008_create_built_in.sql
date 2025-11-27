CREATE TABLE IF NOT EXISTS built_in_weapons
(
    ship_instance_id integer NOT NULL,
    weapon_id integer NOT NULL,
    slot_code text NOT NULL,
    PRIMARY KEY (ship_instance_id, slot_code),
    FOREIGN KEY (ship_instance_id, slot_code) REFERENCES ship_weapon_slots(ship_instance_id, code) ON DELETE CASCADE,
    FOREIGN KEY (weapon_id) REFERENCES weapons(id)
);

CREATE TABLE IF NOT EXISTS built_in_hullmods
(
    ship_instance_id integer NOT NULL,
    hullmod_id integer NOT NULL,
    PRIMARY KEY (ship_instance_id, hullmod_id),
    FOREIGN KEY (ship_instance_id) REFERENCES ship_instances(id) ON DELETE CASCADE,
    FOREIGN KEY (hullmod_id) REFERENCES hullmods(id)
);

CREATE TABLE IF NOT EXISTS built_in_wings
(
    ship_instance_id integer NOT NULL,
    ship_id integer NOT NULL,
    num_wings integer NOT NULL,
    PRIMARY KEY (ship_instance_id, ship_id),
    FOREIGN KEY (ship_instance_id) REFERENCES ship_instances(id) ON DELETE CASCADE,
    FOREIGN KEY (ship_id) REFERENCES ships(id)
);