import { Image } from "@mantine/core";

const Logo = () => {
    return (  
        <Image
            src="./logo.png"
            alt="Mantine logo"
            width={267}

            height={100}
            fit="contain"
        />
    );
}
 
export default Logo;