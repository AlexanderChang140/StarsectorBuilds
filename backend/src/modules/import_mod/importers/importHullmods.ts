import type { PoolClient } from 'pg';

import type { ModInfo } from './importMod.ts';
import { insertJunctionItems } from '../../../db/helpers/insert.ts';
import {
    insertHullmod,
    insertHullmodInstance,
    insertHullmodVersion,
    insertHullmodData,
    insertHullmodTag,
    insertHullmodTagJunction,
    insertHullmodUiTag,
    insertHullmodUiTagJunction,
} from '../../hullmods/service.ts';
import type { PreparedFullHullmod } from '../../hullmods/types.ts';
import { insertImage } from '../../images/service.ts';
import type { PreparedImage } from '../../images/types.ts';
import { buildImage } from '../parsers/imageParser.ts';

export async function importHullmods(
    modInfo: ModInfo,
    client: PoolClient,
    hullmods: {
        preparedFullHullmods: Record<string, PreparedFullHullmod>;
        preparedImages: Record<string, PreparedImage | null>;
    },
): Promise<boolean> {
    const { preparedFullHullmods, preparedImages } = hullmods;

    let dataChanged = false;
    for (const [code, hullmod] of Object.entries(preparedFullHullmods)) {
        const preparedImage = preparedImages[code] ?? null;
        const image = buildImage(modInfo.modCode, 'hullmods', preparedImage);

        const imageId = image
            ? (await insertImage(image, { returning: ['id'], client })).id
            : null;

        const hullmodId = (
            await insertHullmod(
                { mod_id: modInfo.modId, code: code },
                { returning: ['id'], client },
            )
        ).id;

        const { id: hullmodInstanceId, inserted } = await insertHullmodInstance(
            { hullmod_id: hullmodId, ...hullmod.preparedHullmodInstance },
            { returning: ['id'], client },
        );
        dataChanged ||= inserted;

        await insertHullmodVersion(
            {
                mod_version_id: modInfo.modVersionId,
                hullmod_id: hullmodId,
                hullmod_instance_id: hullmodInstanceId,
                hullmod_image_id: imageId,
            },
            { client },
        );

        if (!inserted) continue;

        await insertHullmodData(
            {
                hullmod_instance_id: hullmodInstanceId,
                ...hullmod.preparedHullmodData,
            },
            { client },
        );

        insertJunctionItems(
            hullmod.hullmodTags,
            hullmodInstanceId,
            insertHullmodTag,
            insertHullmodTagJunction,
            { instanceKey: 'hullmod_instance_id', itemKey: 'tag_id' },
            client,
        );

        insertJunctionItems(
            hullmod.hullmodUiTags,
            hullmodInstanceId,
            insertHullmodUiTag,
            insertHullmodUiTagJunction,
            { instanceKey: 'hullmod_instance_id', itemKey: 'tag_id' },
            client,
        );
    }
    console.log(`Successfully imported hullmods from: ${modInfo.modCode}`);
    return dataChanged;
}
