import * as React from 'react';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    text: {
      primary: '#111320',
      secondary: '#576789'
    },
    primary: {
      main: '#0607ac'
    },
    secondary: {
      contrastText: '#FFF'
      main: '#fb8313'
    },
    background: {
      default: '#f2f7ff'
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
