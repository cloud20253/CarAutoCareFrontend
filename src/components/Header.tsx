import Stack from '@mui/material/Stack';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const breadcrumbMap: Record<string, string[]> = {
    '/admin/dashboard': ['Dashboard', 'Home'],
    '/admin/users': ['Dashboard', 'Users'],
    '/master/manage-service': ['Master', 'Manage Service'],
    '/master/manage-repair': ['Master', 'Manage Repair'],
  };

  const breadcrumbs = breadcrumbMap[location.pathname] || ['Dashboard'];

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs breadcrumbs={breadcrumbs} />
      <Stack direction="row" sx={{ gap: 1 }}>
        <CustomDatePicker />
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
