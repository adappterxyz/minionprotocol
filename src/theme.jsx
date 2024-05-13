import { createTheme } from '@mui/material/styles';

// Define the modern blue color palette
const modernBluePalette = {
  primary: {
    main: '#1976D2', // A modern, vibrant blue
    dark: '#115293',
    contrastText: '#fff',
  },
  secondary: {
    main: '#6EC6FF', // A lighter blue for secondary elements
  },
  background: {
    default: '#f0f2f5', // A subtle grey for background to reduce strain on eyes
    paper: '#ffffff',
  },
  text: {
    primary: '#20262D', // Dark grey for readability
    secondary: '#5f6368', // Medium grey for secondary text
  },
};

// Define the modern typography
const modernTypography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: 14,
  h4: {
    fontWeight: 600,
    fontSize: '1.3rem', // Larger font-size for titles
    lineHeight: 1.35,
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.2rem', // Larger font-size for titles
    lineHeight: 1.35,
  },
  body1: {
    lineHeight: 1.5, // Increased line-height for body text for readability
    fontSize: '1rem',
  },
  button: {
    fontWeight: 600,
    textTransform: 'none',
  },
};

// Component overrides for a cohesive, interactive theme
const modernComponentOverrides = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '0.375rem', // Rounded corners for buttons
      },
      contained: {
        boxShadow: 'none', // Remove the default button shadow for a flatter design
        '&:hover': {
          boxShadow: '0 2px 6px rgba(0,0,0,0.12)', // Subtle shadow on hover for interactivity
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '0.5rem', // Rounded corners for cards
        overflow: 'hidden', // Ensures the card content respects the border radius
        '&.MuiCard-invert': {
          backgroundColor: modernBluePalette.primary.dark, // Example inverted color
          color: modernBluePalette.primary.contrastText, // Example text color for inverted card
          "max-width":"350px",
          "text-align":"center",
          '&.MuiCard-invert': {margin: "0 auto"}
          // Add more styles as needed
        },
      },
     
    },
  },
 
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '16px', // Spacing inside cards
        '&:last-child': {
          paddingBottom: '16px', // Ensures consistent padding within the card
        },
      },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: {
        'h6':{ fontWeight: "bold" },
        margin: '0.5rem 0', // Space between accordions
        borderRadius: '0.375rem', // Rounded corners for accordions
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Subtle shadow for depth
        '&:before': {
          color: modernBluePalette.primary.dark,
          display: 'none', // Remove the default line
        },
        '&.Mui-expanded': {
          margin: '0.5rem 0', // Maintain margin when expanded
        },
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        padding: '0 16px', // Horizontal padding for summary content
        minHeight: '48px', // Height of the summary to increase area for interaction
        '&.Mui-expanded': {
          minHeight: '48px',
        },
        '& .MuiTypography-root': {
          fontSize: '0.875rem', // Set your desired font size
        },
      },
      content: {
        margin: '12px 0', // Vertical margin for the summary content
        '&.Mui-expanded': {
          margin: '12px 0',
        },  '& .MuiTypography-root': {
          fontSize: '0.875rem', // Set your desired font size
        },
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        padding: '16px', // Padding for the accordion details
        '& .MuiTypography-root': {
          fontSize: '0.875rem', // Set your desired font size
        },
      }, 
    },
  },
  MuiTable: {
    styleOverrides: {
      root: {
        borderSpacing: '0 8px', // Spacing between table rows
        borderCollapse: 'separate',
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:last-child td': {
          borderBottom: 'none', // Remove bottom border for the last row
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: 'none', // Remove cell bottom borders for a cleaner look
        padding: '10px', // Cell padding for readability
        border :0
      },
      head: {
        background: modernBluePalette.primary.dark,
        color: modernBluePalette.primary.contrastText, // Head cell color for emphasis
        fontWeight: 600, // Make the header text bold
        border :0
      },
    },
  },
  // ... additional overrides as needed
};

// Create the modern theme
const theme = createTheme({
  palette: modernBluePalette,
  typography: modernTypography,
  components: modernComponentOverrides,
});

export default theme;
