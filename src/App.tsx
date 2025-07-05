import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, type ThemeConfig } from 'antd';
import MembersTable from './components/MembersTable';

const globalTheme: ThemeConfig = {
  token: {
    fontFamily: 'Pretendard, -apple-system, system-ui, sans-serif',
    colorBgContainer: '#ffffff',
    colorPrimary: '#4A7CFE',
  },
  components: {
    Typography: {
      titleMarginTop: 0,
      titleMarginBottom: 0,
    },
    Layout: {
      headerBg: '#ffffff',
    },
    Table: {
      headerBorderRadius: 0,
    },
    Button: {
      defaultColor: '#000000a5',
      textTextColor: '#000000a5',
    },
  },
};

function App() {
  return (
    <StyleProvider>
      <ConfigProvider theme={globalTheme}>
        <MembersTable />
      </ConfigProvider>
    </StyleProvider>
  );
}

export default App;
