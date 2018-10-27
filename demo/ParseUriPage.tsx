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

const sampleTxUri = `web+stellar:tx?xdr=AAAAAP%2Byw%2BZEuNg533pUmwlYxfrq6%2FBoMJqiJ8vuQhf6rHWmAAAAZAB8NHAAAAABAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAA%2F7LD5kS42DnfelSbCVjF%2Burr8GgwmqIny%2B5CF%2FqsdaYAAAAAAAAAAACYloAAAAAAAAAAAA&callback=url%3Ahttps%3A%2F%2FsomeSigningService.com%2Fa8f7asdfkjha&pubkey=GAU2ZSYYEYO5S5ZQSMMUENJ2TANY4FPXYGGIMU6GMGKTNVDG5QYFW6JS&msg=order%20number%2024`;
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
        {parsedUri &&
          parsedUri.operation === 'tx' && (
            <TranactionUriSummary
              stellarUri={parsedUri as TransactionStellarUri}
            />
          )}
        {parsedUri &&
          parsedUri.operation === 'pay' && (
            <PayUriSummary stellarUri={parsedUri as PayStellarUri} />
          )}
      </div>
    );
  }

  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uri = event.target.value || '';
    this.setState({ uri });
  };
}

export default withStyles(styles)(ParseUriPage);
