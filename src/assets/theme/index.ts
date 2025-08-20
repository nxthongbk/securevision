import { createTheme, ThemeOptions } from '@mui/material/styles';
import { CaretDown } from '@phosphor-icons/react';
const sizeButton = {
  small: '6px 12px',
  medium: '9px 16px',
  large: '12px 32px'
};

const typography = {
  fontFamily: ['Inter'].join(','),
  button1: {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: '28px'
  },
  button2: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '24px'
  },
  button3: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '20px'
  },
  h1: {
    fontSize: 56,
    lineHeight: '72px',
    fontWeight: 700
  },
  h2: {
    fontSize: 48,
    lineHeight: '56px',
    fontWeight: 700
  },
  h3: {
    fontSize: 40,
    lineHeight: '48px',
    fontWeight: 700
  },
  h4: {
    fontSize: 32,
    lineHeight: '40px',
    fontWeight: 600
  },
  h5: {
    fontSize: 24,
    lineHeight: '32px',
    fontWeight: 600
  },
  h6: {
    fontSize: 20,
    lineHeight: '24px',
    fontWeight: 600
  },

  label1: {
    fontSize: 18,
    lineHeight: '28px',
    fontWeight: 600
  },
  label2: {
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 600
  },
  label3: {
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 600
  },
  label4: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 600
  },
  body1: {
    fontSize: 18,
    lineHeight: '28px',
    fontWeight: 400
  },
  body2: {
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 400
  },
  body3: {
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 400
  },
  caption1: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 400,
    color: '#737982'
  },
  caption2: {
    fontSize: 10,
    lineHeight: '16px',
    fontWeight: 400
  }
};

const components = {
  MuiOutlinedInput: {
    styleOverrides: {
      input: {
        padding: '10px 16px'
      },
      root: {
        borderRadius: '6px',
        borderWidth: '1px!important',
        borderColor: 'var(--neutral)',
        '&.Mui-focused': {
          borderWidth: '1px!important',
          borderColor: 'var(--neutral)'
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderWidth: '1px!important',
          borderColor: 'var(--neutral)'
        }
      }
    }
  },
  // Override maxHeight for select MUI globally
  MuiMenu: {
    styleOverrides: {
      paper: {
        maxHeight: 500 // Override maxHeight globally
      }
    }
  },
  MuiSelect: {
    defaultProps: {
      fullWidth: true,
      IconComponent: CaretDown
    },
    styleOverrides: {
      root: () => ({
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--border-color)'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--grey-neutral-300)'
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--primary) !important'
        },

        '&.MuiInputBase-root': {
          height: '40px',
          borderRadius: '6px',
          borderWidth: '0px !important'
        },

        '& .MuiSelect-icon': {
          width: '24px',
          height: '24px',
          top: '20%',
          right: '10px'
        },
        '&.Mui-disabled': {
          backgroundColor: 'rgba(158, 162, 169, 0.5)'
        }
      })
    }
  },

  MuiTextField: {
    defaultProps: {
      fullWidth: true,
      InputLabelProps: {
        shrink: false
      }
    },

    styleOverrides: {
      root: () => ({
        '& .MuiFormHelperText-root': {
          marginLeft: 0,
          marginTop: '6px',
          '&.Mui-error': {
            color: 'var(--alert)'
          }
        },
        '& .MuiInputLabel-root': {
          position: 'static',
          color: 'var(--text-primary)',
          transform: 'none',
          fontWeight: '600',
          fontSize: '14px',
          marginBottom: '8px',
          '&.Mui-focused ': {
            color: 'var(--text-primary)'
          },
          '&.Mui-error ': {
            color: 'var(--text-primary)'
          },
          '&.Mui-disabled ': {
            color: 'var(--text-tertiary)'
          }
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: '6px',
          '& input': {
            color: 'var(--text-primary)',
            '&::placeholder': {
              color: 'var(--text-secondary)',
              fontSize: 14,
              height: '24px'
            },
            overflow: 'hidden',
            fontSize: 16,
            padding: '8px 16px',
            height: '24px'
          },
          '& fieldset': {
            border: '1px solid',
            borderColor: 'var(--border-color)'
          },

          //hover
          '&:hover fieldset': {
            borderColor: 'var(--grey-neutral-300)'
          },
          //focus
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--primary)',
            borderWidth: '1px'
          },

          '&.Mui-error fieldset': {
            borderColor: 'var(--alert) '
          },
          '&.Mui-disabled fieldset': {
            borderColor: 'var(--grey-neutral-200)',
            color: 'var(--text-disable)'
          }
        },
        '& .MuiInputBase-root.Mui-disabled': {
          backgroundColor: 'var(--grey-neutral-80)',
          color: 'var(--text-disable)'
        }
      })
    }
  },
  MuiInputBase: {
    fullWidth: true,
    styleOverrides: {
      root: {
        fontSize: 14,
        lineHeight: '20px',
        fontWeight: 400
      }
    }
  },
  MuiButton: {
    defaultProps: {
      disableRipple: true,
      size: 'medium'
    },
    styleOverrides: {
      sizeLarge: {
        padding: sizeButton.large,
        fontSize: '20px'
      },
      sizeMedium: {
        padding: sizeButton.medium,
        fontSize: '16px'
      },
      sizeSmall: {
        padding: sizeButton.small,
        fontSize: '12px'
      },

      root: ({ ownerState }) => ({
        borderRadius: 6,
        textTransform: 'none',
        fontWeight: 500,
        boxShadow: 'none',

        '&.Mui-disabled': {
          background: 'var(--disable-btn)',
          color: 'var(--text-disable)'
        },
        ...(ownerState.variant === 'contained' &&
          ownerState.color === 'primary' && {
            color: 'var(--white) ',
            backgroundColor: 'var(--primary)',
            '&:hover': {
              backgroundColor: 'var(--hover-btn)'
            },
            '&:active': {
              color: 'var(--primary) ',
              backgroundColor: 'var(--white)',
              boxShadow: 'none'
            }
          }),
        ...(ownerState.variant === 'contained' &&
          ownerState.color === 'secondary' && {
            color: 'var(--primary) ',
            backgroundColor: 'var(--blue-60)',
            '&:hover': {
              backgroundColor: 'var(--blue-80)',
              boxShadow: 'none'
            },
            '&:active': {
              boxShadow: 'none',
              backgroundColor: 'var(--turquoise-60)'
            }
          }),
        ...(ownerState.variant === 'contained' &&
          ownerState.color === 'tertiary' && {
            color: 'var(--text-primary) ',
            backgroundColor: 'var(--grey-primary-60)',
            '&:hover': {
              backgroundColor: 'var(--grey-primary-80)',
              boxShadow: 'none'
            },
            '&:active': {
              color: 'var(--white) ',
              backgroundColor: 'var(--primary)'
            }
          }),

        ...(ownerState.variant === 'outlined' &&
          ownerState.color === 'primary' && {
            color: 'var(--primary)',
            borderWidth: 1,
            borderColor: 'var(--primary)',
            '&:hover': {
              backgroundColor: 'var(--primary)',
              color: 'var(--white)'
            },
            '&:active': {
              backgroundColor: 'var(--primary)',
              color: 'var(--white)'
            }
          }),
        ...(ownerState.variant === 'outlined' &&
          ownerState.color === 'secondary' && {
            color: 'var(--primary)',
            backgroundColor: 'var(--white)',
            borderWidth: 1,
            borderColor: 'var(--border-color)',
            '&:hover': {
              borderColor: 'var(--primary)',
              backgroundColor: 'var(--white)'
            },
            '&:active': {
              color: 'var(--primary)',
              backgroundColor: 'var(--turquoise-60)',
              borderColor: 'var(--primary)'
            }
          }),
        ...(ownerState.variant === 'outlined' &&
          ownerState.color === 'tertiary' && {
            color: 'var(--text-primary)',
            borderWidth: 1,
            borderColor: 'transparent',

            '&:hover': {
              backgroundColor: 'var(--grey-primary-60)'
            },
            '&:active': {
              color: 'var(--primary)',
              borderWidth: 1,
              borderColor: 'transparent'
            }
          }),

        ...(ownerState.variant === 'text' &&
          ownerState.color === 'primary' && {
            color: 'var(--primary)',

            '&:hover': {
              textDecoration: 'underline'
            },
            '&:active': {
              color: 'var(--text-primary)'
            }
          })
      })
    }
  },

  MuiFormHelperText: {
    styleOverrides: {
      root: {
        margin: '5px 0 0 0'
      }
    }
  },
  MuiDataGrid: {
    styleOverrides: {
      root: {
        '& .MuiDataGrid-cell:focus': {
          outline: 'none'
        },
        '& .MuiDataGrid-cell:focus-within': {
          outline: 'none'
        },
        '& .MuiDataGrid-columnHeader:focus': {
          outline: 'none'
        },
        '& .MuiDataGrid-row--lastVisible': {
          borderBottom: '1px solid var(--grey-primary-80) !important'
        }
      }
    }
  },

  MuiTabs: {
    styleOverrides: {
      root: {
        '& .MuiTabs-indicator': {
          backgroundColor: 'var(--primary)'
        }
      }
    }
  },
  MuiTab: {
    styleOverrides: {
      root: {
        color: 'var(--tertiary)',
        textTransform: 'unset',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: '20px',
        '&.Mui-selected': {
          color: 'var(--primary)'
        },
        '&:hover': {
          color: 'var(--primary)'
        }
      }
    }
  },
  MuiList: {
    styleOverrides: {
      root: {
        // Example of style overrides
        padding: '8px',
        borderRadius: '8px',
        '& .MuiMenuItem-root': {
          // Styling ListItem within the List
          borderRadius: '6px'
        },
        '& .Mui-selected': {
          backgroundColor: 'var(--grey-primary-80) !important'
        }
      }
    }
  },
  MuiAutocomplete: {
    styleOverrides: {
      listbox: {
        // Example of style overrides for the listbox
        padding: '8px !important',
        '& .MuiAutocomplete-option': {
          // Styling options within the listbox
          borderRadius: '6px'
        }
      }
    }
  }
};

const theme = createTheme({
  palette: {
    tertiary: {
      main: '#D9E1E8'
    },
    info: {
      main: '#fff'
    },
    text: {
      primary: '#3A3D41',
      secondary: '#737982'
    }
  },
  typography: typography,
  components: components,
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 744,
      miniLaptop: 1280,
      laptop: 1440,
      desktop: 1728
    }
  }
} as ThemeOptions);

export default theme;
