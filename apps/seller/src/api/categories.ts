import { getProductFormMeta } from './products';

export const getCategories = async () => {
  const meta = await getProductFormMeta();
  return meta.categories;
};

export const getBrands = async () => {
  const meta = await getProductFormMeta();
  return meta.brands;
};
