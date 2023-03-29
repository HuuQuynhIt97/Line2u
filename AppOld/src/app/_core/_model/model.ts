
export interface AbattoirLevel {
    id: number;
    farmGuid: string;
    level: string;
    levelLower: string;
    levelUpper: string;
    discount: number | null;
    carcassLower: number | null;
    carcassUpper: number | null;
    footWeight: number | null;
    comment: string;
    cancelFlag: string;
    createDate: string | null;
    createBy: number | null;
    updateDate: string | null;
    updateBy: number | null;
    status: number | null;
    guid: string;
    transferType: string;
}


export interface RecordAccidentFee {
    id: number;
    farmGuid: string;
    makeOrderGuid: string;
    type: string;
    accidentDisease: string;
    saleGuid: string;
    accidentQty: number | null;
    accidentFee: number | null;
    comment: string;
    createDate: string | null;
    createBy: number | null;
    updateDate: string | null;
    updateBy: number | null;
    status: number | null;
    guid: string;
}

export interface TransferFee {
    id: number;
    farmGuid: string;
    transferYear: string;
    transferMonth: string;
    unitPrice: number | null;
    reservePrice: number | null;
    twaveragePrice: number | null;
    tpaveragePrice: number | null;
    keepBreedingStartWeight: number | null;
    keepBreedingEndWeight: number | null;
    breedingStartWeight: number | null;
    breedingEndWeight: number | null;
    comment: string;
    cancelFlag: string;
    createDate: string | null;
    createBy: number | null;
    updateDate: string | null;
    updateBy: number | null;
    status: number | null;
    guid: string;
    transferType: string;
}
