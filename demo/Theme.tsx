import * as React from 'react';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      contrastText: '#FFF',
      dark: '#2B5283',
      light: '#63a4ff',
      main: '#1976d2'
    },
    secondary: {
      contrastText: '#000',
      dark: '#2B5283',
      light: '#ffcb71',
      main: '#ee9a42'
    }
  }
});

export default class Theme extends React.Component {
  public render() {
    return (
      <MuiThemeProvider theme={theme}>{this.props.children}</MuiThemeProvider>
    );
  }
}
