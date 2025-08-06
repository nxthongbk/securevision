import { SnackbarOrigin, VariantType, enqueueSnackbar } from 'notistack';

import { t } from 'i18next';

const handleNotificationMessege = (messege: string, variant?: VariantType, anchorOrigin?: SnackbarOrigin) => {
  enqueueSnackbar(t(messege), { variant, anchorOrigin });
};
export default handleNotificationMessege;
