import { Box } from "@mui/material";
import CustomMap from "~/components/LeafletMapBox";
import { popupStyles } from "../../styled";




export default function MiniMap() {
  return (
    <Box sx={popupStyles}>
      <CustomMap initialCenter={{ lat: 9.046899109071589, lng: 7.491645812988281 }} 

       />
    </Box>
  );
}
