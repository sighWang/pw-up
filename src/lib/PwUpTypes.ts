import { Address, BI, Cell, config, Hash, Script } from "@ckb-lumos/lumos";

export interface Sudt {
  readonly type: Script;
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
}

export interface SudtGroup {
  readonly sudt: Sudt;
  readonly cells: Cell[];

  // amount without decimals
  readonly amount: BI;
}

export type NetworkType = "AGGRON4" | "LINA";

export interface PwUpConfig {
  readonly network: NetworkType;

  readonly ckbRpcUrl: string;
  readonly indexerRpcUrl: string;
  readonly pwLockScriptConfig: config.ScriptConfig;
  readonly omniLockScriptConfig: config.ScriptConfig;
  readonly supportedSudts: Sudt[];
}

interface EthereumRpc {
  (payload: { method: "personal_sign"; params: [string /*from*/, string /*message*/] }): Promise<Hash>;
}

export interface EthereumProvider {
  selectedAddress: string;
  isMetaMask?: boolean;
  enable: () => Promise<string[]>;
  addListener: (event: "accountsChanged", listener: (addresses: string[]) => void) => void;
  removeEventListener: (event: "accountsChanged", listener: (addresses: string[]) => void) => void;
  request: EthereumRpc;
}

export interface PwUpTypes {
  readonly config: PwUpConfig;
  readonly isConnected: boolean;

  connectToWallet: () => Promise<void>;

  getEthAddress: () => Address;
  getPwAddress: () => Address;
  getOmniAddress: () => Address;

  /**
   * check if an input address is a valid ckb address
   * @param address
   */
  checkAddress: (address: Address) => boolean;

  getSudtWhiteList: () => Sudt[];

  /**
   * defaults to connected pw-lock
   * the sudt list can be found in {@link PwUpConfig.supportedSudts}
   * @param address
   */
  listSudtCells: (address?: Address) => Promise<SudtGroup[]>;

  // send a transaction to transfer from PW-lock to Omni-lock
  transferPwToOmni: (cells: SudtGroup[], recipientLock: Address) => Promise<Hash>;
}
