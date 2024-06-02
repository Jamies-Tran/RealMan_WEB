export namespace BranchAddressApi {
  export interface Response {
    value: {
      branchId: number;
      branchName: string;
      address: string;
      numberStaffs: number;
    };
  }
}
