export interface BOMWeighing {
  id: number;
  bomGuid: string;
  weighingType: string;
  weighingName: string;
  useType: string;
  useUnit: string;
  frequency: string;
  applyDays: string;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  weighingTypeName: string;
  useTypeName: string;
  useUnitName: string;
  recordResultName: string;
  frequencyName: string;
  standardWeight: string;
  applyEveryMonth: number;
  applyEveryDay: number;
}
