import 'whatwg-fetch';
import { configure } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
configure({ adapter: new EnzymeAdapter() });

// Mock the proto modules when running tests
jest.mock('./proto/cmo_pb_service', () => ({
  CMOClient: class CMOClient {}
}));
jest.mock('./proto/cmo_pb', () => ({
  AllActionsRequest: {}
}));
