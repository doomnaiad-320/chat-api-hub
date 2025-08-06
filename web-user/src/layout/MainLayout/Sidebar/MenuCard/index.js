import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Typography
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate } from 'react-router-dom';
import { API } from 'utils/api';
import { calculateQuota, showError } from 'utils/common';


const MenuCard = () => {
  const theme = useTheme();
  const account = useSelector((state) => state.account);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState([]);

  const loadUser = async () => {
    let res = await API.get(`/api/user/self`);
    const { success, message, data } = res.data;
    if (success) {
      setInputs(data);
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    if (account.user) {
      loadUser().then();
    }
  }, [account.user?.username]);

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        backgroundColor: theme.palette.mode === 'dark'
          ? theme.palette.grey[800]
          : theme.palette.grey[50],
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark'
            ? theme.palette.grey[700]
            : theme.palette.grey[100],
          borderColor: theme.palette.primary.main,
        }
      }}
    >
      {/* 用户信息区域 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1.5,
          cursor: 'pointer'
        }}
        onClick={() => navigate('/profile')}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            mr: 1.5,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontSize: '0.875rem'
          }}
        >
          <PersonIcon fontSize="small" />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {account.user?.username}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.75rem'
            }}
          >
            {inputs.group || '用户组'}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* 余额信息区域 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          p: 1,
          borderRadius: 1,
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        }}
        onClick={() => navigate('/topup')}
      >
        <AccountBalanceWalletIcon
          sx={{
            mr: 1,
            color: theme.palette.success.main,
            fontSize: '1.25rem'
          }}
        />
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.75rem',
              display: 'block'
            }}
          >
            余额
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: theme.palette.success.main,
              fontSize: '0.875rem'
            }}
          >
            {calculateQuota(inputs.quota)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MenuCard;
