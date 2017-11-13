import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

chai.use(sinonChai);
chai.use(chaiEnzyme());
chai.use(chaiAsPromised);
sinonStubPromise(sinon);

// load all tests into one bundle
const unitTestsContext = require.context('.', true, /\.test\.js$/);
unitTestsContext.keys().forEach(unitTestsContext);
const testsContext = require.context('../integration-tests', true, /\.test\.js$/);
testsContext.keys().forEach(testsContext);
