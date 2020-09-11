import React, { useCallback, useEffect, useState } from 'react';
import { Contract } from 'web3-eth-contract';
import { yam as yamAddress } from '../../constants/tokenAddresses';
import { getPoolContracts } from '../../yamUtils';
import useYam from '../../hooks/useYam';
import Context from './context';
import { Bank } from './types';

const NAME_FOR_POOL: { [key: string]: string } = {
  ycrv_pool: 'yCRV to CASH',
  bac_ycrv_pool: 'yCRV_CASH_LP to SHARES',
  bas_ycrv_pool: 'yCRV_SHARES_LP to SHARES',
};

const ICON_FOR_POOL: { [key: string]: string } = {
  ycrv_pool: '🐋',
  bac_ycrv_pool: '🌎',
  bas_ycrv_pool: '🌷',
};

const SORT_FOR_POOL: { [key: string]: number } = {
  ycrv_pool: 0,
  bac_ycrv_pool: 1,
  bas_ycrv_pool: 2,
};

const Banks: React.FC = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const yam = useYam();

  const fetchPools = useCallback(async () => {
    const pools: { [key: string]: Contract } = await getPoolContracts(yam);

    const banksArr: Bank[] = [];
    const poolKeys = Object.keys(pools);

    for (let i = 0; i < poolKeys.length; i++) {
      const poolKey = poolKeys[i];
      const pool = pools[poolKey];
      let tokenKey = poolKey.replace('_pool', '');
      if (tokenKey === 'eth') {
        tokenKey = 'weth';
      } else if (tokenKey === 'ampl') {
        tokenKey = 'ampl_eth_uni_lp';
      } else if (tokenKey === 'ycrv') {
        tokenKey = 'ycrv_yam_uni_lp';
      }

      const method = pool.methods[tokenKey];
      try {
        let tokenAddress = '';
        if (method) {
          tokenAddress = await method().call();
        } else if (tokenKey === 'ycrv_yam_uni_lp') {
          tokenAddress = '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8';
        }
        banksArr.push({
          contract: pool,
          name: NAME_FOR_POOL[poolKey],
          depositToken: tokenKey,
          depositTokenAddress: tokenAddress,
          earnToken: 'yam',
          earnTokenAddress: yamAddress,
          icon: ICON_FOR_POOL[poolKey],
          id: tokenKey,
          sort: SORT_FOR_POOL[poolKey],
        });
      } catch (e) {
        console.log(e);
      }
    }
    banksArr.sort((a, b) => (a.sort < b.sort ? 1 : -1));
    setBanks(banksArr);
  }, [yam, setBanks]);

  useEffect(() => {
    if (yam) {
      fetchPools();
    }
  }, [yam, fetchPools]);

  return <Context.Provider value={{ banks }}>{children}</Context.Provider>;
};

export default Banks;
