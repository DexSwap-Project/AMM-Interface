import { Currency, CurrencyAmount, currencyEquals, Token } from 'dexswap-sdk'
import React, { CSSProperties, MutableRefObject, useCallback, useContext, useMemo } from 'react'
import { Box, Flex, Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useAddUserToken, useRemoveUserAddedToken } from '../../state/user/hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useIsUserAddedToken } from '../../hooks/Tokens'
import CurrencyLogo from '../CurrencyLogo'
import Loader from '../Loader'
import Badge from '../Badge'
import { TokenPickerItem } from './styleds'
import { Plus, X } from 'react-feather'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { TokenAddressMap, useCombinedActiveList } from '../../state/lists/hooks'
import { isTokenOnList } from '../../utils'
import { AutoColumn } from '../Column'
import { TYPE } from '../../theme'
import { WrappedTokenInfo } from '../../state/lists/wrapped-token-info'
import ImportRow from './ImportRow'
import { DarkCard } from '../Card'
import { RowBetween, RowFixed } from '../Row'
import TokenListLogo from '../../assets/svg/tokenlist.svg'
import QuestionHelper from '../QuestionHelper'

function currencyKey(index: number, data: any): string {
  const currency = data[index]
  if (currency instanceof Token) return currency.address
  return currency.symbol || ''
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const FixedContentRow = styled.div`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`

const TokenListLogoWrapper = styled.img`
  height: 20px;
`

function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(4)}</StyledBalanceText>
}

function CurrencyRow({
  currency,
  selectedTokenList,
  onSelect,
  isSelected,
  otherSelected,
  style
}: {
  currency: Currency
  selectedTokenList: TokenAddressMap
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
}) {
  const { account, chainId } = useActiveWeb3React()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)

  const removeToken = useRemoveUserAddedToken()
  const addToken = useAddUserToken()

  // only show add or remove buttons if not on selected list
  return (
    <TokenPickerItem
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
      alignItems="center"
      style={style}
    >
      <Box mr="12px">
        <CurrencyLogo currency={currency} size={'20px'} />
      </Box>
      <Box>
        <AutoColumn gap="2px">
          <Text fontWeight={500}>{currency.symbol}</Text>
          <TYPE.body fontSize="11px" color="text4" fontWeight={400}>
            {currency.name}
          </TYPE.body>
        </AutoColumn>
      </Box>
      <Flex flex="1" px="20px">
        {!isOnSelectedList && (
          <Box>
            <Badge
              label={customAdded ? 'Added by user' : 'Found by address'}
              icon={customAdded ? X : Plus}
              onClick={event => {
                event.stopPropagation()
                if (!chainId || !(currency instanceof Token)) {
                  return
                }
                if (customAdded) {
                  removeToken(chainId, currency.address)
                } else {
                  addToken(currency)
                }
              }}
            />
          </Box>
        )}
      </Flex>
      <Box style={{ justifySelf: 'flex-end' }}>
        {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
      </Box>
    </TokenPickerItem>
  )
}

const BREAK_LINE = 'BREAK'
type BreakLine = typeof BREAK_LINE
function isBreakLine(x: unknown): x is BreakLine {
  return x === BREAK_LINE
}

function BreakLineComponent({ style }: { style: CSSProperties }) {
  const theme = useContext(ThemeContext)
  return (
    <FixedContentRow style={style}>
      <DarkCard padding="8px 12px" borderRadius="8px">
        <RowBetween>
          <RowFixed>
            <TokenListLogoWrapper src={TokenListLogo} />
            <TYPE.main ml="6px" fontSize="12px" color={theme.text1}>
              Expanded results from inactive token lists
            </TYPE.main>
          </RowFixed>
          <QuestionHelper text="Tokens from inactive lists. Import specific tokens below or click 'Manage' to activate more lists." />
        </RowBetween>
      </DarkCard>
    </FixedContentRow>
  )
}

export default function CurrencyList({
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  otherListTokens,
  fixedListRef,
  showImportView,
  setImportToken
}: {
  currencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  otherListTokens: Token[]
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showImportView: () => void
  setImportToken: (token: Token) => void
}) {
  const selectedTokenList = useCombinedActiveList()
  const itemData = useMemo(() => {
    if (otherListTokens && otherListTokens?.length > 0) {
      const foundByAddressAndNotInAnyList =
        otherListTokens.length === 1 && !(otherListTokens[0] instanceof WrappedTokenInfo)
      if (foundByAddressAndNotInAnyList) return [...otherListTokens]
      return [BREAK_LINE, ...otherListTokens]
    }
    return currencies
  }, [currencies, otherListTokens])

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data[index]
      if (isBreakLine(currency)) return <BreakLineComponent style={style} />
      const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
      const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
      const showImport = index >= currencies.length
      const handleSelect = () => onCurrencySelect(currency)
      if (showImport && currency && currency instanceof Token) {
        return (
          <ImportRow
            style={style}
            token={currency}
            showImportView={showImportView}
            setImportToken={setImportToken}
            dim
          />
        )
      } else if (currency) {
        return (
          <CurrencyRow
            selectedTokenList={selectedTokenList}
            currency={currency}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
            style={style}
          />
        )
      }
      return null
    },
    [
      currencies.length,
      onCurrencySelect,
      otherCurrency,
      selectedCurrency,
      selectedTokenList,
      setImportToken,
      showImportView
    ]
  )

  return (
    <Flex overflowY="auto" flex="1">
      <AutoSizer style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
        {({ width, height }) => (
          <FixedSizeList
            ref={fixedListRef as any}
            width={width}
            height={height}
            itemData={itemData}
            itemCount={itemData.length}
            itemSize={56}
            itemKey={currencyKey}
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
    </Flex>
  )
}
