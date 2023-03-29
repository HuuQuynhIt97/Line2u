export interface BOMVectorControl {
  id: number;
  bomGuid: string;
  vectorControlType: string;
  vectorControlName: string;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  vectorControlGuid: string;
  useType: string;
  useUnit: string;
  capacity: string;
  frequency: string;
  applyDays: string;
  useTypeName: string;
  useUnitName: string;
  capacityName: string;
  frequencyName: string;
  applyDaysName: string;
  vectorControlGuidName: string;
  vectorControlTypeName: string;
}
