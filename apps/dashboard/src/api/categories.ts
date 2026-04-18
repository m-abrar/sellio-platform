import client from '@/lib/api-client';

export const flattenCategories = (items: any[], prefix = '') => {
    let list: any[] = [];
    items.forEach(cat => {
        const displayTitle = prefix ? `${prefix} / ${cat.title}` : cat.title;
        list.push({ id: cat.id, title: displayTitle });
        if (cat.children?.length > 0) {
            list = [...list, ...flattenCategories(cat.children, displayTitle)];
        }
    });
    return list;
};

export const getCategories = async () => {
    const response = await client.get('/v1/categories');
    return flattenCategories(response.data.data);
};