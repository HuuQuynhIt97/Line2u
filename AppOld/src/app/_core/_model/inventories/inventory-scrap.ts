export interface InventoryScrap {
  id: number;
  farmGuid: string;
  scrapGuid: string;
  scrapDate: string | null;
  scrapTime: string;
  fromInventoryGuid: string;
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
