export interface Site {
    id: number;
    type: string;
    siteNo: string;
    siteName: string;
    sitePrincipal: string;
    siteTel: string;
    siteAddress: string;
    siteLocation: string;
    sitePhoto: string;
    comment: string;
    createDate: string | null;
    createBy: number | null;
    updateDate: string | null;
    updateBy: number | null;
    deleteDate: string | null;
    deleteBy: number | null;
    status: number | null;
    guid: string;
    file: any;
    longitude: any;
    latitude: any;
    landlordGuid: any;
}
export interface ParkingLot {
    id: number;
    siteGuid: string;
    parkingLotType: string;
    parkingLotNo: string;
    parkingLotName: string;
    deviceGuid: string;
    deviceLr: string;
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
export interface Device {
    id: number;
    siteGuid: string;
    parkingLotGuid: string;
    deviceType: string;
    deviceNo: string;
    deviceName: string;
    deviceLeftNo: string;
    deviceLeftGuid: string;
    deviceRightNo: string;
    deviceRightGuid: string;
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
export interface Landlord {
    id: number;
    siteGuid: string;
    uid: string;
    upwd: string;
    landLordNo: string;
    landLordName: string;
    landLordIdcard: string;
    licensePath: string;
    photoPath: string;
    startDate: string | null;
    endDate: string | null;
    lastlogin: string | null;
    lastuse: string | null;
    comment: string;
    createDate: string | null;
    createBy: number | null;
    updateDate: string | null;
    updateBy: number | null;
    deleteDate: string | null;
    deleteBy: number | null;
    status: number | null;
    guid: string;
    landLordSex: string;
    landLordBirthday: string | null;
    landLordEmail: string;
    landLordMobile: string;
    landLordAddress: string;
    contractGuid: string;
    bankGuid: string;
    file: any;
}
export interface Member {
    id: number;
    siteGuid: string;
    uid: string;
    upwd: string;
    memberNo: string;
    memberName: string;
    startDate: string | null;
    endDate: string | null;
    lastlogin: string | null;
    lastuse: string | null;
    comment: string;
    createDate: string | null;
    createBy: number | null;
    updateDate: string | null;
    updateBy: number | null;
    deleteDate: string | null;
    deleteBy: number | null;
    status: number | null;
    guid: string;
    memberSex: string;
    memberBirthday: string | null;
    memberIdcard: string;
    memberEmail: string;
    memberMobile: string;
    memberAddress: string;
    memberLine: string;
    carGuid: string;
    paymentGuid: string;
    photoPath: string;
    file: any;
}
export interface Engineer {
    id: number;
    siteGuid: string;
    uid: string;
    upwd: string;
    engineerNo: string;
    engineerName: string;
    engineerIdcard: string;
    licensePath: string;
    photoPath: string;
    startDate: string | null;
    endDate: string | null;
    lastlogin: string | null;
    lastuse: string | null;
    comment: string;
    createDate: string | null;
    createBy: number | null;
    updateDate: string | null;
    updateBy: number | null;
    deleteDate: string | null;
    deleteBy: number | null;
    status: number | null;
    guid: string;
    engineerSex: string;
    engineerBirthday: string | null;
    engineerEmail: string;
    engineerMobile: string;
    engineerAddress: string;
    file: any;
}
export interface Bank {
    id: number;
    bankNo: string;
    bankName: string;
    createDate: string | null;
    createBy: number | null;
    updateDate: string | null;
    updateBy: number | null;
    status: number | null;
    guid: string;
}
export interface WebBanner {
    id: number;
    type: string;
    sortId: number | null;
    subject: string;
    photoPath: string;
    link: string;
    comment: string;
    cancelFlag: string;
    createDate: string | null;
    createBy: number | null;
    updateDate: string | null;
    updateBy: number | null;
    status: number | null;
    startDate: string | null;
    endDate: string | null;
    guid: string;
    typeName: string;
    file: any;
}
export interface Contract {
    id: number;
    subject: string;
    content: string;
    createDate: string | null;
    createBy: number | null;
    updateDate: string | null;
    updateBy: number | null;
    status: number | null;
    guid: string;
}
export interface WebNews {
    id: number;
    type: string;
    sortId: number | null;
    newsDate: string | null;
    subject: string;
    body: string;
    photoPath: string;
    link: string;
    comment: string;
    cancelFlag: string;
    createDate: string | null;
    createBy: number | null;
    updateDate: string | null;
    updateBy: number | null;
    status: number | null;
    startDate: string | null;
    endDate: string | null;
    guid: string;
    typeName: string;
    file: any;
}
export interface User2Bank {
    id: number;
    userGuid: string;
    bankGuid: string;
    bankAccount: string;
    status: any | null;
    comment: string;
    createDate: string | null;
    guid: string;
    photoPath: string;
    file: any;

}

export interface User2Message {
    id: number;
    userGuid: string;
    type: string;
    icon: string;
    subject: string;
    content: string;
    link: string;
    createDate: string | null;
    createBy: number | null;
    readDate: string | null;
    status: number | null;
    guid: string;
}