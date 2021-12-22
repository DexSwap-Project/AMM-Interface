import React, {  useRef } from 'react'
import styled from 'styled-components/macro'
import { ApplicationModal } from '../../state/application/actions'
import { useCloseModals, useModalOpen, useToggleMobileMenu } from '../../state/application/hooks'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import Popover from '../Popover'
import { Triangle } from 'react-feather'
import { ExternalLink } from '../../theme'

const StyledPopover = styled(Popover)`
  padding: 22px;
  border: none;
  background: ${({ theme }) => theme.bg1};
  border-radius: 12px;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ListItem = styled.li`
  & + & {
    margin-top: 28px;
  }
`;

const StyledExternalLink = styled(ExternalLink)`
display: block;
font-weight: bold;
font-size: 13px;
line-height: 16px;
letter-spacing: 0.08em;
text-transform: uppercase;
color: ${({ theme }) => theme.text2};
cursor: pointer;
outline: none;

&.active {
  font-weight: 700;
  color: ${({ theme }) => theme.white};
}
`

const StyledNavLink = styled(NavLink)`
  display: block;
  font-weight: bold;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text2};
  cursor: pointer;
  outline: none;

  &.active {
    font-weight: 700;
    color: ${({ theme }) => theme.white};
  }
`


const MenuButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  border: none;
  background: none;
  font-weight: bold;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text2};
  cursor: pointer;
  outline: none;

  svg {
    width: 5px;
    height: 8px;
    transform: rotate(180deg);
    margin-left: 6px;
    stroke: ${({ theme }) => theme.text3};

    path {
      fill: ${({ theme }) => theme.text3};
    }
  }
`;


export default function MobileOptions({ history }: { history: any }) {
  const popoverRef = useRef(null)
  const open = useModalOpen(ApplicationModal.MOBILE)
  const toggle = useToggleMobileMenu()
  const closeModals = useCloseModals()
  const { t } = useTranslation()
  useOnClickOutside(popoverRef, open ? toggle : undefined)


  const location = useLocation();
  const getActiveLInk = () => {
    switch (location.pathname) {
      case '/exchange':
        return t('EXCHANGE');
      case '/pools':
      case '/add':
      case '/remove':
      case '/create':
        return t('POOLS MENU');
      default:
        return '';
    }
  }
  
  return (
    <div ref={popoverRef}>
      <StyledPopover
        show={open}
        placement="bottom-end"
        content={
          <>
        <List>
          <ListItem>
              <StyledNavLink
            id="swap-nav-link"
            to="/exchange"
            activeClassName="active">
            {t('EXCHANGE')}
            </StyledNavLink>
          </ListItem>
              <ListItem>
                <StyledNavLink
                  id="pool-nav-link"
                  to="/pools"
                  onClick={closeModals}
                  activeClassName="active"
                >
                  {t('POOLS MENU')}
                </StyledNavLink>
              </ListItem>
              <ListItem>
              <StyledNavLink
                  id="bridge-nav-link"
                  to="/bridge"
                  onClick={closeModals}
                  activeClassName="active"
                >
                  {t('bridge')}
                </StyledNavLink>
              </ListItem>
              <ListItem>
          <StyledExternalLink id="istock-nav-link" href={`https://istock-dev.netlify.app`}>
            {t('ISTOCK')}
          </StyledExternalLink>
          </ListItem>
              <ListItem>
              <StyledNavLink
                  id="governance-nav-link"
                  to="/governance"
                  onClick={closeModals}
                  activeClassName="active"
                >
                  {t('governance')}
                </StyledNavLink>
              </ListItem>
            </List>
          </>
        }
      >
        <MenuButton onClick={toggle}>
          {getActiveLInk()}
          <Triangle />
        </MenuButton>
      </StyledPopover>
    </div>
  )
}
