import { Box, Button, Drawer, Typography } from '@mui/material';
import { GearSix } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HandleScrollPage from '~/components/HandleScrollPage';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import { useDrawerColumns } from './drawerColumns';
import DrawerHeader from './drawerHeader';
import PopupUpsertConfig from './Popup/PopupUpsertConfig';
import { useGetPermissionConfigs } from '../handleApi';
import PopupConfigDetail from './Popup/PopupConfigDetail';
import PopupDeletePermissionConfig from './Popup/PopupDeletePermissionConfig';

export default function PermisisonConfigDrawer({ tenantCode }: { tenantCode: string }) {
  const [userPageTranslate] = useTranslation('', { keyPrefix: 'user-page' });
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState<string>('');

  const { data, isLoading } = useGetPermissionConfigs(0, 100, keyword, tenantCode);

  const [openDetailPopup, setOpenDetailPopup] = useState<boolean>(false);
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [openEditPopup, setOpenEditPopup] = useState<boolean>(false);
  const [staffCount, setStaffCount] = useState<number>(null);

  const onDetail = () => {
    setOpenDetailPopup(true);
  };
  const onDelete = (staffCount: number) => {
    setOpenDeletePopup(true);
    setStaffCount(staffCount);
  };
  const onEdit = () => setOpenEditPopup(true);

  const { tableColumns, permissionGroupId } = useDrawerColumns(onDetail, onDelete);

  const toggleDrawer = (newOpen: boolean) => () => {
    if (!newOpen) {
      setKeyword('');
    }
    setOpen(newOpen);
  };

  const tableRows = useMemo(() => {
    if (data?.data) {
      return (data?.data?.content || []).map((record) => ({
        id: record.id,
        code: record.code,
        configName: record.name,
        staffCount: record.userCount
      }));
    }
    return [];
  }, [data]);

  const DrawerList = (
    <Box
      sx={{ width: 1024 }}
      role='presentation'
      onClick={(event) => {
        event.stopPropagation();
        toggleDrawer(false);
      }}
    >
      <HandleScrollPage
        props={{
          title: 'user-page.permission-config'
        }}
      >
        <DrawerHeader keyword={keyword} setKeyword={setKeyword} actionPopup={<PopupUpsertConfig />} />
        <CustomDataGrid
          rows={tableRows}
          columns={tableColumns}
          rowHeight={56}
          emptyMessage={userPageTranslate('no-data')}
          explainName={userPageTranslate('personel')}
          loading={isLoading}
        />
      </HandleScrollPage>
    </Box>
  );

  return (
    <div>
      <Button variant='outlined' color='primary' onClick={() => setOpen(true)} startIcon={<GearSix size={20} />}>
        <Typography variant='button3'>{userPageTranslate('permission-config')}</Typography>
      </Button>
      <Drawer anchor='right' open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      {openDetailPopup && (
        <PopupConfigDetail
          open={openDetailPopup}
          onClose={() => setOpenDetailPopup(false)}
          permissionGroupId={permissionGroupId}
          tenantCode={tenantCode}
          onEdit={onEdit}
        />
      )}
      {openEditPopup && (
        <PopupUpsertConfig
          permissionGroupId={permissionGroupId}
          tenantCode={tenantCode}
          forceOpen={openEditPopup}
          onClose={() => setOpenEditPopup(false)}
        />
      )}
      {openDeletePopup && (
        <PopupDeletePermissionConfig
          open={openDeletePopup}
          onClose={() => setOpenDeletePopup(false)}
          permissionGroupId={permissionGroupId}
          staffCount={staffCount}
        />
      )}
    </div>
  );
}
