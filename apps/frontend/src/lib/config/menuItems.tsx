import {
  DashboardOutlined,
  TeamOutlined,
  BankOutlined,
  FundOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  GroupOutlined,
} from '@ant-design/icons';

export const MENU_ITEMS = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'dashboard' },
  { key: '/contacts', icon: <TeamOutlined />, label: 'contacts' },
  { key: '/companies', icon: <BankOutlined />, label: 'companies' },
  { key: '/deals', icon: <FundOutlined />, label: 'deals' },
  { key: '/tasks', icon: <CheckSquareOutlined />, label: 'tasks' },
  { key: '/calendar', icon: <CalendarOutlined />, label: 'calendar' },
  { key: '/groups', icon: <GroupOutlined />, label: 'groups' },
];
