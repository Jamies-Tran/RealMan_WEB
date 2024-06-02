export namespace BranchNameApi {
  export interface Response {
    values: {
      branchId: number;
      branchName: string;
      address: string;
      numberStaffs: number;
    }[];
  }
}
