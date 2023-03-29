export interface InventoryChange {
  id: number;
  farmGuid: string;
  changeGuid: string;
  thingGuid: string;
  materialGuid: string;
  changeDate: string | null;
  changeTime: string;
  fromInventoryGuid: string;
  toInventoryGuid: string;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  type: string;
  inventoryType: string;
  inventoryGuid: string;
  inventoryAmount: number | null;
  originalAmount: number | null;
}
