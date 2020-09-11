import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import useYam from '../../hooks/useYam';
import HomeCard from './components/HomeCard';
import { OverviewData } from './types';
import { getStats } from './utils';
import useBasisCash from '../../hooks/useBasisCash';

const Home: React.FC = () => {
  const basisCash = useBasisCash();
  const [{
    circSupply,
    curPrice,
    nextRebase,
    targetPrice,
    totalSupply,
  }, setStats] = useState<OverviewData>({});

  const fetchStats = useCallback(async () => {
    // const statsData = await getStats(yam);
    // setStats(statsData);
    console.log('I am fetching men');
  }, [basisCash, setStats]);

  useEffect(() => {
    if (basisCash) {
      fetchStats()
        .catch(err => console.error(err.stack));
    }
  }, [basisCash]);

  return (
    <Page>
      <PageHeader
        icon="👋"
        subtitle="Buy, sell, and provide liquidity for Basis Cash and Basis Shares on Uniswap"
        title="Welcome to Basis Cash!"
      />
      <div style={{
        margin: '-24px auto 48px',
      }}>
        <StyledLink
          href="https://medium.com/@yamfinance/how-to-exit-the-eternal-lands-pool-and-withdraw-your-yam-823d57c95f3a">How
          to withdraw from Uniswap</StyledLink>
      </div>
      <Spacer />
      <CardWrapper>
        <HomeCard
          title={'Basis Cash'}
        />
        <HomeCard
          title={'Basis Bonds'}
        />
        <HomeCard
          title={'Basis Share'}
        />
      </CardWrapper>
    </Page>
  );
};

const StyledOverview = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;

  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;
const StyledSpacer = styled.div`
  height: ${props => props.theme.spacing[4]}px;
  width: ${props => props.theme.spacing[4]}px;
`;

const StyledLink = styled.a`
  font-weight: 700l
  text-decoration: none;
  color: ${props => props.theme.color.primary.main};
`;

export default Home;