export interface Products {
    id: number;
    productName: string | null;
    productDescription: string | null;
    categoryGuid: string | null;
    productPrice: string;
    productPriceDiscount: string;
    photoPath: string;
    body: string;
    comment: string;
    createDate: string | null;
    createBy: number | null;
    updateDate: string | null;
    updateBy: number | null;
    status: number | null;
    startDate: string | null;
    endDate: string | null;
    guid: string;
    accountUid: string;
    file: any;
    quantity: number;
    total: number;
    price: number
    storeGuid: string
}
