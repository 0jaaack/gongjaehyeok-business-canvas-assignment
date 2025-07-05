import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, type ThemeConfig, Typography } from 'antd';

const { Text } = Typography;

const globalTheme: ThemeConfig = {};

function App() {
  return (
    <StyleProvider>
      <ConfigProvider theme={globalTheme}>
        <Text className="text-3xl">Business Canvas Assignment</Text>
      </ConfigProvider>
    </StyleProvider>
  );
}

export default App;
