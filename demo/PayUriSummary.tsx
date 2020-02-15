import * as React from 'react';

import { Button, TextField, Typography, withStyles } from '@material-ui/core';
import { Keypair } from 'stellar-sdk';

import { PayStellarUri } from '../src';

import QRCode from './QRCode';
import ValidateSignature from './ValidateSignature';

const styles = {
  field: { padding: 4 }
};

class FieldInner extends React.Component<any, any> {
  public render() {
    const { label, children, classes } = this.props;
    return (
      <div className={classes.field}>
        <label>{label}</label>
        <pre>{children || '<none provided>'}</pre>
      </div>
    );
  }
}

const Field = withStyles(styles)(FieldInner);

class AddSignature extends React.Component<any, any> {
  public state = {
    secretKey: ''
  };

  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ secretKey: event.target.value });
  };

  private onClick = () => {
    this.props.onAddSignature({ secretKey: this.state.secretKey });
  };

  public render() {
    const { secretKey } = this.state;

    return (
      <>
        <TextField
          label="Enter Secret Key"
          onChange={this.onChange}
          margin="dense"
          value={secretKey}
          fullWidth
        />
        <div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={this.onClick}
          >
            Add Signature
          </Button>
        </div>
      </>
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
class PageUriSummary extends React.Component<{
  classes: any;
  onUpdateStellarUri: any;
  stellarUri: PayStellarUri;
}> {
  public render() {
    const { classes, stellarUri } = this.props;
    const uriString = stellarUri.toString();
    return (
      <div>
        <Typography gutterBottom variant="headline">
          Operation: pay
        </Typography>
        <Field label="URI:">
          <a href={uriString}>{uriString}</a>
        </Field>
        <Typography gutterBottom variant="subheading">
          Required Fields
        </Typography>
        <Field label="destination">{stellarUri.destination}</Field>
        <Typography gutterBottom variant="subheading">
          Optional Fields
        </Typography>
        <Field label="amount">{stellarUri.amount}</Field>
        <Field label="asset_code">{stellarUri.assetCode}</Field>
        <Field label="asset_issuer">{stellarUri.assetIssuer}</Field>
        <Field label="memo">{stellarUri.memo}</Field>
        <Field label="memo_type">{stellarUri.memoType}</Field>
        <Field label="callback">{stellarUri.callback}</Field>
        <Field label="pubkey">{stellarUri.pubkey}</Field>
        <Field label="msg">{stellarUri.msg}</Field>
        <Field label="network_passphrase">{stellarUri.networkPassphrase}</Field>
        <Field label="origin_domain">{stellarUri.originDomain}</Field>
        <Field label="signature">
          {stellarUri.signature || '<none provided>'}
          {stellarUri.signature && <ValidateSignature uri={stellarUri} />}
        </Field>
        <Field label="Add New Signature">
          <AddSignature onAddSignature={this.addSignature} />
        </Field>
        <Field label="QR Code">
          <QRCode uri={stellarUri.toString()} />
        </Field>
      </div>
    );
  }

  private addSignature = ({ secretKey }) => {
    const keypair = Keypair.fromSecret(secretKey);
    this.props.stellarUri.addSignature(keypair);
    this.props.onUpdateStellarUri(this.props.stellarUri.toString());
  };
}

export default withStyles(styles)(PageUriSummary);
