import { Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../../theme";

const Header = ({ title, subTitle }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    console.log('Current colors:', colors); // Log colors to debug

    return (
        <Box
            mb={isMobile ? "20px" : "30px"}
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                backgroundColor: colors.primary[500],
                zIndex: 100,
                padding: isMobile ? "10px 20px" : "20px 40px"
            }}
        >
            <Typography
                variant={isMobile ? "h3" : "h2"}
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ mb: isMobile ? "2px" : "5px", ml: isMobile ? "30px" : "100px" }}
            >
                {title}
            </Typography>
            <Typography
                variant={isMobile ? "h6" : "h4"}
                color={colors.greenAccent[200]}
                fontWeight="bold"
                sx={{ ml: isMobile ? "30px" : "100px" }}
            >
                {subTitle}
            </Typography>
        </Box>
    );
}

export default Header;