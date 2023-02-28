export interface Breeding {
    id: number;
    farmGuid: string;
    pigType: string;
    breedingNo: string;
    breedingName: string;
    breedingDate: string | null;
    comment: string;
    createDate: string | null;
    createBy: number | null;
    updateDate: string | null;
    updateBy: number | null;
    deleteDate: string | null;
    deleteBy: number | null;
    status: number | null;
    guid: string;
}

export interface Breeding2Pig {
    id: number;
    breedingGuid: string;
    pigGuid: string;
}
