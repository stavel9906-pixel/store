import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export const Symbol = () => {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        <CardContent sx={{ display: 'flex', flexDirection: "row"}}>
          <CardMedia
        component="img"
        sx={{ width: 200 }}
        image="/src/images/icon.webp"
        alt="Live from space album cover"
      />
      
          <Typography sx={{fontWeight: 'bold', fontSize: 100, marginTop: 3}}>
            The
          </Typography>
          <Typography
            sx={{ color: 'text.secondary', fontSize: 100, marginTop: 3 }}
          >
            Mall
          </Typography>
        </CardContent>
      </Box>


    </>
  );
};
