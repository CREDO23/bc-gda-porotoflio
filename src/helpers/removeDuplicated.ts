export const removeDuplicatedItem = (
    items: string[] | number[]
): string[] | number[] => {
    const existingItems = {};
    const newItems = [];

    for (let item of items) {
        console.log(typeof item);
        if (typeof item !== 'number') {
            item = String(item);
        }

        console.log(existingItems);

        if (!existingItems[item]) {
            existingItems[item] = true;
            newItems.push(item);
        }
    }

    return newItems;
};
