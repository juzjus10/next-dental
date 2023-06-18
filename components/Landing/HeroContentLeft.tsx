import { createStyles, Overlay, Container, Title, Button, Text, rem } from '@mantine/core';
import heroBanner from 'public/hero.jpg';


const useStyles = createStyles((theme) => ({
  hero: {
    position: 'relative',
    backgroundImage: `url(${heroBanner.src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
   
    height: rem(700),
  },

 
}));

export function HeroContentLeft() {
  const { classes } = useStyles();

  return (
    <div className={classes.hero}>
    
     
    </div>
  );
}