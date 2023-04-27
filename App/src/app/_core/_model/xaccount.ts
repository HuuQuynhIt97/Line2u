export interface XAccount {
  accountId: number;
  clinicId: number | null;
  uid: string;
  upwd: string;
  accountNo: string;
  accountName: string;
  accountSex: string;
  accountBirthday: string | null;
  accountNickname: string;
  accountTel: string;
  accountMobile: string;
  accountAddress: string;
  accountIdcard: string;
  accountEmail: string;
  startDate: string | null;
  endDate: string | null;
  lastlogin: string | null;
  lastuse: string | null;
  comment: string;
  status: string;
  token: string;
  cancelFlag: string;
  createBy: number | null;
  createDate: string | null;
  updateBy: number | null;
  updateDate: string | null;
  pAdmin: string;
  pAccount: string;
  pPatient: string;
  pRequisitionConfirm: string;
  pPhotoComment: string;
  lastLoginDate: string | null;
  pClinic: string;
  pCodeType: string;
  pEnquiry: string;
  pEnquiryResult: string;
  guid: string;
  roleId: number | null;
  typeId: number | null;
  farmGuid: string;
  accountRole: string;
  accountType: string;
  accountGroup: string;
  accountOrganization: number | null;
  accountSite: number | null;
  errorLogin: number | null;
  photoPath: string;
  employeeGuid: string;
  isLineAccount: string;
  lineId: string;
  lineName: string;
  lineOfficialId: string;
  lineBotId: string;
  lineChannelAccessToken: string;
  lineQrPath: string;
  siteId: string;
  siteName: string;
  siteTel: string;
  accountDomicileAddress: string;
  file: any;
  fileQR: any;
}
export interface Profile {
  nickName: string;
  accountGuid: string;
  accountId:number;
  tel: string;
  mobile: string;
  address: string;
  addressDomicile: string;
  email: string;
  comment: string;
  contactName: string;
  contactTel: string;
  photoPath: string;
  pageSizeSetting: string;
  pageSizeSettingValue: string;
  pageSizeSettingList: string;
}

export interface StoreProfile {
  id: number;
  createBy: number;
  ratingCount: number;
  ratingAVG: number;
  updateBy: number;
  status: number;
  active: number;
  storeName: string | null;
  createName: string | null
  storeTel: string | null;
  storeEmail: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  pinterest: string | null;
  youtube: string | null;
  storeAddress: string;
  storeOpenTime: string;
  storeCloseTime: string;
  storeLowPrice: string;
  storeHightPrice: string | null;
  body: string;
  photoPath: string;
  comment: string;
  guid: string;
  accountGuid: string;
  countyId: string;
  townShipId: string;
  file: any;
  bannerList: any;
  multiStores: any;
}

export interface StoreTable {
  id: number;
  storeId: number;
  tableNumber: string;
  guid: string;

}
