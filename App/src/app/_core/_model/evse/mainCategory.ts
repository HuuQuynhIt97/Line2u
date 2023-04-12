export interface MainCategory {
    id: number;
    categoryName: string | null;
    body: string;
    comment: string;
    createDate: string | null;
    createBy: number | null;
    storeId: number | null;
    updateDate: string | null;
    updateBy: number | null;
    photoPath: string;
    status: number | null;
    startDate: string | null;
    endDate: string | null;
    guid: string;
    accountUid: string;
    file: any;
}
