import * as React from 'react';

import { Button, TextField, withStyles } from '@material-ui/core';

import {
  isStellarUri,
  parseStellarUri,
  PayStellarUri,
  StellarUri,
  TransactionStellarUri
} from '../src';
import PayUriSummary from './PayUriSummary';
import TranactionUriSummary from './TransactionUriSummary';

const styles = {};

const sampleTxUri = `web+stellar:tx?xdr=AAAAADPMT6JWh08TPGnc5nd6eUtw0CfJA4kQjkHZzGEQqGWHAAAAZAAGXSAAAAABAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAAM8xPolaHTxM8adzmd3p5S3DQJ8kDiRCOQdnMYRCoZYcAAAAAAAAAAACYloAAAAAAAAAAAA%3D%3D&msg=order+number+123&callback=url%3Ahttps%3A%2F%2Fexample.com%2Fstellar&origin_domain=test.stellarguard.me&signature=U0YaaJwNDNdokMcMB31weRuNR5OqPhs0oZ2eZ286MGIARf44WxAjA8VnawSaWyy1EUazaiFQYW5%2F%2B8JXKtQtCg%3D%3D&replace=sourceAccount%3ASRC%2CseqNum%3ASEQ%3BSRC%3Athe+source+account%2CSEQ%3Athe+sequence+number+for+the+source+account`;
const samplePayUri = `web+stellar:pay?destination=GCALNQQBXAPZ2WIRSDDBMSTAKCUH5SG6U76YBFLQLIXJTF7FE5AX7AOO&amount=120.1234567&memo=skdjfasf&msg=pay%20me%20with%20lumens`;

class ParseUriPage extends React.Component<any, any> {
  public state = { uri: '' };
  public render() {
    const { classes } = this.props;
    const { uri } = this.state;

    let parsedUri: StellarUri;
    if (isStellarUri(uri)) {
      parsedUri = parseStellarUri(uri);
    }

    return (
      <div>
        <Button
          style={{ marginRight: '3px' }}
          color="primary"
          size="small"
          variant="contained"
          onClick={() => this.setState({ uri: sampleTxUri })}
        >
          Sample Tx URI
        </Button>
        <Button
          color="primary"
          size="small"
          variant="contained"
          onClick={() => this.setState({ uri: samplePayUri })}
        >
          Sample Pay URI
        </Button>
        <form className={classes.form} noValidate autoComplete="off" name="uri">
          <TextField
            name="uri"
            label="Enter a SEP7 Stellar URI"
            fullWidth
            margin="normal"
            onChange={this.onChange}
            multiline
            value={uri || ''}
          />
        </form>
        {parsedUri && parsedUri.operation === 'tx' && (
          <TranactionUriSummary
            stellarUri={parsedUri as TransactionStellarUri}
            onUpdateStellarUri={this.onUpdateStellarUri}
          />
        )}
        {parsedUri && parsedUri.operation === 'pay' && (
          <PayUriSummary stellarUri={parsedUri as PayStellarUri} />
        )}
      </div>
    );
  }

  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uri = event.target.value || '';
    this.setState({ uri });
  };

  private onUpdateStellarUri = (uri: string) => {
    this.setState({ uri });
  };
}

export default withStyles(styles)(ParseUriPage);
