import * as React from 'react';

import { Button, TextField, Typography, withStyles } from '@material-ui/core';

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

class ReplaceInner extends React.Component<any, any> {
  public state = {
    replacementValues: {}
  };

  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.name;
    const value = event.target.value;
    const { replacementValues } = this.state;
    replacementValues[id] = value;
    this.setState({ replacementValues });
  };

  public render() {
    const { replacementValues } = this.state;
    const { replacements } = this.props;

    const values = replacements.map(({ id, path, hint }) => (
      <div key={path}>
        <pre>ID: {id}</pre>
        <pre>Path: {path}</pre>
        <pre>Hint: {hint}</pre>
        <TextField
          name={id}
          label={`Enter replacement for ${id}`}
          margin="dense"
          fullWidth
          onChange={this.onChange}
          value={replacementValues[id] || ''}
        />
      </div>
    ));

    return (
      <div>
        {values}
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            this.props.onReplace(replacementValues);
          }}
        >
          Perform Replacements
        </Button>
      </div>
    );
  }
}

const Replace = withStyles(styles)(ReplaceInner);

// tslint:disable-next-line:max-classes-per-file
class TransactionUriSummary extends React.Component<{
  classes: any;
  onUpdateStellarUri: any;
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
        <Field label="xdr">
          <a
            target="_blank"
            href={`https://www.stellar.org/laboratory/#xdr-viewer?input=${encodeURIComponent(
              stellarUri.xdr
            )}`}
          >
            {stellarUri.xdr}
          </a>
        </Field>
        <Typography gutterBottom variant="subheading">
          Optional Fields
        </Typography>
        <Field label="callback">{stellarUri.callback}</Field>
        <Field label="pubkey">{stellarUri.pubkey}</Field>
        <Field label="msg">{stellarUri.msg}</Field>
        <Field label="network_passphrase">{stellarUri.networkPassphrase}</Field>
        <Field label="origin_domain">{stellarUri.originDomain}</Field>
        <Field label="replace">
          {stellarUri.getReplacements().length && (
            <Replace
              replacements={stellarUri.getReplacements()}
              onReplace={this.onReplace}
            />
          )}
        </Field>
        <Field label="signature">
          {stellarUri.signature && <ValidateSignature uri={stellarUri} />}
        </Field>
        <Field label="QR Code">
          <QRCode uri={stellarUri.toString()} />
        </Field>
      </div>
    );
  }

  private onReplace = replacementValues => {
    const newUri = this.props.stellarUri.replace(replacementValues);
    this.props.onUpdateStellarUri(newUri.toString());
  };
}

export default withStyles(styles)(TransactionUriSummary);
