import * as React from "react";
import * as ReactDOM from "react-dom";
import { LocaleProvider } from "antd";
import enUS from 'antd/lib/locale-provider/en_US';

import App from './App';

ReactDOM.render(
  <LocaleProvider locale={enUS}>
    <App />
  </LocaleProvider>,
  document.getElementById('root')
);
