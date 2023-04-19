import { Image } from "@mantine/core";

const Logo = () => {
    return (  
        <Image
            src="./logo.png"
            alt="MC Dental Clinic Logo"
            width={267}

            height={100}
            fit="contain"
        />
    );
}
 
export default Logo;