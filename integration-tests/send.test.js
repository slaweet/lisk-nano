import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import Lisk from 'lisk-js';
import React from 'react';

import { mount } from 'enzyme';
import { step } from 'mocha-steps';
import sinon, { mock } from 'sinon';

import { accountUpdated } from '../src/actions/account';
import { activePeerSet, activePeerUpdate } from '../src/actions/peers';
import App from '../src/components/app';
import getNetwork from '../src/utils/getNetwork';
import i18n from '../app/src/i18n';
import store from '../src/store';

const renderWithRouter = Component =>
  <Provider store={store}>
    <Router>
      <I18nextProvider i18n={ i18n }>
        <Component />
      </I18nextProvider>
    </Router>
  </Provider>;

describe.only('Feature: send', () => {
  let wrapper;
  let peers;
  let sendMock;
  let clock;

  const realAccount = {
    address: '16313739661670634666L',
    balance: '346215336704',
    delegate: {},
    multisignatures: [],
    passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
    publicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
    u_multisignatures: [],
    unconfirmedBalance: '0',
  };

  beforeEach(() => {
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
  });

  afterEach(() => {
    clock.restore();
    sendMock.restore();
  });

  describe('Scenario: should not allow to send when not enough funds', () => {
    step('Given I\'m logged in as "empty account"', () => {
      const options = { ssl: true };
      peers = Lisk.api(options);
      peers.options = options;
      sendMock = mock(peers);

      store.dispatch(activePeerSet({
        network: getNetwork(0),
        passphrase: realAccount.passphrase,
      }));
      store.dispatch(activePeerUpdate({ online: true }));
      store.dispatch(accountUpdated(realAccount));

      wrapper = mount(renderWithRouter(App));
      console.log(wrapper.html());
    });

    step('When I click "send button"', () => {
      console.log(store.getState());
      wrapper.find('a.send-button').simulate('click');
      console.log(wrapper.find('a.send-button').html());
      clock.tick(1000);
      wrapper.update();
      console.log(store.getState());
    });

    step('And I fill in "1" to "amount" field', () => {
      wrapper.find('.amount').simulate('change', { target: { value: '1' } });
    });

    step('And I fill in "537318935439898807L" to "recipient" field', () => {
      wrapper.find('input.recipient').simulate('change', { target: { value: '537318935439898807L' } });
    });

    step('Then I should see "Insufficient funds" error message', () => {
      // wrapper.find('').simulate('');
    });
  });
});
