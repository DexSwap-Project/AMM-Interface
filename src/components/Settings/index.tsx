import React, { useState } from 'react'
import { Settings, X } from 'react-feather'
import { Text } from 'rebass'
import styled from 'styled-components/macro'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import {
  useExpertModeManager,
  useUserTransactionTTL,
  useUserSlippageTolerance,
  useUserPreferredGasPrice,
  useMultihopManager
} from '../../state/user/hooks'
import { TYPE,  LinkStyledButton, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import QuestionHelper from '../QuestionHelper'
import Row, { RowBetween, RowFixed } from '../Row'
import Toggle from '../Toggle'
import TransactionSettings from '../TransactionSettings'
// TODO:
// import DexswapVersionLogo from '../DexswapVersionLogo'

import { DarkCard } from '../Card'

const StyledMenuIcon = styled(Settings)`
  height: 15px;
  width: 15px;
  cursor: pointer;

  > * {
    stroke: ${({ theme }) => theme.text4};
  }
`

const StyledCloseIcon = styled(X)`
  position: absolute;
  right: 18px;
  height: 20px;
  width: 20px;

  :hover {
    cursor: pointer;
  }

  > * {
    stroke: ${({ theme }) => theme.bg5};
  }
`
const EmojiWrapper = styled.div`
  position: absolute;
  cursor: pointer;
  bottom: -6px;
  right: 3px;
  font-size: 12px;
`

const StyledMenu = styled.button`
  height: 32px;
  width: 32px;
  padding: 6px 8px;
  border-radius: 12px;
  margin-left: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
  background: ${({ theme }) => theme.bg1};
  cursor: pointer;
`

const MenuModal = styled(Modal)`
  position: absolute;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    position: fixed;
    top: initial;
    right: initial;
    justify-content: center;
    align-items: center;
  `};
`

const ModalContentWrapper = styled(DarkCard)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 26px 0;
  ::before {
    background-color: ${props => props.theme.bg1And2};
  }
`

const MenuModalContentWrapper = styled(ModalContentWrapper)`
  padding: 12px;
`

// const MenuItem = styled(ExternalLink)`
//   width: 50%;
//   color: ${({ theme }) => theme.text2};
//   display: flex;
//   align-items: center;
//   :hover {
//     color: ${({ theme }) => theme.text1};
//     cursor: pointer;
//     text-decoration: none;
//   }
//   > svg {
//     margin-right: 8px;
//   }
// `

const CloseTextButton = styled(LinkStyledButton)`
  color: ${({ theme }) => theme.text4};
  font-size: 13px;
  text-decoration: underline;
`

const Divider = styled.div<{ horizontal?: boolean }>`
  border: 0.5px solid ${props => props.theme.bg2};
  margin: ${props => (props.horizontal ? '0 10px' : '10px 0')};
  height: ${props => (props.horizontal ? '100%' : 'auto')};
`

// const CODE_LINK = 'https://github.com/Agin-DropDisco/dexswap-dapp'

export default function SettingsTab() {
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()
  const [userPreferredGasPrice, setUserPreferredGasPrice] = useUserPreferredGasPrice()
  const [ttl, setTtl] = useUserTransactionTTL()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [multihop, toggleMultihop] = useMultihopManager()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <>
      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxHeight={100}>
        <ModalContentWrapper>
          <AutoColumn gap="25px">
            <Row style={{ padding: '0 25px', justifyContent: 'center' }}>
              <TYPE.body fontWeight={500} fontSize="20px" color="text3">
                Are you sure?
              </TYPE.body>
              <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
            </Row>
            <AutoColumn gap="24px" style={{ padding: '0 24px' }}>
              <TYPE.body fontWeight={400} fontSize="16px" lineHeight="20px" color="text1" textAlign="center">
                Expert mode turns off the confirm transaction prompt and allows high slippage trades that often result
                in bad rates and lost funds.
              </TYPE.body>
              <TYPE.body fontWeight={600} fontSize="13px" color="text1" textAlign="center">
                ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.
              </TYPE.body>
              <ButtonError
                error={true}
                padding={'18px'}
                onClick={() => {
                  toggleExpertMode()
                  setShowConfirmation(false)
                }}
              >
                <TYPE.body fontSize="13px" fontWeight={600} color="text1" id="confirm-expert-mode">
                  Turn on Expert mode
                </TYPE.body>
              </ButtonError>
              <Row style={{ justifyContent: 'center' }}>
                <CloseTextButton onClick={() => setShowConfirmation(false)}>Cancel</CloseTextButton>
              </Row>
            </AutoColumn>
          </AutoColumn>
        </ModalContentWrapper>
      </Modal>
      <StyledMenu onClick={toggle} id="open-settings-dialog-button">
        <StyledMenuIcon/>
        {expertMode && (
          <EmojiWrapper onClick={toggle}>
            <span role="img" aria-label="wizard-icon">
              😎
            </span>
          </EmojiWrapper>
        )}
        <MenuModal maxWidth={322} isOpen={open} onDismiss={toggle}>
          <MenuModalContentWrapper>
            <AutoColumn gap="md" style={{ padding: '8px' }}>
              <RowBetween>
                <Text fontWeight="400" fontSize="14px" lineHeight="17px">
                  Transaction settings
                </Text>
                <CloseIcon onClick={toggle} />
              </RowBetween>
              <TransactionSettings
                rawSlippage={userSlippageTolerance}
                setRawSlippage={setUserslippageTolerance}
                rawPreferredGasPrice={userPreferredGasPrice}
                setRawPreferredGasPrice={setUserPreferredGasPrice}
                deadline={ttl}
                setDeadline={setTtl}
                multihop={multihop}
                onMultihopChange={toggleMultihop}
              />
              <Text fontWeight="400" fontSize="14px" lineHeight="17px">
                Interface settings
              </Text>
              <RowBetween>
                <RowFixed>
                  <TYPE.body color="text4" fontWeight={500} fontSize="12px" lineHeight="15px">
                    Toggle expert mode
                  </TYPE.body>
                  <QuestionHelper text="Bypasses confirmation modals and allows high slippage trades. Use at your own risk." />
                </RowFixed>
                <Toggle
                  id="toggle-expert-mode-button"
                  isActive={expertMode}
                  toggle={
                    expertMode
                      ? () => {
                          toggleExpertMode()
                          setShowConfirmation(false)
                        }
                      : () => {
                          toggle()
                          setShowConfirmation(true)
                        }
                  }
                />
              </RowBetween>
              <Divider />
            </AutoColumn>
          </MenuModalContentWrapper>
        </MenuModal>
      </StyledMenu>
    </>
  )
}
