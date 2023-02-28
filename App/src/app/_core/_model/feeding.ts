export interface Feeding {
  id: number;
  status: boolean | null;
  createBy: number;
  updateBy: number | null;
  deleteBy: number | null;
  createDate: string;
  updateDate: string | null;
  deleteDate: string | null;
}
