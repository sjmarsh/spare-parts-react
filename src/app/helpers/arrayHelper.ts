import WithId from "../types/withId"

const updateArrayItem = <T extends WithId>(array : Array<T>, updatedItem: T)  => {
    return array.map((item) => {
        if (item.id !== updatedItem.id) {
            return item
        }
        return {
            ...item,
            ...updatedItem
        }
    });
}

export {
    updateArrayItem
}