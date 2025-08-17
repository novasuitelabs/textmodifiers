import { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  ButtonGroup,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  useMediaQuery,
  AppBar,
  Toolbar,
  Fab,
  Snackbar,
  Alert
} from '@mui/material';
import {
  ContentCopy,
  Clear,
  Download,
  Upload,
  GitHub,
  DarkMode,
  LightMode
} from '@mui/icons-material';

// Text transformation functions
const textTransformers = {
  uppercase: (text: string) => text.toUpperCase(),
  lowercase: (text: string) => text.toLowerCase(),
  titlecase: (text: string) => 
    text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
  sentencecase: (text: string) => 
    text.toLowerCase().replace(/(^\w|\.\s+\w)/g, (letter) => letter.toUpperCase()),
  camelcase: (text: string) => 
    text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()),
  snakecase: (text: string) => 
    text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_'),
  kebabcase: (text: string) => 
    text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-'),
  removeMarkdown: (text: string) => 
    text.replace(/[#*_`~\[\]()]/g, '').replace(/\n{3,}/g, '\n\n'),
  removeSpaces: (text: string) => text.replace(/\s+/g, ''),
  removeNewlines: (text: string) => text.replace(/\n/g, ' '),
  reverse: (text: string) => text.split('').reverse().join(''),
  countWords: (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return `Word count: ${words.length}`;
  },
  countCharacters: (text: string) => `Character count: ${text.length}`,
  countLines: (text: string) => `Line count: ${text.split('\n').length}`
};

type TransformerType = keyof typeof textTransformers;

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Auto-detect system dark mode preference
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    setIsDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#6750A4',
      },
      secondary: {
        main: '#625B71',
      },
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      h1: {
        fontFamily: '"Inter", sans-serif',
        fontWeight: 700,
      },
      h2: {
        fontFamily: '"Inter", sans-serif',
        fontWeight: 600,
      },
      h3: {
        fontFamily: '"Inter", sans-serif',
        fontWeight: 600,
      },
      h4: {
        fontFamily: '"Inter", sans-serif',
        fontWeight: 600,
      },
      h5: {
        fontFamily: '"Inter", sans-serif',
        fontWeight: 600,
      },
      h6: {
        fontFamily: '"Inter", sans-serif',
        fontWeight: 600,
      },
      body1: {
        fontFamily: '"Inter", sans-serif',
        fontWeight: 400,
      },
      body2: {
        fontFamily: '"Inter", sans-serif',
        fontWeight: 400,
      },
      button: {
        fontFamily: '"Inter", sans-serif',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
              fontFamily: '"Inter", sans-serif',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
          },
        },
      },
    },
  });

  const handleTransform = (transformer: TransformerType) => {
    if (!inputText.trim()) {
      showSnackbar('Please enter some text first', 'error');
      return;
    }
    
    const result = textTransformers[transformer](inputText);
    setOutputText(result);
    showSnackbar(`Text transformed using ${transformer}`, 'success');
  };

  const handleCopy = async () => {
    if (!outputText) {
      showSnackbar('No text to copy', 'error');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(outputText);
      showSnackbar('Text copied to clipboard!', 'success');
    } catch (err) {
      showSnackbar('Failed to copy text', 'error');
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleDownload = () => {
    if (!outputText) {
      showSnackbar('No text to download', 'error');
      return;
    }
    
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transformed-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSnackbar('Text downloaded!', 'success');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setInputText(text);
      showSnackbar('File uploaded successfully!', 'success');
    };
    reader.readAsText(file);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const transformationButtons = [
    { key: 'uppercase', label: 'UPPERCASE' },
    { key: 'lowercase', label: 'lowercase' },
    { key: 'titlecase', label: 'Title Case' },
    { key: 'sentencecase', label: 'Sentence case' },
    { key: 'camelcase', label: 'camelCase' },
    { key: 'snakecase', label: 'snake_case' },
    { key: 'kebabcase', label: 'kebab-case' },
    { key: 'removeMarkdown', label: 'Remove Markdown' },
    { key: 'removeSpaces', label: 'Remove Spaces' },
    { key: 'removeNewlines', label: 'Remove Newlines' },
    { key: 'reverse', label: 'Reverse' },
    { key: 'countWords', label: 'Count Words' },
    { key: 'countCharacters', label: 'Count Characters' },
    { key: 'countLines', label: 'Count Lines' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Text Modifier
          </Typography>
          <Tooltip title="Toggle theme">
            <IconButton 
              color="inherit" 
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>
          <Tooltip title="View on GitHub">
            <IconButton 
              color="inherit"
              component="a"
              href="https://github.com/novasuitelabs/textmodifiers"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Transform Your Text
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            A powerful text modifier with multiple transformation options
          </Typography>
        </Box>

        <Stack spacing={3}>
          {/* Input Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Input Text
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here..."
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                component="label"
              >
                Upload File
                <input
                  type="file"
                  hidden
                  accept=".txt,.md,.json,.csv"
                  onChange={handleFileUpload}
                />
              </Button>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleClear}
              >
                Clear
              </Button>
            </Stack>
          </Paper>

          {/* Transformation Buttons */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transformations
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {transformationButtons.map(({ key, label }) => (
                <Chip
                  key={key}
                  label={label}
                  onClick={() => handleTransform(key as TransformerType)}
                  clickable
                  variant="outlined"
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText'
                    }
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Output Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Output
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={outputText}
              InputProps={{ readOnly: true }}
              placeholder="Transformed text will appear here..."
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Button
                variant="contained"
                startIcon={<ContentCopy />}
                onClick={handleCopy}
                disabled={!outputText}
              >
                Copy
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownload}
                disabled={!outputText}
              >
                Download
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
