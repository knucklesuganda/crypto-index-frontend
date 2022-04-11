
export const INDEX_PAGE = '/';
export const PRODUCT_PAGE = '/product/:productAddress';


export function createProductPage(id){
    return PRODUCT_PAGE.replace(':productAddress', id);
}
