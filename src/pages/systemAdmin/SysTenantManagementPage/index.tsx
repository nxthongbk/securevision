import { Button, Typography, useMediaQuery } from '@mui/material';
import DataGridHeader, { FilterInterface, OptionInterface } from '~/components/DataGrid/DataGridHeader';
import { useEffect, useMemo, useState } from 'react';

import CardProfile from './Card/CardProfile';
import ColumnTenent from './ColumnTenant';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import DropDownActionTable from '~/components/DropdownActionTable';
import HandleScrollPage from '~/components/HandleScrollPage';
import { IRowDataTableUserProfile } from '~/@types/tenant/tenant.type';
import IconPhosphor from '~/assets/iconPhosphor';
import ListCard from '~/components/ListCard';
import PaginationComponent from '~/components/DataGrid/Pagination';
import PopupAccessTenant from './Popup/PopupAccess';
import PopupAddTenant from './Popup/PopupAdd';
import PopupEditTenant from './Popup/PopupEdit';
import PopupInforTenant from './Popup/PopupInfor';
import PopupLockUnLockTenant from './Popup/PopupLockUnLock';
import PopupResrtPasswordTenant from './Popup/PopupForgetPassword';
import theme from '~/assets/theme';
import { translationCapitalFirst } from '~/utils/translate';
import { useGetDataTenant } from './handleApi';
import { useTranslation } from 'react-i18next';

const init = {
  avatarUrl: '',
  id: '',
  code: '',
  tenant: '',
  userName: '',
  address: '',
  phoneNumber: '',
  email: '',
  status: '',
  action: ''
};

export default function SysTenantManagementPage() {
  const [keyword, setKeyword] = useState<string>('');
  const [size, setSize] = useState<number>(30);
  const [page, setPage] = useState<number>(1);
  const [curStatus, setCurStatus] = useState<string>('');
  const [isStatusPlaceholderShowedStatus, setIsStatusPlaceholderShowedStatus] = useState(true);

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [rowSected, setRowSelected] = useState(init);

  const isMiniLaptop = useMediaQuery(theme.breakpoints.up('laptop'));
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));

  const { dataTenant, isLoadingTenant } = useGetDataTenant({ keyword, page: page - 1, size, status: curStatus });
  const [t] = useTranslation();

  const handleCloseEdit = () => {
    setShowPopup(false);
  };

  const handleOpenInfo = (row: any) => {
    setShowPopup(true);
    setRowSelected(row);
  };

  const rows: IRowDataTableUserProfile[] = useMemo(() => {
    if (dataTenant?.data) {
      const result = dataTenant?.data?.content?.map((item: any) => {
        return {
          avatarUrl: item?.avatarUrl,
          id: item?.id,
          code: item?.code,
          tenant: item?.name,
          userName: item?.username,
          address: item?.address,
          phoneNumber: item?.phone,
          email: item?.email,
          status: item?.status,
          action: item?.id,
          tenantId: String(item?.tenantId).padStart(4, '0')
        };
      });
      return result;
    } else {
      return [];
    }
  }, [dataTenant]);
  
  const total: number = useMemo(() => {
    if (dataTenant?.data) {
      const result = dataTenant?.data?.total;
      return result;
    } else {
      return 0;
    }
  }, [dataTenant]);

  //  Example Filter
  const handleChooseStatust = (e: any) => {
    setIsStatusPlaceholderShowedStatus(false);
    setCurStatus(e?.target?.value);
  };
  const optionStatus: OptionInterface[] = [
    { id: 'active', name: translationCapitalFirst('active', 'tenantPage'), value: 'ACTIVE' },
    { id: 'blocked', name: translationCapitalFirst('blocked', 'tenantPage'), value: 'BLOCKED' }
  ];
  const filter: FilterInterface[] = [
    {
      id: 'choose-company',
      label: translationCapitalFirst('status', 'tenantPage'),
      onChange(e: any) {
        handleChooseStatust(e);
      },
      value: curStatus,
      isHiddenPlacehoder: isStatusPlaceholderShowedStatus,
      placeholder: translationCapitalFirst('select-status', 'tenantPage'),
      option: optionStatus
    }
  ];

  useEffect(() => {
    setPage(1);
  }, [keyword, size, curStatus]);

  const handleResetFilter = () => {
    // setKeyword('');
    setCurStatus('');
    setPage(1);
    setIsStatusPlaceholderShowedStatus(true);
  };

  return (
    <HandleScrollPage props={{ title: 'tenantPage.tenant-management', btnPopup: <PopupAddTenant /> }}>
      <DataGridHeader
        isSearch
        keyword={keyword}
        setKeyword={setKeyword}
        disableResetFilter={!curStatus}
        filter={filter}
        handleResetFilter={handleResetFilter}
        title={translationCapitalFirst('tenant-management', 'tenantPage')}
        btnPopup={<PopupAddTenant />}
      />
      {isTablet ? (
        <ListCard>
          {rows.map((row) => (
            <CardProfile
              key={row.id}
              action={
                <DropDownActionTable
                  mainBtn={<PopupAccessTenant tenantCode={row.id} />}
                  childrent={() => [
                    {
                      key: 'infor',
                      component: (
                        <PopupInforTenant
                          props={{
                            openInfo: showPopup,
                            footerBtn: (
                              <Button
                                fullWidth
                                variant='contained'
                                color='primary'
                                startIcon={<IconPhosphor iconName='PencilSimple' size={20} color='white' />}
                                onClick={() => {
                                  handleOpenInfo(row);
                                }}
                              >
                                <Typography variant='button3' color='white'>
                                  {translationCapitalFirst('update')}
                                </Typography>
                              </Button>
                            ),
                            ...row
                          }}
                        />
                      )
                    },
                    // { key: 'edit', component: <PopupEditTenant props={params.row} /> },
                    { key: 'lock-unlock', component: <PopupLockUnLockTenant props={row} /> },
                    {
                      key: 'reset-password',
                      component: <PopupResrtPasswordTenant id={row.id} phone={row.phoneNumber} />
                    }
                  ]}
                />
              }
              avatarUrl={row.avatarUrl}
              tenant={row.tenant}
              tenantId={row.tenantId}
              status={row.status}
            />
          ))}
          <PaginationComponent page={page} setPage={setPage} size={size} setSize={setSize} total={total} />
        </ListCard>
      ) : (
        <CustomDataGrid
          columns={ColumnTenent({ openPopup: showPopup, handleOpenInfo })}
          rows={rows}
          emptyMessage={
            keyword || curStatus
              ? translationCapitalFirst('no-data')
              : translationCapitalFirst('no-tenant', 'tenantPage')
          }
          explainName={rows.length > 0 ? t('tenants') : t('tenant')}
          columnsVisible={{
            email: isMiniLaptop
          }}
          loading={isLoadingTenant}
          setPage={setPage}
          setSize={setSize}
          total={total}
          page={page}
          size={size}
        />
      )}
      {showPopup && <PopupEditTenant props={{ handleCloseEdit, openEdit: showPopup, ...rowSected }} />}
    </HandleScrollPage>
  );
}
