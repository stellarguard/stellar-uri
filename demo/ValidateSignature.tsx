import * as React from 'react';

import { Button, CircularProgress, withStyles } from '@material-ui/core';

import { StellarUri } from '../src';

const styles = () => ({
  button: { marginTop: 4, marginBottom: 4 },
  message: { marginTop: 4, marginBottom: 4 }
});

class ValidateSignature extends React.Component<
  {
    classes: any;
    uri: StellarUri;
  },
  any
> {
  public state: any = {};

  public render() {
    const { classes } = this.props;
    const { isValid = false, loading = false, loaded = false } = this.state;

    return (
      <div>
        <div className={classes.message}>
          {loaded && isValid && <div>Verified</div>}
          {loaded && !isValid && <div>Not Verified</div>}
        </div>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          size="small"
          onClick={this.validate}
          disabled={loading}
        >
          Verify Signature
        </Button>
      </div>
    );
  }

  private validate = async () => {
    this.setState({ loading: true, loaded: false });
    const isValid = await this.props.uri.verifySignature();
    this.setState({ isValid, loading: false, loaded: true });
  };
}

export default withStyles(styles)(ValidateSignature);
