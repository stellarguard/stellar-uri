import * as React from 'react';

import { Typography, withStyles } from '@material-ui/core';

import { TransactionStellarUri } from '../src';
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

// tslint:disable-next-line:max-classes-per-file
class TransactionUriSummary extends React.Component<{
  classes: any;
  stellarUri: TransactionStellarUri;
}> {
  public render() {
    const { classes, stellarUri } = this.props;
    const uriString = stellarUri.toString();

    return (
      <div>
        <Typography gutterBottom variant="headline">
          Operation: tx
        </Typography>
        <Field label="URI:">
          <a href={uriString}>{uriString}</a>
        </Field>
        <Typography gutterBottom variant="subheading">
          Required Fields
        </Typography>
        <Field label="xdr">{stellarUri.xdr}</Field>
        <Typography gutterBottom variant="subheading">
          Optional Fields
        </Typography>
        <Field label="callback">{stellarUri.callback}</Field>
        <Field label="pubkey">{stellarUri.pubkey}</Field>
        <Field label="msg">{stellarUri.msg}</Field>
        <Field label="network_passphrase">{stellarUri.networkPassphrase}</Field>
        <Field label="origin_domain">{stellarUri.originDomain}</Field>
        <Field label="signature">
          {stellarUri.signature || '<none provided>'}
          {stellarUri.signature && <ValidateSignature uri={stellarUri} />}
        </Field>
        <Field label="QR Code">
          <QRCode uri={stellarUri.toString()} />
        </Field>
      </div>
    );
  }
}

export default withStyles(styles)(TransactionUriSummary);
