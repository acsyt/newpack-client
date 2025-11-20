import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

type StatusChipProps = {
  status: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
};

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive'
}) => {
  const label = status ? activeLabel : inactiveLabel;

  return (
    <Tooltip arrow title={label}>
      <Chip
        variant='outlined'
        label={label}
        size='small'
        color={status ? 'success' : 'error'}
      />
    </Tooltip>
  );
};
