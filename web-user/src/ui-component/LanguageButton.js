import { useState } from 'react';
import { useLanguage } from 'hooks/useLanguage';
import {
  Box,
  ButtonBase,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconLanguage } from '@tabler/icons-react';

const LanguageButton = () => {
  const theme = useTheme();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    handleClose();
  };

  return (
    <Box
      sx={{
        ml: 1,
        mr: 1,
        [theme.breakpoints.down('md')]: {
          mr: 1,
        },
      }}
    >
      <ButtonBase
        sx={{ borderRadius: '12px' }}
        onClick={handleClick}
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          variant='rounded'
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            transition: 'all .2s ease-in-out',
            borderColor:
              theme.palette.mode === 'dark'
                ? theme.palette.dark.main
                : theme.palette.grey[300],
            backgroundColor:
              theme.palette.mode === 'dark'
                ? theme.palette.dark.main
                : theme.palette.grey[50],
            '&:hover': {
              background: theme.palette.secondary.dark,
              color: theme.palette.secondary.light,
            },
          }}
          color='inherit'
        >
          <IconLanguage stroke={1.5} size='1.3rem' />
        </Avatar>
      </ButtonBase>

      <Menu
        id='language-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 120,
            borderRadius: 2,
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {Object.values(languages).map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={lang.code === currentLanguage}
            sx={{
              py: 1,
              px: 2,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light,
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Typography variant='body2' sx={{ fontSize: '1.2rem' }}>
                {lang.flag}
              </Typography>
            </ListItemIcon>
            <ListItemText>
              <Typography
                variant='body2'
                sx={{ fontWeight: lang.code === currentLanguage ? 600 : 400 }}
              >
                {lang.name}
              </Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageButton;
