import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';

import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import { Switch } from 'react-router-dom';
import Page from '../../components/Page';
import useRedeemOnBoardroom from '../../hooks/useRedeemOnBoardroom';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';

import config from '../../config';
import LaunchCountdown from '../../components/LaunchCountdown';
import Stat from './components/Stat';
import ProgressCountdown from './components/ProgressCountdown';
import useCashStatsFromTreasury from '../../hooks/useCashStatsFromTreasury';
import useTreasuryAmount from '../../hooks/useTreasuryAmount';
import Humanize from 'humanize-plus';
import { getBalance } from '../../utils/formatBalance';
import useLastTreasuryAllocationTime from '../../hooks/useLastTreasuryAllocationTime';
import Notice from '../../components/Notice';

const Boardroom: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));
  const { account } = useWallet();
  const { onRedeem } = useRedeemOnBoardroom();
  const stakedBalance = useStakedBalanceOnBoardroom();

  const cashStat = useCashStatsFromTreasury();
  const treasuryAmount = useTreasuryAmount();
  const scalingFactor = useMemo(
    () => (cashStat ? Number(cashStat.priceInDAI).toFixed(2) : null),
    [cashStat],
  );
  const lastAllocation = useLastTreasuryAllocationTime();
  const nextAllocation = new Date(
    lastAllocation.getTime() + config.treasuryAllocationDelayInSec * 1000,
  );

  const isLaunched = Date.now() >= config.boardroomLaunchesAt.getTime();
  if (!isLaunched) {
    return (
      <Switch>
        <Page>
          <PageHeader
            icon={'🤝'}
            title="Join the Boardroom"
            subtitle="Deposit Basis Shares and earn inflationary rewards"
          />
          <LaunchCountdown
            deadline={config.boardroomLaunchesAt}
            description="How does the boardroom work?"
            descriptionLink="https://docs.basis.cash/mechanisms/stabilization-mechanism#expansionary-policy"
          />
        </Page>
      </Switch>
    );
  }

  return (
    <Switch>
      <Page>
        {!!account ? (
          <>
            <PageHeader
              icon={'🤝'}
              title="Join the Boardroom"
              subtitle="Deposit Basis Shares and earn inflationary rewards"
            />
            <StyledNoticeWrapper>
              <Notice color="yellow">
                Boardroom Seigniorage starts at <b>Dec 11 (Fri) 12:00am UTC</b>.
                For those who have already deposited Basis Shares into the Boardroom,&nbsp;
                <b>we recommend that you withdraw your tokens and deposit them into the new boardroom contract</b>.
              </Notice>
            </StyledNoticeWrapper>
            <StyledHeader>
              <ProgressCountdown
                base={lastAllocation}
                deadline={nextAllocation}
                description="Next Seigniorage"
              />
              <Stat
                icon="💵"
                title={cashStat ? `$${cashStat.priceInDAI}` : '-'}
                description="BAC Price (TWAP)"
              />
              <Stat
                icon="🚀"
                title={scalingFactor ? `x${scalingFactor}` : '-'}
                description="Scaling Factor"
              />
              <Stat
                icon="💰"
                title={
                  treasuryAmount
                    ? `~$${Humanize.compactInteger(getBalance(treasuryAmount), 2)}`
                    : '-'
                }
                description="Treasury Amount"
              />
            </StyledHeader>
            <StyledBoardroom>
              <StyledCardsWrapper>
                <StyledCardWrapper>
                  <Harvest />
                </StyledCardWrapper>
                <Spacer />
                <StyledCardWrapper>
                  <Stake />
                </StyledCardWrapper>
              </StyledCardsWrapper>
              <Spacer size="lg" />
              <div>
                <Button
                  disabled={stakedBalance.eq(0)}
                  onClick={onRedeem}
                  text="Settle & Withdraw"
                />
              </div>
              <Spacer size="lg" />
            </StyledBoardroom>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

const UnlockWallet = () => {
  const { connect } = useWallet();
  return (
    <Center>
      <Button onClick={() => connect('injected')} text="Unlock Wallet" />
    </Center>
  );
};

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledHeader = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
  width: 960px;

  > * {
    flex: 1;
    height: 84px;
    margin: 0 ${(props) => props.theme.spacing[2]}px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const StyledNoticeWrapper = styled.div`
  width: 960px;
  margin-top: -20px;
  margin-bottom: 40px;
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Boardroom;
