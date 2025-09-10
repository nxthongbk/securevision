import { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import HandleScrollPage from '~/components/HandleScrollPage';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import DataGridHeader from '~/components/DataGrid/DataGridHeader';
import { useLocationTableColumns } from './tableColumns';
import { useGetLocations } from './handleApi';
import { AppContext } from '~/contexts/app.context';
import { LocationItem } from './type';
import { useTranslation } from 'react-i18next';
import PopupLocationDetail from './Popup/PopupLocationDetail';
import { UserRole } from '~/utils/constant';
import PopupManipulateLocation from './Popup/PopupManipulateLocation';
import PopupDelete from './Popup/PopupDelete';
import { usePermissions } from '~/utils/hooks/usePermission';
import ForbiddenPage from '~/pages/common/403';

export default function LocationPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { t } = useTranslation();
  const { userInfo } = useContext(AppContext);
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [openEditPopup, setOpenEditPopup] = useState<boolean>(false);
  const [openDetailPopup, setOpenDetailPopup] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(30);
  const userRole = userInfo?.roles?.[0];
  const tenantCode =
    userRole === UserRole.SYSADMIN
      ? params.get('tenantCode')
      : userRole === UserRole.TENANT
        ? userInfo?.tenantCode
        : '';

  const { isLoading, data } = useGetLocations(page - 1, size, keyword, tenantCode);

  function onDelete() {
    setOpenDeletePopup(true);
  }

  function onEdit() {
    setOpenEditPopup(true);
  }

  function onDetail() {
    setOpenDetailPopup(true);
  }

  useEffect(() => {
    if (!keyword) {
      setPage(1);
    }
  }, [keyword]);

  const { hasView, hasEdit } = usePermissions('VIEW_LOCATION', 'UPDATE_LOCATION', tenantCode);

  const { tableColumns, selectedLocationId } = useLocationTableColumns(userRole, onDelete, onDetail, hasEdit);

  const tableRows = useMemo(() => {
    const rows = (data?.data?.content || []).map((item: LocationItem) => {
      return {
        locationId: item.id,
        id: String(item?.code).padStart(4, '0'),
        locationName: item?.name,
        address: item?.address,
        totalDevices: item.devices?.total,
        totalActiveDevices: item.devices?.totalActive,
        tenantInfoName: item.tenantInfo?.name,
        tenantInfoPhone: item.tenantInfo?.phone || userInfo.phone,
        tenantCode: item.tenantInfo?.code || '',
        operatorName: item.operatorInfo?.name,
        operatorPhone: item.operatorInfo?.phone,
        operatorCode: item.operatorInfo?.code || '',
        imageUrl: item?.imageUrl
      };
    });
    return rows;
  }, [data?.data?.content, userInfo.phone]);

  const totalRecords = data?.data?.total || 0;

  if (!hasEdit && !hasView) {
    return (
      <HandleScrollPage
        props={{
          title: 'locationPage.location-management'
        }}
      >
        <ForbiddenPage />
      </HandleScrollPage>
    );
  }

  return (
    <HandleScrollPage
      props={{
        title: 'locationPage.location-management',
        btnPopup: hasEdit && <PopupManipulateLocation userRole={userRole} tenantCode={tenantCode} />
      }}
    >
      <DataGridHeader
        keyword={keyword}
        setKeyword={setKeyword}
        isSearch
        // title={'locationPage.location-management'} no longer needed
        btnPopup={hasEdit && <PopupManipulateLocation userRole={userRole} tenantCode={tenantCode} />} 
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
        emptyMessage={t('no-data')}
        explainName={t('locationPage.location')}
        loading={isLoading}
      />
      {openDetailPopup && (
        <PopupLocationDetail
          locationId={selectedLocationId}
          tenantCode={userInfo?.tenantCode}
          onEdit={onEdit}
          userRole={userRole}
          forceOpen={openDetailPopup}
          onClose={() => setOpenDetailPopup(false)}
          hasEdit={hasEdit}
        />
      )}
      {openDeletePopup && (
        <PopupDelete locationId={selectedLocationId} open={openDeletePopup} onClose={() => setOpenDeletePopup(false)} />
      )}
      {openEditPopup && (
        <PopupManipulateLocation
          locationId={selectedLocationId}
          tenantCode={userInfo?.tenantCode}
          forceOpen={openEditPopup}
          onClose={() => setOpenEditPopup(false)}
          userRole={userRole}
        />
      )}
    </HandleScrollPage>
  );
}
