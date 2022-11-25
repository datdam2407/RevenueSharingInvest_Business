import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
// material
import { styled } from '@mui/material/styles';
import { Card, Button, Typography, Box, Stack } from '@mui/material';
import Label from 'components/Label';
// routes
//

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'column',
  [theme.breakpoints.up(414)]: {
    padding: theme.spacing(3)
  }
}));

// ----------------------------------------------------------------------

type PricingPlanCardProps = {
  card: {
    name: string;
    price: number;
    quantity: number;
    projectId: string;
    image: string;
    descriptionList: string[];
  };
};
export default function PricingPlanPackageKrowd({ card }: PricingPlanCardProps) {
  const { name, price, descriptionList, quantity } = card;

  return (
    <RootStyle>
      {quantity === 1 && (
        <Label
          color="primary"
          fontWeight={900}
          sx={{
            top: 16,
            right: 16,
            position: 'absolute'
          }}
        >
          Phổ biến
        </Label>
      )}

      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        {price}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: 'primary.main',
          textTransform: 'capitalize'
        }}
      >
        {name}
      </Typography>

      <Stack component="ul" spacing={2} sx={{ my: 5, width: 1 }}>
        {descriptionList.map((item) => (
          <Stack
            key={item}
            component="li"
            direction="row"
            alignItems="center"
            spacing={1.5}
            // sx={{ typography: 'body2', color: item.isAvailable ? 'text.primary' : 'text.disabled' }}
          >
            <Box component={Icon} icon={checkmarkFill} sx={{ width: 20, height: 20 }} />
            <Typography variant="body2">{descriptionList}</Typography>
          </Stack>
        ))}
      </Stack>

      <Button
        to=""
        fullWidth
        size="large"
        variant="contained"
        disabled={quantity === 0}
        component={RouterLink}
      >
        Cập nhật
      </Button>
    </RootStyle>
  );
}
