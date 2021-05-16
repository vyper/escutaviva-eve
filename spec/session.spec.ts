import * as fs from 'fs';
import * as path from 'path';
import * as WAWebJS from 'whatsapp-web.js';

import {Session} from '../src/session';

jest.mock('fs');
jest.mock('path');

describe('Session', () => {
  describe('#getConfiguration', () => {
    it('when persisted session exists', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (path.resolve as jest.Mock).mockReturnValue(
        '../spec/support/session.json'
      );

      const configuration = Session.getInstance().getConfiguration();

      expect(configuration).toEqual({WABrowserId: 'WABrowserId'});
    });

    it('when persisted session does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const configuration = Session.getInstance().getConfiguration();

      expect(configuration).toBeUndefined();
    });
  });

  describe('#persist', () => {
    it('writes session to file', () => {
      (path.resolve as jest.Mock).mockReturnValue(
        '../spec/support/session.json'
      );

      Session.getInstance().persist({} as WAWebJS.ClientSession);

      expect(fs.writeFile).toBeCalledWith(
        '../spec/support/session.json',
        '{}',
        expect.any(Function)
      );
    });
  });
});
