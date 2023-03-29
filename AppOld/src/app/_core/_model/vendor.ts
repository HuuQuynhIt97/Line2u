export interface Vendor {
  id: number;
  farmGuid: string;
  vendorNo: string;
  vendorName: string;
  vendorSex: string;
  vendorBirthday: string | null;
  vendorNickname: string;
  vendorTel: string;
  vendorMobile: string;
  vendorAddress: string;
  vendorIdcard: string;
  vendorEmail: string;
  contactName: string;
  contactTel: string;
  contactMobile: string;
  contactEmail: string;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
}
