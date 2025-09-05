import { ChangeEvent, useMemo, useState } from 'react';
import HandleScrollPage from '~/components/HandleScrollPage';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import DataGridHeader, { FilterInterface } from '~/components/DataGrid/DataGridHeader';
import { useUserTableColumns } from './tableColumns';
import { UserItem } from './type';
import { useTranslation } from 'react-i18next';
import PopupDetail from './Popup/PopupDetail';
import PopupUpsertEmployee from './Popup/PopupUpsertEmployee';
import PopupDelete from './Popup/PopupDelete';
import { useGetLocations } from '../LocationPage/handleApi';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import PopupResetPassword from './Popup/PopupResetPassword';
import PopupChangeStaffStatus from './Popup/PopupChangeStaffStatus';
import PermisisonConfigDrawer from './PermissionConfigDrawer';
import { useGetPermissionConfigs, useGetStaffs } from './handleApi';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import { useLocation } from 'react-router-dom';
import { usePermissions } from '~/utils/hooks/usePermission';
import ForbiddenPage from '~/pages/common/403';

export default function userPage() {
  const theme = useTheme();
  const isBelowDesktop = useMediaQuery(theme.breakpoints.down('desktop'));
  const isMiniLaptop = useMediaQuery(theme.breakpoints.down('laptop'));

  const [userPageTranslate] = useTranslation('', { keyPrefix: 'user-page' });

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [openDetailPopup, setOpenDetailPopup] = useState<boolean>(false);
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [openEditPopup, setOpenEditPopup] = useState<boolean>(false);
  const [openResetPasswordPopup, setOpenResetPasswordPopup] = useState<boolean>(false);
  const [openChangeStatusPopup, setOpenChangeStatusPopup] = useState<string>('');

  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(30);

  const [locationFilter, setLocationFilter] = useState<string>(params.get('locationId') || '');
  const [permissionGroupFilter, setPermissionGroupFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [staffDetail, setStaffDetail] = useState<Record<string, any> | null>(null);

  const { tenantCode } = useTenantCode();

  const { isLoading, data } = useGetStaffs({
    page: page - 1,
    size,
    keyword,
    tenantCode,
    locationId: locationFilter,
    permissionGroupId: permissionGroupFilter,
    status: statusFilter
  });

  const { data: locations } = useGetLocations(0, 50, '', tenantCode);
  const { data: permissionConfigs } = useGetPermissionConfigs(0, 100, '', tenantCode);

  const onDetail = (staffData) => {
    setOpenDetailPopup(true);
    setStaffDetail(staffData);
  };
  const onDelete = () => setOpenDeletePopup(true);
  const onEdit = () => setOpenEditPopup(true);
  const onResetPassword = () => setOpenResetPasswordPopup(true);
  const onChangeStatus = (status) => setOpenChangeStatusPopup(status);

  const { hasView, hasEdit } = usePermissions('VIEW_STAFF', 'UPDATE_STAFF', tenantCode);

  const { tableColumns, selectedStaffId } = useUserTableColumns(
    isMiniLaptop,
    onDetail,
    onDelete,
    onChangeStatus,
    hasEdit
  );

  const tableRows = useMemo(() => {
    const rows = (data?.data?.content || []).map((item: UserItem, index) => {
      const locations = item?.locations || [];
      const firstLocation = locations[0]?.name || '';
      const locationValue = locations.length > 1 ? `${firstLocation} (+${locations.length - 1})` : firstLocation;

      return {
        id: item.id,
        staffCode: String(item?.code ?? index + 1).padStart(4, '0'),
        userName: item?.username,
        fullName: item?.name,
        phone: item?.phone,
        location: item?.assignAllLocations ? userPageTranslate('all') : locationValue,
        status: item?.status,
        permissionGroupName: item?.permissionGroup?.name,
        avatarUrl: item?.avatarUrl,
        dataIndex: item
      };
    });
    return rows;
  }, [data?.data?.content, userPageTranslate]);

  const totalRecords = data?.data?.total || 0;

  const statusOptions = useMemo(
    () => [
      { id: 'active', name: userPageTranslate('active'), value: 'ACTIVE' },
      { id: 'blocked', name: userPageTranslate('blocked'), value: 'BLOCKED' }
    ],
    [userPageTranslate]
  );

  const locationOptions = useMemo(() => {
    const content = locations?.data?.content || [];
    const options = content.map((item) => ({ id: String(item?.id).padStart(4, '0'), name: item.name, value: item.id }));
    return options;
  }, [locations]);

  const permissionConfigOptions = useMemo(() => {
    const content = permissionConfigs?.data?.content || [];
    const options = content.map((item) => ({ id: item?.id, name: item.name, value: item.id }));
    return options;
  }, [permissionConfigs]);

  if (!hasEdit && !hasView) {
    return (
      <HandleScrollPage
        props={{
          title: 'user-page.management'
        }}
      >
        <ForbiddenPage />
      </HandleScrollPage>
    );
  }

  const filter: FilterInterface[] = [
    {
      id: 'location',
      label: userPageTranslate('location'),
      onChange(e: ChangeEvent<HTMLSelectElement>) {
        setLocationFilter(e?.target?.value);
      },
      value: locationFilter,
      isHiddenPlacehoder: !locationFilter,
      placeholder: userPageTranslate('select-location'),
      option: locationOptions
    },
    {
      id: 'permission',
      label: userPageTranslate('permission'),
      onChange(e: ChangeEvent<HTMLSelectElement>) {
        setPermissionGroupFilter(e?.target?.value);
      },
      value: permissionGroupFilter,
      isHiddenPlacehoder: !permissionGroupFilter,
      placeholder: userPageTranslate('select-permission'),
      option: permissionConfigOptions
    },
    {
      id: 'status',
      label: userPageTranslate('status'),
      onChange(e: ChangeEvent<HTMLSelectElement>) {
        setStatusFilter(e?.target?.value);
      },
      value: statusFilter,
      isHiddenPlacehoder: !statusFilter,
      placeholder: userPageTranslate('select-status'),
      option: statusOptions
    }
  ];

  const disableResetFilter = !locationFilter && !permissionGroupFilter && !statusFilter;

  const handleResetFilter = () => {
    setLocationFilter('');
    setPermissionGroupFilter('');
    setStatusFilter('');
    setPage(1);
  };

  return (
    <HandleScrollPage
      props={{
        title: 'user-page.management',
        btnPopup: (
          <Box className='flex gap-4'>
            <PermisisonConfigDrawer tenantCode={tenantCode} />
            {hasEdit && <PopupUpsertEmployee />}
          </Box>
        )
      }}
    >
      <DataGridHeader
        filter={filter}
        keyword={keyword}
        setKeyword={setKeyword}
        isSearch
        disableResetFilter={disableResetFilter}
        handleResetFilter={handleResetFilter}
        filterFullwidth={isBelowDesktop}
        title={'user-page.management'}
        btnPopup={
          <Box className='flex gap-4'>
            <PermisisonConfigDrawer tenantCode={tenantCode} />
            {hasEdit && <PopupUpsertEmployee />}
          </Box>
        }
      />
      <CustomDataGrid
        rows={tableRows}
        columns={tableColumns}
        page={page}
        setPage={setPage}
        size={size}
        setSize={setSize}
        total={totalRecords}
        rowHeight={56}
        emptyMessage={userPageTranslate('no-data')}
        explainName={userPageTranslate('personel')}
        loading={isLoading}
        columnsVisible={{
          permissionGroupName: !isBelowDesktop,
          phone: !isMiniLaptop
        }}
      />
      {openDetailPopup && (
        <PopupDetail
          open={openDetailPopup}
          staffDetail={staffDetail}
          tenantCode={tenantCode}
          onClose={() => setOpenDetailPopup(false)}
          onEdit={onEdit}
          onResetPassword={onResetPassword}
          hasEdit={hasEdit}
        />
      )}
      {openDeletePopup && (
        <PopupDelete staffId={selectedStaffId} open={openDeletePopup} onClose={() => setOpenDeletePopup(false)} />
      )}
      {openResetPasswordPopup && (
        <PopupResetPassword
          staffId={selectedStaffId}
          staffDetail={staffDetail}
          open={openResetPasswordPopup}
          onClose={() => setOpenResetPasswordPopup(false)}
        />
      )}
      {!!openChangeStatusPopup && (
        <PopupChangeStaffStatus
          staffId={selectedStaffId}
          open={!!openChangeStatusPopup}
          desiredStatus={openChangeStatusPopup}
          onClose={() => setOpenChangeStatusPopup('')}
        />
      )}
      {openEditPopup && (
        <PopupUpsertEmployee
          staffId={selectedStaffId}
          tenantCode={tenantCode}
          forceOpen={openEditPopup}
          onClose={() => setOpenEditPopup(false)}
        />
      )}
    </HandleScrollPage>
  );
}
