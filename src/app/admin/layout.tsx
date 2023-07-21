'use client'

import { Container, Grid } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const defaultTheme = createTheme()

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={8} lg={9}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}
