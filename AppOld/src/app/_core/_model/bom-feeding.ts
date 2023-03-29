export interface BomFeeding {
  id: number;
  bomGuid: string;
  feedType: string;
  feedName: string;
  feedGuid: string;
  useType: string;
  useUnit: string;
  frequency: string;
  estAmount: string;
  recordAmount: string;
  recordResult: string;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  applyDays: any;
  applyEveryMonth: number;
  applyEveryDay: number;
}