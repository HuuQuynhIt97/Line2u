export interface Nutrition {
  id: number;
  nutritionType: string;
  nutritionNo: string;
  nutritionName: string;
  nutritionElement: string;
  nutritionEffect: string;
  nutritionSideEffect: string;
  nutritionBreed: string;
  nutritionRange: string;
  nutritionCare: string;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  farmGuid: string;
  nutritionTypeName: string;

}

