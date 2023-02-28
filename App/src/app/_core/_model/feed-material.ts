export interface FeedMaterial {
  id: number;
  feedMaterialType: string;
  feedMaterialNo: string;
  feedMaterialName: string;
  feedMaterialElement: string;
  feedMaterialEffect: string;
  feedMaterialSideEffect: string;
  feedMaterialBreed: string;
  feedMaterialRange: string;
  feedMaterialCare: string;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  farmGuid: string;
  feedMaterialTypeName: string;
  vendorGuid: string;
  location: string;
  spec: string;
  amount: number | null;
  price: number | null;
  cost: number | null;
  qty: number | null;
  expireDate: any | null;
}

