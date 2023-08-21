import { expect } from 'chai';
import * as process from 'process';
import { BinariesVersionClient } from '../../clients/BinariesVersionClient';
import { CommandRunner } from '../../clients/CommandRunner';
import { BridgeClientProvider } from '../../clients/Providers/BridgeClientProvider';
import { IClientProvider } from '../../clients/Providers/IClientProvider';
import { describe, it } from 'mocha';
describe('BridgeClientProviderTest', () => {
    it('should return binaries name as dsc always', async () => {
        const expectedCLIVersion = '1.0.20220816.2';
        const binariesVersionClient: BinariesVersionClient = new BinariesVersionClient(expectedCLIVersion, null);
        const bridgeClientProvider: IClientProvider = new BridgeClientProvider(binariesVersionClient, expectedCLIVersion, new CommandRunner(null), null);
        const binariesName = bridgeClientProvider.getExecutableFilePath();
        const expectedName = process.platform == 'win32' ? 'dsc.exe' : 'dsc';
        expect(binariesName).to.equal(expectedName);
    });
});