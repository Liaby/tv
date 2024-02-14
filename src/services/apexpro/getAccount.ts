import ApexproConnector from './client';
import 'dotenv/config';

interface SymbolToOraclePrice {
  [key: string]: {
    oraclePrice: string;
    createdTime: number;
  };
}

interface Balance {
  totalEquityValue: string;
  availableBalance: string;
  initialMargin: string;
  maintenanceMargin: string;
  symbolToOraclePrice: SymbolToOraclePrice;
}

interface AccountBalance {
  usdtBalance: Balance;
  usdcBalance: Balance;
}

export const apexproGetAccount = async (): Promise<AccountBalance | boolean> => {
  try {
    const connector = await ApexproConnector.build();
    if (!connector) return false;

    const balance = await connector.client.privateApi.accountBalance();

    if (balance != null) {
      const usdtBalance: Balance = {
        totalEquityValue: balance.totalEquityValue,
        availableBalance: balance.availableBalance,
        initialMargin: balance.initialMargin,
        maintenanceMargin: balance.maintenanceMargin,
        symbolToOraclePrice: {
          'BTC-USDC': {
            oraclePrice: '',
            createdTime: 0,
          },
        },
      };

      const usdcBalance: Balance = {
        totalEquityValue: balance.totalEquityValue,
        availableBalance: balance.availableBalance,
        initialMargin: balance.initialMargin,
        maintenanceMargin: balance.maintenanceMargin,
        symbolToOraclePrice: {
          'BTC-USDC': {
            oraclePrice: '',
            createdTime: 0,
          },
        },
      };

      const accountBalance: AccountBalance = {
        usdtBalance,
        usdcBalance,
      };

      if (Number(balance.availableBalance) === 0) {
        return false;
      } else {
        return accountBalance;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};
