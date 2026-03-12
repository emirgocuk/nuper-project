# mui
Source: https://antigravity.codes/agent-skills/react/mui

## AI Worker Instructions
When the user requests functionality related to mui, follow these guidelines and utilize this context.

## Scraped Content

# mui
```
onBackdropClick
```
```
onClose
```
```
slots
```
```
slotProps
```
```
enableCssLayer
```
```
import { Box, Typography, Button, Paper } from '@mui/material';import type { SxProps, Theme } from '@mui/material';const styles: Record<string, SxProps<Theme>> = {  container: {    p: 2,    display: 'flex',    flexDirection: 'column',    gap: 2,  },  header: {    mb: 3,    fontSize: '1.5rem',    fontWeight: 600,  },};function MyComponent() {  return (    <Paper sx={styles.container}>      <Typography sx={styles.header}>        Title      </Typography>      <Button variant="contained">        Action      </Button>    </Paper>  );}
```
```
import { Box, Typography, Button, Paper } from '@mui/material';import type { SxProps, Theme } from '@mui/material';const styles: Record<string, SxProps<Theme>> = {  container: {    p: 2,    display: 'flex',    flexDirection: 'column',    gap: 2,  },  header: {    mb: 3,    fontSize: '1.5rem',    fontWeight: 600,  },};function MyComponent() {  return (    <Paper sx={styles.container}>      <Typography sx={styles.header}>        Title      </Typography>      <Button variant="contained">        Action      </Button>    </Paper>  );}
```
```
import type { SxProps, Theme } from '@mui/material';const componentStyles: Record<string, SxProps<Theme>> = {  container: {    p: 2,    display: 'flex',    flexDirection: 'column',  },  header: {    mb: 2,    color: 'primary.main',  },  button: {    mt: 'auto',    alignSelf: 'flex-end',  },};function Component() {  return (    <Box sx={componentStyles.container}>      <Typography sx={componentStyles.header}>Header</Typography>      <Button sx={componentStyles.button}>Action</Button>    </Box>  );}
```
```
import type { SxProps, Theme } from '@mui/material';const componentStyles: Record<string, SxProps<Theme>> = {  container: {    p: 2,    display: 'flex',    flexDirection: 'column',  },  header: {    mb: 2,    color: 'primary.main',  },  button: {    mt: 'auto',    alignSelf: 'flex-end',  },};function Component() {  return (    <Box sx={componentStyles.container}>      <Typography sx={componentStyles.header}>Header</Typography>      <Button sx={componentStyles.button}>Action</Button>    </Box>  );}
```
```
// UserProfile.styles.tsimport type { SxProps, Theme } from '@mui/material';export const userProfileStyles: Record<string, SxProps<Theme>> = {  container: {    p: 3,    maxWidth: 800,    mx: 'auto',  },  header: {    display: 'flex',    justifyContent: 'space-between',    alignItems: 'center',    mb: 3,  },  // ... many more styles};// UserProfile.tsximport { userProfileStyles as styles } from './UserProfile.styles';function UserProfile() {  return <Box sx={styles.container}>...</Box>;}
```
```
// UserProfile.styles.tsimport type { SxProps, Theme } from '@mui/material';export const userProfileStyles: Record<string, SxProps<Theme>> = {  container: {    p: 3,    maxWidth: 800,    mx: 'auto',  },  header: {    display: 'flex',    justifyContent: 'space-between',    alignItems: 'center',    mb: 3,  },  // ... many more styles};// UserProfile.tsximport { userProfileStyles as styles } from './UserProfile.styles';function UserProfile() {  return <Box sx={styles.container}>...</Box>;}
```
```
// Box - Generic container<Box sx={{ p: 2, bgcolor: 'background.paper' }}>  Content</Box>// Paper - Elevated surface<Paper elevation={2} sx={{ p: 3 }}>  Content</Paper>// Container - Centered content with max-width<Container maxWidth="lg">  Content</Container>// Stack - Flex container with spacing<Stack spacing={2} direction="row">  <Item />  <Item /></Stack>
```
```
// Box - Generic container<Box sx={{ p: 2, bgcolor: 'background.paper' }}>  Content</Box>// Paper - Elevated surface<Paper elevation={2} sx={{ p: 3 }}>  Content</Paper>// Container - Centered content with max-width<Container maxWidth="lg">  Content</Container>// Stack - Flex container with spacing<Stack spacing={2} direction="row">  <Item />  <Item /></Stack>
```
```
import { Grid } from '@mui/material';// 12-column grid<Grid container spacing={2}>  <Grid item xs={12} md={6}>    Left half  </Grid>  <Grid item xs={12} md={6}>    Right half  </Grid></Grid>// Responsive grid<Grid container spacing={3}>  <Grid item xs={12} sm={6} md={4} lg={3}>    Card  </Grid>  {/* Repeat for more cards */}</Grid>
```
```
import { Grid } from '@mui/material';// 12-column grid<Grid container spacing={2}>  <Grid item xs={12} md={6}>    Left half  </Grid>  <Grid item xs={12} md={6}>    Right half  </Grid></Grid>// Responsive grid<Grid container spacing={3}>  <Grid item xs={12} sm={6} md={4} lg={3}>    Card  </Grid>  {/* Repeat for more cards */}</Grid>
```
```
<Typography variant="h1">Heading 1</Typography><Typography variant="h2">Heading 2</Typography><Typography variant="body1">Body text</Typography><Typography variant="caption">Small text</Typography>// With custom styling<Typography  variant="h4"  sx={{    color: 'primary.main',    fontWeight: 600,    mb: 2,  }}>  Custom Heading</Typography>
```
```
<Typography variant="h1">Heading 1</Typography><Typography variant="h2">Heading 2</Typography><Typography variant="body1">Body text</Typography><Typography variant="caption">Small text</Typography>// With custom styling<Typography  variant="h4"  sx={{    color: 'primary.main',    fontWeight: 600,    mb: 2,  }}>  Custom Heading</Typography>
```
```
// Variants<Button variant="contained">Contained</Button><Button variant="outlined">Outlined</Button><Button variant="text">Text</Button>// Colors<Button variant="contained" color="primary">Primary</Button><Button variant="contained" color="secondary">Secondary</Button><Button variant="contained" color="error">Error</Button>// With iconsimport { Add as AddIcon } from '@mui/icons-material';<Button startIcon={<AddIcon />}>Add Item</Button>
```
```
// Variants<Button variant="contained">Contained</Button><Button variant="outlined">Outlined</Button><Button variant="text">Text</Button>// Colors<Button variant="contained" color="primary">Primary</Button><Button variant="contained" color="secondary">Secondary</Button><Button variant="contained" color="error">Error</Button>// With iconsimport { Add as AddIcon } from '@mui/icons-material';<Button startIcon={<AddIcon />}>Add Item</Button>
```
```
import { useTheme } from '@mui/material';function Component() {  const theme = useTheme();  return (    <Box      sx={{        p: 2,        bgcolor: theme.palette.primary.main,        color: theme.palette.primary.contrastText,        borderRadius: theme.shape.borderRadius,      }}    >      Themed box    </Box>  );}
```
```
import { useTheme } from '@mui/material';function Component() {  const theme = useTheme();  return (    <Box      sx={{        p: 2,        bgcolor: theme.palette.primary.main,        color: theme.palette.primary.contrastText,        borderRadius: theme.shape.borderRadius,      }}    >      Themed box    </Box>  );}
```
```
<Box  sx={{    // Access theme in sx    color: 'primary.main',          // theme.palette.primary.main    bgcolor: 'background.paper',     // theme.palette.background.paper    p: 2,                            // theme.spacing(2)    borderRadius: 1,                 // theme.shape.borderRadius  }}>  Content</Box>// Callback for advanced usage<Box  sx={(theme) => ({    color: theme.palette.primary.main,    '&:hover': {      color: theme.palette.primary.dark,    },  })}>  Hover me</Box>
```
```
<Box  sx={{    // Access theme in sx    color: 'primary.main',          // theme.palette.primary.main    bgcolor: 'background.paper',     // theme.palette.background.paper    p: 2,                            // theme.spacing(2)    borderRadius: 1,                 // theme.shape.borderRadius  }}>  Content</Box>// Callback for advanced usage<Box  sx={(theme) => ({    color: theme.palette.primary.main,    '&:hover': {      color: theme.palette.primary.dark,    },  })}>  Hover me</Box>
```
```
// Mobile-first responsive values<Box  sx={{    width: {      xs: '100%',    // 0-600px      sm: '80%',     // 600-900px      md: '60%',     // 900-1200px      lg: '40%',     // 1200-1536px      xl: '30%',     // 1536px+    },  }}>  Responsive width</Box>// Responsive display<Box  sx={{    display: {      xs: 'none',    // Hidden on mobile      md: 'block',   // Visible on desktop    },  }}>  Desktop only</Box>
```
```
// Mobile-first responsive values<Box  sx={{    width: {      xs: '100%',    // 0-600px      sm: '80%',     // 600-900px      md: '60%',     // 900-1200px      lg: '40%',     // 1200-1536px      xl: '30%',     // 1536px+    },  }}>  Responsive width</Box>// Responsive display<Box  sx={{    display: {      xs: 'none',    // Hidden on mobile      md: 'block',   // Visible on desktop    },  }}>  Desktop only</Box>
```
```
<Typography  sx={{    fontSize: {      xs: '1rem',      md: '1.5rem',      lg: '2rem',    },    lineHeight: {      xs: 1.5,      md: 1.75,    },  }}>  Responsive text</Typography>
```
```
<Typography  sx={{    fontSize: {      xs: '1rem',      md: '1.5rem',      lg: '2rem',    },    lineHeight: {      xs: 1.5,      md: 1.75,    },  }}>  Responsive text</Typography>
```
```
import { TextField, Stack, Button } from '@mui/material';<Box component="form" onSubmit={handleSubmit}>  <Stack spacing={2}>    <TextField      label="Email"      type="email"      value={email}      onChange={(e) => setEmail(e.target.value)}      fullWidth      required      error={!!errors.email}      helperText={errors.email}    />    <Button type="submit" variant="contained">Submit</Button>  </Stack></Box>
```
```
import { TextField, Stack, Button } from '@mui/material';<Box component="form" onSubmit={handleSubmit}>  <Stack spacing={2}>    <TextField      label="Email"      type="email"      value={email}      onChange={(e) => setEmail(e.target.value)}      fullWidth      required      error={!!errors.email}      helperText={errors.email}    />    <Button type="submit" variant="contained">Submit</Button>  </Stack></Box>
```
```
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';<Card>  <CardContent>    <Typography variant="h5" component="div">      Title    </Typography>    <Typography variant="body2" color="text.secondary">      Description    </Typography>  </CardContent>  <CardActions>    <Button size="small">Learn More</Button>  </CardActions></Card>
```
```
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';<Card>  <CardContent>    <Typography variant="h5" component="div">      Title    </Typography>    <Typography variant="body2" color="text.secondary">      Description    </Typography>  </CardContent>  <CardActions>    <Button size="small">Learn More</Button>  </CardActions></Card>
```
```
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';<Dialog open={open} onClose={handleClose}>  <DialogTitle>Confirm Action</DialogTitle>  <DialogContent>    Are you sure you want to proceed?  </DialogContent>  <DialogActions>    <Button onClick={handleClose}>Cancel</Button>    <Button onClick={handleConfirm} variant="contained">      Confirm    </Button>  </DialogActions></Dialog>
```
```
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';<Dialog open={open} onClose={handleClose}>  <DialogTitle>Confirm Action</DialogTitle>  <DialogContent>    Are you sure you want to proceed?  </DialogContent>  <DialogActions>    <Button onClick={handleClose}>Cancel</Button>    <Button onClick={handleConfirm} variant="contained">      Confirm    </Button>  </DialogActions></Dialog>
```
```
import { CircularProgress, Skeleton } from '@mui/material';// Spinner<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>  <CircularProgress /></Box>// Skeleton<Stack spacing={1}>  <Skeleton variant="text" width="60%" />  <Skeleton variant="rectangular" height={200} />  <Skeleton variant="text" width="40%" /></Stack>
```
```
import { CircularProgress, Skeleton } from '@mui/material';// Spinner<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>  <CircularProgress /></Box>// Skeleton<Stack spacing={1}>  <Skeleton variant="text" width="60%" />  <Skeleton variant="rectangular" height={200} />  <Skeleton variant="text" width="40%" /></Stack>
```
```
import { useMuiSnackbar } from '@/hooks/useMuiSnackbar';function Component() {  const { showSuccess, showError, showInfo } = useMuiSnackbar();  const handleSave = async () => {    try {      await saveData();      showSuccess('Saved successfully');    } catch (error) {      showError('Failed to save');    }  };  return <Button onClick={handleSave}>Save</Button>;}
```
```
import { useMuiSnackbar } from '@/hooks/useMuiSnackbar';function Component() {  const { showSuccess, showError, showInfo } = useMuiSnackbar();  const handleSave = async () => {    try {      await saveData();      showSuccess('Saved successfully');    } catch (error) {      showError('Failed to save');    }  };  return <Button onClick={handleSave}>Save</Button>;}
```
```
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';import { Button, IconButton } from '@mui/material';<Button startIcon={<AddIcon />}>Add</Button><IconButton onClick={handleDelete}><DeleteIcon /></IconButton>
```
```
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';import { Button, IconButton } from '@mui/material';<Button startIcon={<AddIcon />}>Add</Button><IconButton onClick={handleDelete}><DeleteIcon /></IconButton>
```
```
import type { SxProps, Theme } from '@mui/material';// ✅ Goodconst styles: Record<string, SxProps<Theme>> = {  container: { p: 2 },};// ❌ Avoidconst styles = {  container: { p: 2 }, // No type safety};
```
```
import type { SxProps, Theme } from '@mui/material';// ✅ Goodconst styles: Record<string, SxProps<Theme>> = {  container: { p: 2 },};// ❌ Avoidconst styles = {  container: { p: 2 }, // No type safety};
```
```
// ✅ Good: Use theme tokens<Box sx={{ color: 'primary.main', p: 2 }} />// ❌ Avoid: Hardcoded values<Box sx={{ color: '#1976d2', padding: '16px' }} />
```
```
// ✅ Good: Use theme tokens<Box sx={{ color: 'primary.main', p: 2 }} />// ❌ Avoid: Hardcoded values<Box sx={{ color: '#1976d2', padding: '16px' }} />
```
```
// ✅ Good: Use spacing scale<Box sx={{ p: 2, mb: 3, mt: 1 }} />// ❌ Avoid: Random pixel values<Box sx={{ padding: '17px', marginBottom: '25px' }} />
```
```
// ✅ Good: Use spacing scale<Box sx={{ p: 2, mb: 3, mt: 1 }} />// ❌ Avoid: Random pixel values<Box sx={{ padding: '17px', marginBottom: '25px' }} />
```
Unlock the full potential of Material-UI v7 with this specialized AI agent skill. Designed for developers utilizing modern React UI frameworks, it provides precise guidance on navigating MUI's latest features. From mastering the `sx` prop for flexible styling to seamlessly integrating themes and crafting responsive layouts, this skill acts as your expert assistant. Leverage its insights to build beautiful, performant user interfaces efficiently, staying ahead with the most current best practices in MUI development. Elevate your coding workflow and reduce development time with intelligent, context-aware suggestions tailored to your Material-UI projects.

# When to Use This Skill
- •Implementing responsive designs using MUI breakpoints and the `sx` prop.
- •Customizing MUI components extensively through the `sx` prop and theme overrides.
- •Integrating and extending the Material-UI theme to maintain a consistent design system.
- •Migrating existing Material-UI v6 projects to v7, understanding breaking changes and new patterns.

# Pro Tips
- 💡Always define complex `sx` props outside the component as a constant object to improve readability and maintainability, especially for conditional styles.
- 💡Leverage MUI's theme customization features to create a robust design system, ensuring consistent styling across your application rather than applying individual `sx` props everywhere.
- 💡Utilize the `slots` and `slotProps` pattern for advanced customization of internal component elements, providing more control without ejecting from the MUI component.

