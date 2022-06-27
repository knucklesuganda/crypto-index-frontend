
export const INDEX_PAGE = '/';
export const PRODUCT_PAGE = '/product/index/:productAddress';

export function createProductPage(productType, id){
    return PRODUCT_PAGE.replace(':productAddress', id).replace(':productType', productType);
}
