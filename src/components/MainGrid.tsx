import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArticleIcon from '@mui/icons-material/Article';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GarageIcon from '@mui/icons-material/Garage';
import StatCard, { StatCardProps } from './StatCard';

const data: StatCardProps[] = [
  {
    value: 'Purchase',
    icon: <AddShoppingCartIcon />,
    url : ''
    
  },
  {
    value: 'Vehicle Registration',
    icon: <ArticleIcon />,
    url : '',
    
  },
  {
    // title: 'Event count',
    value: 'Booking',
    icon: <GarageIcon />,
    url : '',
    
  },
  {
    // title: 'Event count',
    value: 'Service Queue',
    icon: <GarageIcon />,
    url : '',
    
  },{
    // title: 'Event count',
    value: 'Service History',
    icon: <FormatListBulletedIcon />,
    url : '',
    
  },{
    // title: 'Event count',
    value: 'Counter Sale',
    icon: <GarageIcon />,
    url : '',
    
  },{
    // title: 'Event count',
    value: 'Quatation',
    icon: <GarageIcon />,
    url : '',
    
  },
  {
    value : 'Insurance',
    icon :<GarageIcon />,
    url : '',

  }
];

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
      AUTO CAR CARE POINT
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        {/* <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid> */}
        {/* <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid> */}
      </Grid>
      {/* <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography> */}
      {/* <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <CustomizedDataGrid />
        </Grid> */}
        {/* <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid> */}
      {/* </Grid> */}
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
