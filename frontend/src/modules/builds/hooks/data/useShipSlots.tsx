import type { ShipData } from '../../types';
import useSlotsQuery from '../queries/useSlotsQuery';

interface UseShipSlotsProps {
    shipData: ShipData;
}

export function useShipSlots({ shipData }: UseShipSlotsProps) {
    const query = useSlotsQuery(shipData.ship_version_id);
    const data = query.data?.data ?? [];
    const record = Object.fromEntries(
        data.map((row) => [
            row.weapon_slot_id,
            {
                ...row,
                x: Number(row.x),
                y: Number(row.y),
                arc: Number(row.arc),
                angle: Number(row.angle),
            },
        ]),
    );

    return { data, record };
}
