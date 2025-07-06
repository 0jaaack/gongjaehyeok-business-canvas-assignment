import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, type ThemeConfig } from 'antd';
import MembersTable from './components/MembersTable';
import { ModalProvider } from './components/ModalProvider';
import { ServiceProvider } from './components/ServiceProvider';
import { createServices } from './services';

const globalTheme: ThemeConfig = {
  token: {
    fontFamily: 'Pretendard, -apple-system, system-ui, sans-serif',
    colorBgContainer: '#FFFFFF',
    colorPrimary: '#4A7CFE',
  },
  components: {
    Typography: {
      titleMarginTop: 0,
      titleMarginBottom: 0,
    },
    Layout: {
      headerBg: '#FFFFFF',
    },
    Form: {
      itemMarginBottom: 20,
      verticalLabelPadding: '0 0 6px',
      labelColor: '#00000072',
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

const services = createServices({
  storage: 'local-storage',
});

function App() {
  return (
    <StyleProvider>
      <ConfigProvider theme={globalTheme}>
        <ServiceProvider services={services}>
          <ModalProvider>
            <MembersTable />
          </ModalProvider>
        </ServiceProvider>
      </ConfigProvider>
    </StyleProvider>
  );
}

export default App;
