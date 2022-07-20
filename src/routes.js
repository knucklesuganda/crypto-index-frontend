
export const INDEX_PAGE = '/';

const PRODUCT_PAGE = '/product/:productType/:productAddress';
export const INDEX_PRODUCT_PAGE = PRODUCT_PAGE.replace(':productType', 'index');
export const SAFETOKEN_PRODUCT_PAGE = PRODUCT_PAGE.replace(':productType', 'safe_token');

export function createIndexProductPage(address){
    return INDEX_PRODUCT_PAGE.replace(':productAddress', address);
}

export function createSafeTokenPage(address){
    return SAFETOKEN_PRODUCT_PAGE.replace(':productAddress', address);
}
