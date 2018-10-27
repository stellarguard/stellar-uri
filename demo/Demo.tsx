import * as React from 'react';

import { AppBar, Tab, Tabs, withStyles } from '@material-ui/core';

import ParseUriPage from './ParseUriPage';
import Theme from './Theme';

const styles = () => ({
  main: { padding: 24 }
});

class Demo extends React.Component<any, any> {
  public state = { value: 0 };

  public render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <Theme>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Parsing URIs" />
            {/* <Tab label="Creating Transation URIs" />> */}
          </Tabs>
        </AppBar>
        <main className={classes.main}>
          {value === 0 && <ParseUriPage />}
          {/* {value === 1 && <div>Item Two</div>} */}
        </main>
      </Theme>
    );
  }

  private handleChange = (event, value) => {
    this.setState({ value });
  };
}

export default withStyles(styles)(Demo);
