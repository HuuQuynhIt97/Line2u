export interface BOMDisinfection {
  id: number;
  bomGuid: string;
  disinfectionType: string;
  disinfectionName: string;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  disinfectionGuid: string;
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
  disinfectionGuidName: string;
  disinfectionTypeName: string;
}
