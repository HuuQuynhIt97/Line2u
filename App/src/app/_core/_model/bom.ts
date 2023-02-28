export interface Bom {
  id: number;
  bomNo: string;
  bomName: string;
  bomVersion: string;
  bomBreed: string;
  bomType: string;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  bomTypeName: string;
  applyEveryMonth: number;
  applyEveryDay: number;
}
