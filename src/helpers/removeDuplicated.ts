export const removeDuplicatedItem = (
    items: string[] | number[]
): string[] | number[] => {
    const existingItems = {};
    const newItems = [];

    for (let item of items) {
        if (typeof item !== 'number') {
            item = String(item);
        }

        if (!existingItems[item]) {
            existingItems[item] = true;
            newItems.push(item);
        }
    }

    return newItems;
};
