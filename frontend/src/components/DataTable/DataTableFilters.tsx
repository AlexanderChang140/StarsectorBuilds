import { useEffect, useState } from 'react';
import {
    Button,
    Label,
    Popover,
    Select,
    SelectValue,
} from 'react-aria-components';
import type { SetURLSearchParams } from 'react-router';

import type { Item } from '@/types/component';
import { typedEntries } from '@/utils/object';
import { sortSubset } from '@/utils/sort';

import styles from './DataTableFilters.module.css';
import { ListBox, ListBoxItem } from '../ListBox/ListBox';

export type TableFilter<TData> = {
    field: keyof TData & string;
    label: string;
    items: readonly Item[];
    isMultiSelect: boolean;
};

interface DataTableFiltersProps<TData> {
    tableFilters: readonly TableFilter<TData>[];
    setSearchParams: SetURLSearchParams;
}

export default function DataTableFilters<TData>({
    tableFilters,
    setSearchParams,
}: DataTableFiltersProps<TData>) {
    const [currSelected, setCurrSelected] = useState<
        Partial<Record<string, string[]>>
    >({});

    useEffect(() => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            typedEntries(currSelected).forEach(([field, items]) => {
                params.delete(field);
                items?.forEach((value) => {
                    params.append(field, value);
                });
            });
            return params;
        });
    }, [setSearchParams, currSelected]);

    const handleSelectionChange = (
        field: string,
        selection: (string | number)[],
    ) => {
        setCurrSelected((prev) => {
            const selected = [...selection].map(String);
            return { ...prev, [field]: selected };
        });
    };

    return tableFilters.map((filter) => {
        return (
            <Select
                key={filter.field}
                className={styles.select}
                selectionMode="multiple"
                value={sortSubset(
                    filter.items.map((item) => item.value),
                    currSelected[filter.field] ?? [],
                )}
                onChange={(value) => handleSelectionChange(filter.field, value)}
            >
                <Label className={styles.label}>{filter.label}</Label>
                <Button className={styles.button}>
                    <SelectValue />
                </Button>
                <Popover className={styles.content}>
                    <ListBox>
                        {filter.items.map(({ value, label }) => (
                            <ListBoxItem key={value} id={value}>
                                {label}
                            </ListBoxItem>
                        ))}
                    </ListBox>
                </Popover>
            </Select>
        );
    });
}
