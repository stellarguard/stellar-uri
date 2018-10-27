import * as React from 'react';

import { Button, CircularProgress, withStyles } from '@material-ui/core';

import { StellarUri } from '../src';

const styles = {
  field: { padding: 4 }
};

// tslint:disable-next-line:max-classes-per-file
class ValidateSignature extends React.Component<
  {
    classes: any;
    uri: StellarUri;
  },
  any
> {
  public state: any = {};

  public render() {
    const { isValid = false, loading = false, loaded = false } = this.state;

    return (
      <div>
        {loaded && isValid && <div>Verified</div>}
        {loaded && !isValid && <div>Not Verified</div>}
        <Button onClick={this.validate}>
          Verify Signature {loading && <CircularProgress />}
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
