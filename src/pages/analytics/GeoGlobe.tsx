import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export function GeoGlobe() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Geo / 3D Аналітика
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">
          Lazy-load Three.js (react-three-fiber) або 2D fallback. Heatmap, popup метрики, timeline анімація.
        </Typography>
        <Box sx={{ mt: 2, height: 360, bgcolor: 'background.default' }}>3D Globe placeholder</Box>
      </Paper>
    </Box>
  );
}
