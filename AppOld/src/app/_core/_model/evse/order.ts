export interface Order {
    id: number;
    totalPrice: number | null;
    isDelete: boolean;
    byingStatus: boolean;
    pendingStatus: boolean;
    completeStatus: boolean;
    fullName: string | null;
    createDate: string | null;
    createBy: number | null;
    updateDate: string | null;
    updateBy: number | null;
    status: number | null;
    startDate: string | null;
    endDate: string | null;
    guid: string;
    accountId: number;
    productGuid: string;
    storeGuid: string;
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    customerEmail: string;
    paymentType: string;
    isPayment: string;
    delivery: string;
    quantity: number;
    products: any;
}
