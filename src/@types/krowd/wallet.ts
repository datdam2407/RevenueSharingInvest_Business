export type WalletType = {
  id: string;
  name: string;
  description: string;
  mode: string;
  type: string;
};

export type Wallet = {
  totalAsset: number;
  listOfInvestorWallet: null;
  listOfProjectWallet: ListOfProjectWallet;
};

export type ListOfProjectWallet = {
  p1: ProjectWallet;
  p2: ProjectWallet;
  p3List: ProjectWallet[];
  p4List: ProjectWallet[];
  p5: ProjectWallet;
};

export type ProjectWallet = {
  walletType: WalletType;
  id: string;
  projectManagerId: string;
  projectId: null | string;
  balance: number;
  projectImage: string | null;
  projectName: string;
  projectStatus: string;
  createDate: string;
  createBy: string;
  updateDate: string;
  updateBy: string;
};
