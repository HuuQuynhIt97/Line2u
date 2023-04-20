export interface Cart {
    id: number;
    createDate: string | null;
    createBy: number | null;
    updateDate: string | null;
    updateBy: number | null;
    status: number | null;
    startDate: string | null;
    endDate: string | null;
    guid: string;
    accountUid: string;
    productGuid: string;
    productPrice: string;
    storeGuid: string;
    isCheckout: number;
    productId: number;
    photoPath: string;
    productName: string;
    productPrices: string;
    productPriceDiscount: string;
    productDescription: string;
    quantity: number;
    productSize: any;
    productSizeAdd: any;
    productOption: any;
    productOptionAdd: any;
    productOfAllPrice: any;
}
